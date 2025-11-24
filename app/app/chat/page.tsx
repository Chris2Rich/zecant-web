"use client";

import { ChatArchiveModal } from "@/components/chatarchivemodal";
import { useSidebarContext } from "@/components/SidebarContext"
import { useUser, useAuth  } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Bot, User, ArrowUp, MessageSquarePlus, Archive, Search } from "lucide-react";
import MarkdownRender from "@/components/MarkdownRender";
import { MemoizedMessage } from "@/components/MemoizedMarkdownRender";
import { Button } from "@/components/ui/button"
import { ChatToolsButton } from "@/components/chat-tools-button";
import { defaultChatOptions } from "@/business/constants";
import { lmtools } from "@/business/tools";

const API_URL = "https://api.zecant.com";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface SSEMessage {
  type: "metadata" | "token" | "done" | "error" | "tool_call" | "search_performed";
  content?: string;
  chatid?: string;
  message_id?: string;
  error?: string;
  query?: string;
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { register, unregister } = useSidebarContext()
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  // Create a ref to store the new chat handler
  const newChatHandlerRef = useRef<(() => void) | null>(null);
  const loadChatHandlerRef = useRef<((chatId: string) => void) | null>(null);

  const handleNewChat = () => {
    if (newChatHandlerRef.current) {
      newChatHandlerRef.current();
    }
  };

  const handleLoadChat = (chatId: string) => {
    if (loadChatHandlerRef.current) {
      loadChatHandlerRef.current(chatId);
    }
  };

  useEffect(() => {
    const regId = register([
      { icon: MessageSquarePlus, label: "New Chat", fn: handleNewChat },
      { icon: Archive, label: "Archived Chats", fn: () => setIsArchiveOpen(true) }
    ])

    return () => unregister(regId)
  }, [register, unregister])

  return     <>
  <ChatPage 
    newChatHandlerRef={newChatHandlerRef}
    loadChatHandlerRef={loadChatHandlerRef}
  />
  <ChatArchiveModal 
    isOpen={isArchiveOpen}
    onClose={() => setIsArchiveOpen(false)}
    onSelectChat={handleLoadChat}
  />
</>
}

export function ChatPage({ 
  newChatHandlerRef,
  loadChatHandlerRef 
}: { 
  newChatHandlerRef: React.MutableRefObject<(() => void) | null>,
  loadChatHandlerRef: React.MutableRefObject<((chatId: string) => void) | null>
}) {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState("");
  const [enabledTools, setEnabledTools] = useState<any[]>(lmtools.filter(t => t.enabled));
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Track streaming message
  const streamingMessageRef = useRef("");
  
  // Track if user has manually scrolled up
  const userHasScrolledRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setCurrentStreamingMessage("");
    streamingMessageRef.current = "";
    setIsStreaming(false);
    setIsSearching(false);
    setSearchQuery(null);
    setError(null);
    setInput("");
    textareaRef.current?.focus();
  };

  const handleLoadChat = async (chatId: string) => {
    const token = await getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/lm/gethistory?chatid=${chatId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load chat");

      const data = await response.json();
      
      // Convert database messages to UI format
      const loadedMessages: Message[] = data.messages
        .filter((msg: any) => msg.role === "user" || msg.role === "assistant")
        .map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp).getTime(),
        }));

      setMessages(loadedMessages);
      setCurrentChatId(chatId);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load chat");
    }
  };

  useEffect(() => {
    newChatHandlerRef.current = handleNewChat;
    loadChatHandlerRef.current = handleLoadChat;
  }, []);

  // Function to check if user is near bottom
  const isNearBottom = () => {
    if (!messagesContainerRef.current) return false;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const threshold = 800; // pixels from bottom
    
    return scrollHeight - scrollTop - clientHeight < threshold;
  };

  // Function to scroll to bottom
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end'
    });
  };

  // Handle scroll events to detect manual scrolling
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // If streaming, check if user scrolled away from bottom
      if (isStreaming) {
        const nearBottom = isNearBottom();
        userHasScrolledRef.current = !nearBottom;
        shouldAutoScrollRef.current = nearBottom;
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isStreaming]);

  // Auto-scroll when messages change or streaming updates
  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom();
    }
  }, [messages, currentStreamingMessage, isSearching]);

  const getAuthToken = async (): Promise<string | null> => {
    try {
      const token = await getToken();
      return token;
    } catch (err) {
      console.error("Failed to get auth token:", err);
      return null;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming || !isLoaded || !user) {
      return;
    }

    const token = await getAuthToken();
    if (!token) {
      setError("Authentication failed. Please try logging in again.");
      return;
    }

    // Add user message to UI
    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Enable auto-scroll for new user message
    shouldAutoScrollRef.current = true;
    userHasScrolledRef.current = false;
    
    // Clear input
    const messageToSend = input.trim();
    setInput("");
    setError(null);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Start streaming
    setIsStreaming(true);
    setIsSearching(false);
    setSearchQuery(null);
    streamingMessageRef.current = "";
    setCurrentStreamingMessage("");

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${API_URL}/lm/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: messageToSend,
          tools: enabledTools.map(t => t.id),
          chatid: currentChatId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Process SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' prefix
            
            try {
              const parsed: SSEMessage = JSON.parse(data);

              if (parsed.type === "metadata") {
                // Store chat ID from metadata
                if (parsed.chatid) {
                  setCurrentChatId(parsed.chatid);
                }
              } else if (parsed.type === "search_performed") {
                // Show search indicator
                setIsSearching(true);
                setSearchQuery(parsed.query || null);
              } else if (parsed.type === "token") {
                // Accumulate tokens
                streamingMessageRef.current += parsed.content || "";
                setCurrentStreamingMessage(prev => prev + (parsed.content || ""));
              } else if (parsed.type === "done") {
                // Streaming complete - add assistant message
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
                }
                streamingMessageRef.current = "";
                setCurrentStreamingMessage("");
                setIsStreaming(false);
                setIsSearching(false);
                setSearchQuery(null);
                shouldAutoScrollRef.current = true;
                userHasScrolledRef.current = false;
              } else if (parsed.type === "error") {
                setError(parsed.error || "An error occurred");
                streamingMessageRef.current = "";
                setCurrentStreamingMessage("");
                setIsStreaming(false);
                setIsSearching(false);
                setSearchQuery(null);
              } else if (parsed.type === "tool_call") {
                // Future: Handle tool calls in UI
                console.log("Tool call:", parsed);
              }
            } catch (parseErr) {
              console.error("Failed to parse SSE message:", parseErr, data);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log("Request aborted");
      } else {
        console.error("Stream error:", err);
        setError(err.message || "Failed to send message");
      }
      streamingMessageRef.current = "";
      setCurrentStreamingMessage("");
      setIsStreaming(false);
      setIsSearching(false);
      setSearchQuery(null);
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
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        <div className="w-full mx-auto px-6 py-8">
          {/* Welcome Message */}
          {messages.length === 0 && !currentStreamingMessage && !isSearching && (
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
          <div className="space-y-6 overflow-x-hidden">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.timestamp}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MemoizedMessage
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                  />
                </motion.div>
              ))}

              {/* Search Indicator - only show when searching AND no streaming message yet */}
              {isSearching && !currentStreamingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-primary animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        Searching the web
                      </span>
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    </div>
                    {searchQuery && (
                      <p className="text-sm text-muted-foreground">
                        Query: <span className="italic">{searchQuery}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

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
                        ZECA
                      </span>
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    </div>
                    <div className="prose prose-sm max-w-none text-foreground">
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
          className="mx-6 mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3"
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
              placeholder="Ask anything..."
              disabled={isStreaming}
              className="no-scrollbar w-full resize-none rounded-2xl bg-muted border border-border px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed mx-4"
              rows={1}
              style={{ minHeight: "3em", maxHeight: "9.375em" }}
            />
            <Button
              size="default"
              variant="outline"
              className="group bg-background hover:bg-muted text-foreground font-semibold px-4 py-2 hover:transition-all duration-300 hover:scale-105 cursor-pointer relative"
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
            >
              {isStreaming ? (
                <Loader2 className="w-5 h-5 animate-spin" />
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