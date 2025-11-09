"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, AlertCircle, Bot, User } from "lucide-react";
import Markdown from "markdown-to-jsx";
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from "react-katex";
import React, { ReactNode } from "react";

const SENTINEL = "_____";
const WS_URL = "wss://api.zecant.com/rawllm";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ErrorMessage {
  type: "error";
  code: string;
  data: string;
}

type MarkdownRenderProps = {
  message: string;
};

function MarkdownRender({message} : MarkdownRenderProps) {
  // Pre-process message to handle LaTeX
  const processedMessage = React.useMemo(() => {
    let processed = message;
    
    // Use unique placeholders that won't conflict
    const displayMathBlocks: string[] = [];
    const inlineMathBlocks: string[] = [];
    
    // Handle display math FIRST (most specific to least specific)
    // \[...\] notation
    processed = processed.replace(/\\\[([\s\S]+?)\\\]/g, (match, latex) => {
      displayMathBlocks.push(latex.trim());
      return `DISPLAYMATHPLACEHOLDER${displayMathBlocks.length - 1}ENDPLACEHOLDER`;
    });
    
    // $$...$$ notation
    processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (match, latex) => {
      displayMathBlocks.push(latex.trim());
      return `DISPLAYMATHPLACEHOLDER${displayMathBlocks.length - 1}ENDPLACEHOLDER`;
    });
    
    // Handle inline math SECOND
    // \(...\) notation
    processed = processed.replace(/\\\(([\s\S]+?)\\\)/g, (match, latex) => {
      inlineMathBlocks.push(latex.trim());
      return `INLINEMATHPLACEHOLDER${inlineMathBlocks.length - 1}ENDPLACEHOLDER`;
    });
    
    // $...$ notation (must come after $$...$$)
    processed = processed.replace(/\$([^\$\n]+?)\$/g, (match, latex) => {
      inlineMathBlocks.push(latex.trim());
      return `INLINEMATHPLACEHOLDER${inlineMathBlocks.length - 1}ENDPLACEHOLDER`;
    });
    
    return { processed, displayMathBlocks, inlineMathBlocks };
  }, [message]);

  const renderWithMath = (content: ReactNode): ReactNode => {
    if (typeof content === 'string') {
      // Split by display math placeholders
      let parts: (string | JSX.Element)[] = [content];
      
      // Replace display math
      processedMessage.displayMathBlocks.forEach((latex, index) => {
        const placeholder = `DISPLAYMATHPLACEHOLDER${index}ENDPLACEHOLDER`;
        parts = parts.flatMap((part) => {
          if (typeof part === 'string' && part.includes(placeholder)) {
            return part.split(placeholder).flatMap((segment, i, arr) => {
              if (i === arr.length - 1) return [segment];
              return [
                segment,
                <BlockMath key={`display-${index}-${i}`}>{latex}</BlockMath>
              ];
            }).filter(s => s !== '');
          }
          return [part];
        });
      });
      
      // Replace inline math
      processedMessage.inlineMathBlocks.forEach((latex, index) => {
        const placeholder = `INLINEMATHPLACEHOLDER${index}ENDPLACEHOLDER`;
        parts = parts.flatMap((part) => {
          if (typeof part === 'string' && part.includes(placeholder)) {
            return part.split(placeholder).flatMap((segment, i, arr) => {
              if (i === arr.length - 1) return [segment];
              return [
                segment,
                <InlineMath key={`inline-${index}-${i}`}>{latex}</InlineMath>
              ];
            }).filter(s => s !== '');
          }
          return [part];
        });
      });
      
      return parts.length === 1 ? parts[0] : parts;
    }
    
    if (Array.isArray(content)) {
      return content.map((child, i) => (
        <React.Fragment key={i}>{renderWithMath(child)}</React.Fragment>
      ));
    }
    
    // Handle React elements - need to recurse into children
    if (React.isValidElement(content)) {
      if (content.props.children) {
        return React.cloneElement(content, {
          ...content.props,
          children: renderWithMath(content.props.children)
        });
      }
    }
    
    return content;
  };

  return <Markdown
    options={{
      forceBlock: false,
      wrapper: React.Fragment,
      overrides: {
        br: {
          component: () => <br />
        },
        code: {
          component: ({ children }) => (
            <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
              <code>{children}</code>
            </pre>
          )
        },
        table: {
          component: ({ children, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} className="table-auto border-collapse w-full text-sm">
                {children}
              </table>
            </div>
          )
        },
        th: { 
          component: ({ children }) => (
            <th className="border px-2 py-1 font-bold">
              {renderWithMath(children)}
            </th>
          )
        },
        td: { 
          component: ({ children }) => (
            <td className="border px-2 py-1">
              {renderWithMath(children)}
            </td>
          )
        },
        p: { 
          component: ({ children }) => (
            <p className="leading-relaxed whitespace-pre-wrap">
              {renderWithMath(children)}
            </p>
          )
        },
        h1: {
          component: ({ children }) => (
            <h1>{renderWithMath(children)}</h1>
          )
        },
        h2: {
          component: ({ children }) => (
            <h2>{renderWithMath(children)}</h2>
          )
        },
        h3: {
          component: ({ children }) => (
            <h3>{renderWithMath(children)}</h3>
          )
        },
        h4: {
          component: ({ children }) => (
            <h4>{renderWithMath(children)}</h4>
          )
        },
        h5: {
          component: ({ children }) => (
            <h5>{renderWithMath(children)}</h5>
          )
        },
        h6: {
          component: ({ children }) => (
            <h6>{renderWithMath(children)}</h6>
          )
        },
        li: {
          component: ({ children }) => (
            <li>{renderWithMath(children)}</li>
          )
        },
        span: {
          component: ({ children }) => (
            <span>{renderWithMath(children)}</span>
          )
        },
        strong: {
          component: ({ children }) => <strong>{renderWithMath(children)}</strong>
        },
        em: {
          component: ({ children }) => <em>{renderWithMath(children)}</em>
        },
        hr: {
          component: () => <hr className="my-6 border-border" />
        },
      }
    }}
  >
    {processedMessage.processed}
  </Markdown>
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Use ref to track streaming message to avoid stale closure
  const streamingMessageRef = useRef("");

  // Connect to WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(WS_URL);
        
        ws.onopen = () => {
          console.log("WebSocket connected");
          setIsConnected(true);
          setError(null);
        };

        ws.onmessage = (event) => {
          const data = event.data;

          // Handle sentinel messages
          if (data.startsWith(SENTINEL)) {
            const command = data.substring(SENTINEL.length);

            if (command === "start") {
              console.log("Stream started");
              setIsStreaming(true);
              streamingMessageRef.current = "";
              setCurrentStreamingMessage("");
            } else if (command === "end") {
              console.log("Stream ended, message:", streamingMessageRef.current);
              // Save the complete message using ref (not state)
              const finalMessage = streamingMessageRef.current;
              if (finalMessage) {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: finalMessage,
                    timestamp: Date.now(),
                  },
                ]);
                console.log(messages)
              }
              streamingMessageRef.current = "";
              setCurrentStreamingMessage("");
              setIsStreaming(false);
            } else if (command.startsWith("err")) {
              console.error("Error received:", command);
              try {
                const errorData: ErrorMessage = JSON.parse(command.substring(3));
                setError(errorData.data);
              } catch (e) {
                setError("An error occurred");
              }
              setIsStreaming(false);
              streamingMessageRef.current = "";
              setCurrentStreamingMessage("");
            }
          } else {
            // Streaming token - update both ref and state
            streamingMessageRef.current += data;
            setCurrentStreamingMessage((prev) => prev + data);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setError("Connection error. Please try again.");
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
          setIsConnected(false);
          setIsStreaming(false);
          // Attempt to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        wsRef.current = ws;
      } catch (err) {
        console.error("Failed to connect:", err);
        setError("Failed to connect to server");
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    if (isStreaming) {
      setError("Please wait for the current response to complete");
      return;
    }

    // Add user message to UI
    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Send to WebSocket
    wsRef.current.send(input.trim());
    
    // Clear input
    setInput("");
    setError(null);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full mx-auto px-6 py-8">
          {/* Connection Status */}
          {!isConnected && (
            <div className="mb-6 p-4 rounded-xl bg-muted/50 border border-border flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Connecting to server...</span>
            </div>
          )}

          {/* Welcome Message */}
          {messages.length === 0 && !currentStreamingMessage && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Start a conversation
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Ask me anything. I'm here to help with your questions.
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-4"
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-secondary"
                        : "bg-primary/10"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-5 h-5 text-secondary-foreground" />
                    ) : (
                      <Bot className="w-5 h-5 text-primary" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {message.role === "user" ? "You" : "ZECA"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none text-foreground">
                      <MarkdownRender message={message.content}/>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Streaming Message */}
              {currentStreamingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        Assistant
                      </span>
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    </div>
                    <div className="prose prose-sm max-w-none text-foreground animate-pulse">
                        <MarkdownRender message={currentStreamingMessage}/>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div ref={messagesEndRef} />

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Error</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Input Area */}
      <div>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isConnected
                  ? "Type a message..."
                  : "Connecting..."
              }
              disabled={!isConnected || isStreaming}
              className="no-scrollbar w-full resize-none rounded-2xl bg-muted border border-border px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: "3em", maxHeight: "9.375em" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !isConnected || isStreaming}
              className="absolute right-2 bottom-2 w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center select-none">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}