import React, { useMemo } from 'react';
import Markdown from 'markdown-to-jsx';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { StockChart } from "@/components/StockChart";

type MarkdownRenderProps = {
  message: string;
};

// Direct KaTeX renderer component
// Pre-render KaTeX to HTML string during useMemo
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
  // Extract language from className (e.g., "lang-javascript" -> "javascript")
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

export default function MarkdownRender({ message }: MarkdownRenderProps) {
  // Step 1: Extract code blocks and inline code, then LaTeX, replacing with unique markers
  const { processedText, mathMap } = useMemo(() => {
    let text = message.normalize("NFKD");
    const map = new Map<string, { latex: string; display: boolean }>();
    const codeMap = new Map<string, string>();
    let counter = 0;
    let codeCounter = 0;
    
    // First, protect code blocks (``` ... ```)
    text = text.replace(/```[\s\S]*?```/g, (match) => {
      const marker = `§§CODE${codeCounter}§§`;
      codeMap.set(marker, match);
      codeCounter++;
      return marker;
    });
    
    // Protect inline code (` ... `)
    text = text.replace(/`[^`]+?`/g, (match) => {
      const marker = `§§CODE${codeCounter}§§`;
      codeMap.set(marker, match);
      codeCounter++;
      return marker;
    });
    
    // Now process LaTeX (code blocks are protected)
    
    // Display math: $$...$$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, latex) => {
      const marker = `§§MATH${counter}§§`;
      map.set(marker, { latex: latex.trim(), display: true });
      counter++;
      return marker;
    });
    
    // Display math: \[...\]
    text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, latex) => {
      const marker = `§§MATH${counter}§§`;
      map.set(marker, { latex: latex.trim(), display: true });
      counter++;
      return marker;
    });
    
    // Inline math: \(...\)
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, latex) => {
      const marker = `§§MATH${counter}§§`;
      map.set(marker, { latex: latex.trim(), display: false });
      counter++;
      return marker;
    });
    
    // Inline math: $...$ with stricter rules to avoid false positives
    // Must contain at least one backslash OR letter, and no spaces at boundaries
    // Single-letter variables
    text = text.replace(/\$([a-zA-Z])\$/g, (match, letter) => {
      const marker = `§§MATH${counter}§§`;
      map.set(marker, { latex: letter, display: false });
      counter++;
      return marker;
    });

    // Multi-character inline math
    text = text.replace(/\$([^\s$][^$\n]*?[^\s$])\$/g, (match, latex) => {
      // Skip if it looks like a price (starts with digits)
      if (/^[\d,.]/.test(latex)) {
        return match;
      }
      
      // Must contain letters or backslash for LaTeX
      if (/[\\a-zA-Z]/.test(latex)) {
        const marker = `§§MATH${counter}§§`;
        map.set(marker, { latex: latex.trim(), display: false });
        counter++;
        return marker;
      }
      
      return match;
    });
    
    // Restore code blocks and inline code
    text = text.replace(/§§CODE\d+§§/g, (marker) => {
      return codeMap.get(marker) || marker;
    });
    
    return { processedText: text, mathMap: map };
  }, [message]);

  // Step 2: Post-process function that recursively replaces markers with React components
  const replaceMathMarkers = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string') {
      // Check if string contains any math markers
      if (!node.includes('§§MATH')) {
        return node;
      }

      const parts: (string | JSX.Element)[] = [];
      const markerRegex = /§§MATH(\d+)§§/g;
      let lastIndex = 0;
      let match;
      let key = 0;

      while ((match = markerRegex.exec(node)) !== null) {
        // Add text before marker
        if (match.index > lastIndex) {
          parts.push(node.substring(lastIndex, match.index));
        }

        // Add math component
        const marker = match[0];
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
          parts.push(marker); // Fallback
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
        <React.Fragment key={i}>{replaceMathMarkers(child)}</React.Fragment>
      ));
    }

    if (React.isValidElement(node) && node.props?.children) {
      return React.cloneElement(node, {
        ...node.props,
        children: replaceMathMarkers(node.props.children),
      } as any);
    }

    return node;
  };

  // Step 3: Create wrapper that applies post-processing
  const MathWrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{replaceMathMarkers(children)}</>;
  };

  return (
    <Markdown
      options={{
        forceBlock: false,
        wrapper: MathWrapper,
        overrides: {
          br: { component: () => <br /> },
          code: {
            component: ({ className, children, ...props }) => {
              // Check if it's a code block (has language class) or inline code
              const isCodeBlock = className?.startsWith('lang-');
              
              if (isCodeBlock) {
                return (
                  <CodeBlock className={className}>
                    {String(children)}
                  </CodeBlock>
                );
              }
              
              // Inline code
              return (
                <code {...props} className="bg-muted rounded px-1 py-0.5 text-sm font-mono">
                  {children}
                </code>
              );
            }
          },
          pre: {
            component: ({ children }) => {
              // Let CodeBlock handle the styling
              return <>{children}</>;
            }
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
            component: ({ children, ...props }) => (
              <p {...props} className="leading-relaxed whitespace-pre-wrap">
                {children}
              </p>
            )
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