"use client";

import { ChatArchiveModal } from "@/components/chatarchivemodal";
import { useSidebarContext } from "@/components/SidebarContext"
import { useUser, useAuth  } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Bot, User, ArrowUp, MessageSquarePlus, Archive } from "lucide-react";
import MarkdownRender from "@/components/MarkdownRender";
import { MemoizedMessage } from "@/components/MemoizedMarkdownRender";
import { Button } from "@/components/ui/button"
import { ChatToolsButton } from "@/components/chat-tools-button";
import { AgentThinkingPanel, AgentTab, AgentType } from "@/components/AgentThinkingPanel";
import { defaultChatOptions } from "@/business/constants";
import { lmtools } from "@/business/tools";

const API_URL = "https://api.zecant.com";

interface ToolCall {
  tool: string;
  args?: Record<string, unknown>;
  result?: string;
  timestamp?: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
}

interface SSEMessage {
  type: "metadata" | "token" | "done" | "error" | "tool_call" | "tool_result" | "tool_log" | "agent_routing" | "agent_start" | "agent_progress" | "agent_complete" | "agent_error";
  content?: string;
  chatid?: string;
  message_id?: string;
  error?: string;
  query?: string;
  results?: any;
  tool?: string;
  args?: Record<string, unknown>;
  result?: string;
  calls?: ToolCall[];
  agent?: string;
  agents?: string[];
  task?: string;
  update?: string;
  summary?: string;
  confidence?: number;
  order?: number;
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { register, unregister } = useSidebarContext()
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

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

  return <>
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
  const [error, setError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState("");
  const [enabledTools, setEnabledTools] = useState<any[]>(lmtools.filter(t => t.enabled));
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [inputHeight, setInputHeight] = useState(0);
  const [pendingToolCalls, setPendingToolCalls] = useState<ToolCall[]>([]);
  const [currentThinkingTool, setCurrentThinkingTool] = useState<string | null>(null);
  const [agentTabs, setAgentTabs] = useState<AgentTab[]>([]);
  const [isAgentsExpanded, setIsAgentsExpanded] = useState(true);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  
  const streamingMessageRef = useRef("");
  const userHasScrolledRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);

  // Measure input container height and apply padding
  useEffect(() => {
    const updateInputHeight = () => {
      if (inputContainerRef.current) {
        const height = inputContainerRef.current.offsetHeight;
        setInputHeight(height);
      }
    };

    updateInputHeight();
    
    // Use ResizeObserver to track height changes
    const resizeObserver = new ResizeObserver(updateInputHeight);
    if (inputContainerRef.current) {
      resizeObserver.observe(inputContainerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setCurrentStreamingMessage("");
    streamingMessageRef.current = "";
    setIsStreaming(false);
    setError(null);
    setInput("");
    setPendingToolCalls([]);
    setCurrentThinkingTool(null);
    setAgentTabs([]);
    setIsAgentsExpanded(true);
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

  const isNearBottom = () => {
    if (!messagesContainerRef.current) return false;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const threshold = 800;
    
    return scrollHeight - scrollTop - clientHeight < threshold;
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end'
    });
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isStreaming) {
        const nearBottom = isNearBottom();
        userHasScrolledRef.current = !nearBottom;
        shouldAutoScrollRef.current = nearBottom;
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isStreaming]);

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom();
    }
  }, [messages, currentStreamingMessage, currentThinkingTool]);

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

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    shouldAutoScrollRef.current = true;
    userHasScrolledRef.current = false;
    
    const messageToSend = input.trim();
    setInput("");
    setError(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setIsStreaming(true);
    streamingMessageRef.current = "";
    setCurrentStreamingMessage("");
    setPendingToolCalls([]);
    setCurrentThinkingTool(null);
    setAgentTabs([]);
    setIsAgentsExpanded(true);

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

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            try {
              const parsed: SSEMessage = JSON.parse(data);

              if (parsed.type === "metadata") {
                if (parsed.chatid) {
                  setCurrentChatId(parsed.chatid);
                }
              } else if (parsed.type === "tool_call") {
                setCurrentThinkingTool(parsed.tool || null);
                setPendingToolCalls(prev => [...prev, {
                  tool: parsed.tool || "",
                  args: parsed.args,
                  timestamp: Date.now()
                }]);
              } else if (parsed.type === "tool_result") {
                setCurrentThinkingTool(null);
                setPendingToolCalls(prev => {
                  const updated = [...prev];
                  const lastCall = updated[updated.length - 1];
                  if (lastCall && lastCall.tool === parsed.tool) {
                    lastCall.result = parsed.result;
                  }
                  return updated;
                });
              } else if (parsed.type === "tool_log") {
                if (parsed.calls) {
                  setPendingToolCalls(parsed.calls);
                }
              } else if (parsed.type === "token") {
                streamingMessageRef.current += parsed.content || "";
                setCurrentStreamingMessage(prev => prev + (parsed.content || ""));
              } else if (parsed.type === "done") {
                const finalMessage = streamingMessageRef.current;
                const finalToolCalls = pendingToolCalls;
                if (finalMessage) {
                  setMessages((prev) => [
                    ...prev,
                    {
                      role: "assistant",
                      content: finalMessage,
                      timestamp: Date.now(),
                      toolCalls: finalToolCalls.length > 0 ? finalToolCalls : undefined,
                    },
                  ]);
                }
                streamingMessageRef.current = "";
                setCurrentStreamingMessage("");
                setIsStreaming(false);
                setPendingToolCalls([]);
                setCurrentThinkingTool(null);
                // Note: agentTabs are NOT cleared here - they persist for visibility
                shouldAutoScrollRef.current = true;
                userHasScrolledRef.current = false;
              } else if (parsed.type === "error") {
                setError(parsed.error || "An error occurred");
                streamingMessageRef.current = "";
                setCurrentStreamingMessage("");
                setIsStreaming(false);
                setPendingToolCalls([]);
                setCurrentThinkingTool(null);
              } else if (parsed.type === "agent_start") {
                const newAgent: AgentTab = {
                  id: parsed.agent || "unknown",
                  agent: (parsed.agent as AgentType) || "orchestrator",
                  status: "running",
                  task: parsed.task || "Processing...",
                  startedAt: Date.now(),
                  order: parsed.order || agentTabs.length,
                };
                setAgentTabs(prev => [...prev, newAgent]);
                setIsAgentsExpanded(true);
              } else if (parsed.type === "agent_routing") {
                // Routing info - could update orchestrator tab
                setAgentTabs(prev => prev.map(tab => 
                  tab.agent === "orchestrator" 
                    ? {...tab, status: "completed", summary: `Routed to: ${parsed.agents?.join(", ")}`}
                    : tab
                ));
              } else if (parsed.type === "agent_progress") {
                setAgentTabs(prev => prev.map(tab => 
                  tab.agent === parsed.agent 
                    ? {...tab, progress: parsed.update}
                    : tab
                ));
              } else if (parsed.type === "agent_complete") {
                setAgentTabs(prev => prev.map(tab => 
                  tab.agent === parsed.agent 
                    ? {
                        ...tab, 
                        status: "completed", 
                        summary: parsed.summary,
                        completedAt: Date.now()
                      }
                    : tab
                ));
              } else if (parsed.type === "agent_error") {
                setAgentTabs(prev => prev.map(tab => 
                  tab.agent === parsed.agent 
                    ? {...tab, status: "error", summary: parsed.error}
                    : tab
                ));
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
      setPendingToolCalls([]);
      setCurrentThinkingTool(null);
      // Note: agentTabs are NOT cleared on error - they persist for debugging
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
    
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  };

  const handleToolsChange = (tools: any[]) => {
    const enabled = tools.filter(t => t.enabled);
    setEnabledTools(enabled);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div 
        ref={messagesContainerRef}
        className="absolute inset-0 overflow-y-auto scrollbar-thin px-4 pt-8"
        style={{ 
          paddingBottom: `${inputHeight}px`
        }}
      >
        {/* Welcome Message */}
        {messages.length === 0 && !currentStreamingMessage && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-sm bg-primary/10 flex items-center justify-center mx-auto mb-4">
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

            {/* Tool Execution Indicator */}
            {currentThinkingTool && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">ZECA</span>
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Using tool: <span className="font-mono text-primary">{currentThinkingTool}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Agent Thinking Panel */}
            <AgentThinkingPanel 
              agents={agentTabs} 
              isExpanded={isAgentsExpanded}
              onToggle={() => setIsAgentsExpanded(!isAgentsExpanded)}
            />

            {/* Streaming Message */}
            {currentStreamingMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
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
        <div ref={messagesEndRef}/>
        
      {messages.length > 0 && (
        <div className="h-24 relative"/>
      )}

      </div>

      {/* Fixed Input Area - Positioned at bottom of viewport */}
      <div 
        ref={inputContainerRef}
        className="absolute bottom-0 left-0 right-0 pt-4"
      >
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mb-4 p-4 rounded-sm bg-destructive/10 border border-destructive/20 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Error</p>
              <p className="text-sm text-destructive/70 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Input Box */}
        <div className="max-w-5xl mx-auto px-6 pb-4">
          <div className="flex items-center rounded-sm bg-card/70 backdrop-blur-glass px-3 py-3 border-border border-1">
            <ChatToolsButton onToolsChange={handleToolsChange} />
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              disabled={isStreaming}
              className="no-scrollbar w-full resize-none rounded-sm bg-muted border border-border px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed mx-4"
              rows={1}
              style={{ minHeight: "3em", maxHeight: "9.375em" }}
            />
            <Button
              size="default"
              variant="outline"
              className="group bg-background hover:bg-muted text-foreground font-semibold px-4 py-2 hover:transition-all duration-300 cursor-pointer relative"
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
          {messages.length === 0 &&
            <p className="text-xs text-muted-foreground mt-2 text-center select-none">
              Press Enter to send, Shift + Enter for new line
            </p>
          }
        </div>
      </div>
    </div>
  );
}
