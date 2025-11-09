"use client";

import { useSidebarContext } from "@/components/SidebarContext"
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Bot, User, ArrowUp, MessageSquarePlus, Archive, MessageCircle, Search } from "lucide-react";
import MarkdownRender from "@/components/MarkdownRender";
import { Button } from "@/components/ui/button"
import { ChatToolsButton } from "@/components/chat-tools-button";
import { defaultChatOptions } from "@/business/constants";

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

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { register, unregister } = useSidebarContext()

  useEffect(() => {
    const regId = register([
      { icon: MessageSquarePlus, label: "New Chat", fn: () => {console.log("New Chat Created?")} },
      { icon: Search, label: "Search Chats", fn: () => {console.log("Seach Powers?")} },
      { icon: Archive, label: "Archived Chats", fn: () => {console.log("Archived Modal")} }
    ])

    return () => unregister(regId)
  }, [register, unregister])

  return <ChatPage></ChatPage>
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState("");
  const [enabledTools, setEnabledTools] = useState<any[]>([]);

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

  const handleToolsChange = (tools: any[]) => {
    const enabled = tools.filter(t => t.enabled);
    setEnabledTools(enabled);
    console.log("Enabled tools:", enabled);
    // TODO: Send enabled tools to your backend/WebSocket
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
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
                Ask anything. <b>ZECA</b> is here to help with your questions.
              </p>

              {!input && <div className="max-w-xl w-fit flex flex-col items-center gap-4 mt-16 mx-auto">
                {defaultChatOptions.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="hover:cursor-pointer w-full px-4 py-3 border-b border-border/50 hover:border-border/100 hover:text-foreground text-muted-foreground transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>}
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
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 relative top-1/2 left-1/2 -translate-1/2"
        >
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">Error</p>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div>
        <div className="max-w-5xl mx-auto px-6 pt-4">
          <div className="flex items-center">
          <ChatToolsButton onToolsChange={handleToolsChange} />
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isConnected
                  ? "Ask anything..."
                  : "Connecting..."
              }
              disabled={!isConnected || isStreaming}
              className="no-scrollbar w-full resize-none rounded-2xl bg-muted border border-border px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed mx-4"
              rows={1}
              style={{ minHeight: "3em", maxHeight: "9.375em" }}
            />
            <Button
              size="default"
              variant="outline"
              className="group bg-background hover:bg-muted text-foreground font-semibold px-4 py-2 hover:transition-all duration-300 hover:scale-105 cursor-pointer relative"
              onClick={sendMessage}
              disabled={!input.trim() || !isConnected || isStreaming}
            >
            {isStreaming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUp className="w-5 h-5" />
                )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center select-none">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}