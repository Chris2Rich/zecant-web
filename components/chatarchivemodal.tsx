"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, MessageSquare, Calendar, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { formatDate } from "@/business/utils";

const API_URL = "https://api.zecant.com";

interface Chat {
  chat_id: string;
  clerk_user_id: string;
  created_at: string;
  updated_at: string;
  title: string | null;
}

interface ChatArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
}

export function ChatArchiveModal({ isOpen, onClose, onSelectChat }: ChatArchiveModalProps) {
  const { getToken } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch chats when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchChats();
      setSearchQuery("")
    }
  }, [isOpen]);

  const fetchChats = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${API_URL}/lm/chats`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }

      const data = await response.json();
      setChats(data.chats || []);
    } catch (err: any) {
      console.error("Error fetching chats:", err);
      setError(err.message || "Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    onClose();
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    // Prevent triggering the parent onClick
    e.stopPropagation();
  
    if (!confirm("Are you sure you want to delete this chat?")) {
      return;
    }
  
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }
  
      const response = await fetch(`${API_URL}/lm/deletechat?chatid=${chatId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }
  
      // Remove from local state
      setChats(prev => prev.filter(chat => chat.chat_id !== chatId));
    } catch (err: any) {
      console.error("Error deleting chat:", err);
      setError(err.message || "Failed to delete chat");
    }
  };

  // Filter chats based on search (dummy for now - just filters by title)
  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    return chat.title?.toLowerCase().includes(searchQuery.toLowerCase()) || chat.chat_id.toLowerCase().includes(searchQuery.toLowerCase())
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-background border border-border rounded-2xl shadow-2xl w-full mx-12 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Chat History</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {chats.length} {chats.length === 1 ? 'conversation' : 'conversations'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <X className="w-6 h-6 text-destructive" />
                </div>
                <p className="text-destructive font-medium">{error}</p>
                <Button
                  variant="outline"
                  onClick={fetchChats}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery ? "No chats found" : "No conversations yet"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery ? "Try a different search" : "Start a new chat to get started"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredChats.map((chat) => (
                <motion.div
                  key={chat.chat_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group"
                >
                  <button
                    onClick={() => handleSelectChat(chat.chat_id)}
                    className="w-full p-4 rounded-xl border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-colors text-left hover:cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-accent-foreground">
                          {chat.title || "Untitled Chat"}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(chat.updated_at)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          ID: {chat.chat_id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteChat(chat.chat_id, e)}
                      className="absolute bottom-2 right-2 p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all opacity-50 hover:opacity-100 z-10 hover:cursor-pointer"
                      title="Delete chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}