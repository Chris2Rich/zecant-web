import React, { useMemo } from 'react';
import Markdown from 'markdown-to-jsx';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { StockChart } from "@/components/StockChart";
import { GenericChart } from "@/components/Chart"

type MarkdownRenderProps = {
  message: string;
};

// Direct KaTeX renderer component
function KatexMath({ latex, display }: { latex: string; display: boolean }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: display,
        throwOnError: false,
        errorColor: '#C00',
        strict: false,
        trust: true,
      });
    } catch (e) {
      const escaped = display ? `$$${latex}$$` : `$${latex}$`;
      return `<span style="color: #C00;">${escaped}</span>`;
    }
  }, [latex, display]);

  return display ? (
    <span 
      className="block my-4 text-center" 
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : (
    <span 
      className="inline-block align-middle" 
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function CodeBlock({ className, children }: { className?: string; children: string }) {
  const language = className?.replace('lang-', '') || 'text';
  
  return (
    <SyntaxHighlighter
      language={language}
      style={nord}
      customStyle={{
        margin: '1rem 0',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
      }}
      showLineNumbers={false}
    >
      {children}
    </SyntaxHighlighter>
  );
}

const BLOCK_ELEMENTS = new Set([
  'address', 'article', 'aside', 'blockquote', 'canvas', 'dd', 'div',
  'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
  'h1','h2','h3','h4','h5','h6','header','hr','li','main','nav',
  'noscript','ol','p','pre','section','table','tfoot','ul','video'
]);

// Helper to check if a React child is a block element
function isBlockElement(child: React.ReactNode): boolean {
  if (!React.isValidElement(child)) return false;
  const type = child.type;
  if (typeof type === 'string') {
    return BLOCK_ELEMENTS.has(type.toLowerCase());
  }
  // For custom React components, assume they render a block-level element
  return true;
}

export default function MarkdownRender({ message }: MarkdownRenderProps) {
  // Step 1: Extract component blocks, code blocks, inline code, then LaTeX
  const { processedText, mathMap, componentMap } = useMemo(() => {
    let text = message.normalize("NFKD");
    const mathMapLocal = new Map<string, { latex: string; display: boolean }>();
    const codeMapLocal = new Map<string, string>();
    const componentMapLocal = new Map<string, { type: string; params: any }>();
    let mathCounter = 0;
    let codeCounter = 0;
    let componentCounter = 0;
    
    // Remove thinking blocks - they are displayed separately in ThinkingPanel
    text = text.replace(/:::thinking[\s\S]*?:::/g, "");
    
    // First, extract component blocks (:::function ... :::)
    text = text.replace(/:::(\w+)\n([\s\S]*?):::/g, (match, functionName, params) => {
      const marker = `§§COMPONENT${componentCounter}§§`;
      
      try {
        // Try to parse params as JSON
        const parsedParams = JSON.parse(params.trim());
        componentMapLocal.set(marker, { type: functionName, params: parsedParams });
      } catch (e) {
        // If not JSON, treat as plain text
        componentMapLocal.set(marker, { type: functionName, params: { text: params.trim() } });
      }
      
      componentCounter++;
      return `\n\n${marker}\n\n`;
    });
    
    // Protect code blocks (``` ... ```)
    text = text.replace(/```[\s\S]*?```/g, (match) => {
      const marker = `§§CODE${codeCounter}§§`;
      codeMapLocal.set(marker, match);
      codeCounter++;
      return marker;
    });
    
    // Protect inline code (` ... `)
    text = text.replace(/`[^`]+?`/g, (match) => {
      const marker = `§§CODE${codeCounter}§§`;
      codeMapLocal.set(marker, match);
      codeCounter++;
      return marker;
    });
    
    // Process LaTeX (code blocks are protected)
    
    // Display math: $$...$$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, latex) => {
      const marker = `§§MATH${mathCounter}§§`;
      mathMapLocal.set(marker, { latex: latex.trim(), display: true });
      mathCounter++;
      return marker;
    });
    
    // Display math: \[...\]
    text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, latex) => {
      const marker = `§§MATH${mathCounter}§§`;
      mathMapLocal.set(marker, { latex: latex.trim(), display: true });
      mathCounter++;
      return marker;
    });
    
    // Inline math: \(...\)
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, latex) => {
      const marker = `§§MATH${mathCounter}§§`;
      mathMapLocal.set(marker, { latex: latex.trim(), display: false });
      mathCounter++;
      return marker;
    });
    
    // Restore code blocks and inline code
    text = text.replace(/§§CODE\d+§§/g, (marker) => {
      return codeMapLocal.get(marker) || marker;
    });
    
    return { 
      processedText: text, 
      mathMap: mathMapLocal,
      componentMap: componentMapLocal
    };
  }, [message]);

  // Step 2: Replace markers with React components
  const replaceMarkers = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string') {
      // Check if string contains any markers
      if (!node.includes('§§MATH') && !node.includes('§§COMPONENT')) {
        return node;
      }

      const parts: (string | JSX.Element)[] = [];
      const markerRegex = /§§(MATH|COMPONENT)(\d+)§§/g;
      let lastIndex = 0;
      let match;
      let key = 0;

      while ((match = markerRegex.exec(node)) !== null) {
        // Add text before marker
        if (match.index > lastIndex) {
          parts.push(node.substring(lastIndex, match.index));
        }

        const markerType = match[1];
        const marker = match[0];

        if (markerType === 'MATH') {
          // Add math component
          const mathData = mathMap.get(marker);
          if (mathData) {
            parts.push(
              <KatexMath 
                key={`math-${key++}`}
                latex={mathData.latex}
                display={mathData.display}
              />
            );
          } else {
            parts.push(marker);
          }
        } else if (markerType === 'COMPONENT') {
          // Add custom component
          const componentData = componentMap.get(marker);
          if (componentData) {
            const componentKey = `component-${key++}`;
            switch (componentData.type){
              case "stock_chart":
                parts.push(
                  <div key={componentKey} className="my-6">
                    <StockChart 
                      ticker={componentData.params.ticker}
                      days={componentData.params.days || 30}
                    />
                  </div>
                );
                break;
              case "graph":
                parts.push(
                  <GenericChart 
                    key={componentKey}
                    config={componentData.params}
                  />
                );
                break;
              default:
                parts.push(
                  <div key={componentKey} className="my-4 p-4 border border-destructive/50 rounded-lg bg-destructive/10">
                    <p className="text-sm text-destructive">
                      Unknown component: {componentData.type}
                    </p>
                  </div>
                );
            }
          } else {
            parts.push(marker);
          }
        }

        lastIndex = match.index + marker.length;
      }

      // Add remaining text
      if (lastIndex < node.length) {
        parts.push(node.substring(lastIndex));
      }

      return parts.length === 1 ? parts[0] : <>{parts}</>;
    }

    if (Array.isArray(node)) {
      return node.map((child, i) => (
        <React.Fragment key={i}>{replaceMarkers(child)}</React.Fragment>
      ));
    }

    if (React.isValidElement(node) && node.props?.children) {
      return React.cloneElement(node, {
        ...node.props,
        children: replaceMarkers(node.props.children),
      } as any);
    }

    return node;
  };

  // Step 3: Wrapper that applies post-processing
  const ComponentWrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{replaceMarkers(children)}</>;
  };

  return (
    <Markdown
      options={{
        forceBlock: false,
        wrapper: ComponentWrapper,
        overrides: {
          br: { component: () => <br /> },
          code: {
            component: ({ className, children, ...props }) => {
              const isCodeBlock = className?.startsWith('lang-');
              
              if (isCodeBlock) {
                return (
                  <CodeBlock className={className}>
                    {String(children)}
                  </CodeBlock>
                );
              }
              
              return (
                <code {...props} className="bg-muted rounded px-1 py-0.5 text-sm font-mono">
                  {children}
                </code>
              );
            }
          },
          pre: {
            component: ({ children }) => <>{children}</>
          },
          table: {
            component: ({ children, ...props }) => (
              <div className="overflow-x-auto">
                <table {...props} className="table-auto border-collapse w-full text-sm my-4">
                  {children}
                </table>
              </div>
            )
          },
          th: { 
            component: ({ children, ...props }) => (
              <th {...props} className="border px-2 py-1 font-bold">
                {children}
              </th>
            )
          },
          td: { 
            component: ({ children, ...props }) => (
              <td {...props} className="border px-2 py-1">
                {children}
              </td>
            )
          },
          p: {
            component: ({ children, ...props }) => {
              // Process markers FIRST
              const processedChildren = replaceMarkers(children);
              
              const hasBlockChild = React.Children.toArray(processedChildren).some(
                (child) => React.isValidElement(child) && React.Children.toArray(processedChildren).some(isBlockElement)
              );
          
              if (hasBlockChild) {
                return <>{processedChildren}</>;
              }
          
              return (
                <div {...props} className="leading-relaxed whitespace-pre-wrap">
                  {processedChildren}
                </div>
              );
            },
          },
          h1: { 
            component: ({ children, ...props }) => (
              <h1 {...props} className="text-3xl font-bold mt-8 mb-4">
                {children}
              </h1>
            )
          },
          h2: { 
            component: ({ children, ...props }) => (
              <h2 {...props} className="text-2xl font-bold mt-6 mb-3">
                {children}
              </h2>
            )
          },
          h3: { 
            component: ({ children, ...props }) => (
              <h3 {...props} className="text-xl font-semibold mt-5 mb-2">
                {children}
              </h3>
            )
          },
          h4: { 
            component: ({ children, ...props }) => (
              <h4 {...props} className="text-lg font-semibold mt-4 mb-2">
                {children}
              </h4>
            )
          },
          h5: { 
            component: ({ children, ...props }) => (
              <h5 {...props} className="text-base font-semibold mt-3 mb-1">
                {children}
              </h5>
            )
          },
          h6: { 
            component: ({ children, ...props }) => (
              <h6 {...props} className="text-sm font-semibold mt-2 mb-1">
                {children}
              </h6>
            )
          },
          li: { 
            component: ({ children, ...props }) => (
              <li {...props} className="ml-4 my-1">
                {children}
              </li>
            )
          },
          ul: {
            component: ({ children, ...props }) => (
              <ul {...props} className="list-disc ml-6 my-3">
                {children}
              </ul>
            )
          },
          ol: {
            component: ({ children, ...props }) => (
              <ol {...props} className="list-decimal ml-6 my-3">
                {children}
              </ol>
            )
          },
          span: { component: ({ children, ...props }) => <span {...props}>{children}</span> },
          strong: { 
            component: ({ children, ...props }) => (
              <strong {...props} className="font-bold">
                {children}
              </strong>
            )
          },
          em: { 
            component: ({ children, ...props }) => (
              <em {...props} className="italic">
                {children}
              </em>
            )
          },
          hr: { component: () => <hr className="my-6 border-border" /> },
        }
      }}
    >
      {processedText}
    </Markdown>
  );
}