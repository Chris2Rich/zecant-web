"use client"
import { memo } from "react";
import MarkdownRender from "@/components/MarkdownRender";
import { Bot, User } from "lucide-react";
import { formatMessagesTimestamp } from "@/lib/utils";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// Memoized message component - only re-renders if content changes
export const MemoizedMessage = memo(function MemoizedMessage({ 
  role, 
  content, 
  timestamp 
}: MessageProps) {
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-thin">
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          role === "user"
            ? "bg-secondary"
            : "bg-primary/10"
        }`}
      >
        {role === "user" ? (
          <User className="w-5 h-5 text-secondary-foreground" />
        ) : (
          <Bot className="w-5 h-5 text-primary" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {role === "user" ? "You" : "ZECA"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatMessagesTimestamp(timestamp)}
          </span>
        </div>
        <div className="prose prose-sm max-w-none text-foreground">
          <MarkdownRender message={content}/>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function: only re-render if content actually changes
  return prevProps.content === nextProps.content && 
         prevProps.role === nextProps.role &&
         prevProps.timestamp === nextProps.timestamp;
});