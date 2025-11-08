"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, AlertCircle, Bot, User } from "lucide-react";

const SENTINEL = "_____";
const WS_URL = "wss://zecant.com/rawllm"; // Adjust to your domain

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

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage]);

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
              setIsStreaming(true);
              setCurrentStreamingMessage("");
            } else if (command === "end") {
              // Save the complete message
              if (currentStreamingMessage) {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: currentStreamingMessage,
                    timestamp: Date.now(),
                  },
                ]);
              }
              setCurrentStreamingMessage("");
              setIsStreaming(false);
            } else if (command.startsWith("err")) {
              const errorData: ErrorMessage = JSON.parse(command.substring(3));
              setError(errorData.data);
              setIsStreaming(false);
              setCurrentStreamingMessage("");
            }
          } else {
            // Streaming token
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
    <div className="h-full flex flex-col bg-background">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Connection Status */}
          {!isConnected && (
            <div className="mb-6 p-4 rounded-xl bg-muted/50 border border-border flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Connecting to server...</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Error</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </motion.div>
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
                        {message.role === "user" ? "You" : "Assistant"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none text-foreground">
                      <p className="whitespace-pre-wrap">{message.content}</p>
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
                    <div className="prose prose-sm max-w-none text-foreground">
                      <p className="whitespace-pre-wrap">
                        {currentStreamingMessage}
                        <span className="inline-block w-1 h-4 bg-primary ml-0.5 animate-pulse" />
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isConnected
                  ? "Type a message... (Shift + Enter for new line)"
                  : "Connecting..."
              }
              disabled={!isConnected || isStreaming}
              className="w-full resize-none rounded-2xl bg-muted border border-border px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: "48px", maxHeight: "200px" }}
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
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}