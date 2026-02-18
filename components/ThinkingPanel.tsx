"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Brain, Wrench, Search, BarChart3, Wallet } from "lucide-react";

interface ToolCall {
  tool: string;
  args?: Record<string, unknown>;
  result?: string;
  timestamp?: number;
}

interface ThinkingPanelProps {
  thoughts?: string[];
  toolCalls?: ToolCall[];
}

const toolIcons: Record<string, React.ElementType> = {
  web_search: Search,
  get_market_data: BarChart3,
  get_portfolio: Wallet,
};

const toolNames: Record<string, string> = {
  web_search: "Web Search",
  get_market_data: "Market Data",
  get_portfolio: "Portfolio",
};

export function ThinkingPanel({ thoughts, toolCalls }: ThinkingPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  if ((!thoughts || thoughts.length === 0) && (!toolCalls || toolCalls.length === 0)) {
    return null;
  }

  const hasThoughts = thoughts && thoughts.length > 0;
  const hasToolCalls = toolCalls && toolCalls.length > 0;

  return (
    <div className="mt-3 ml-14">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronDown
          className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
        {hasThoughts && (
          <span className="flex items-center gap-1">
            <Brain className="w-3.5 h-3.5" />
            {thoughts!.length} thought{thoughts!.length !== 1 ? "s" : ""}
          </span>
        )}
        {hasThoughts && hasToolCalls && <span className="text-border">|</span>}
        {hasToolCalls && (
          <span className="flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5" />
            {toolCalls!.length} tool{toolCalls!.length !== 1 ? "s" : ""}
          </span>
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2">
              {hasThoughts && (
                <div className="p-3 rounded-md bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Thinking</span>
                  </div>
                  <div className="space-y-2">
                    {thoughts!.map((thought, i) => (
                      <div
                        key={i}
                        className="text-sm text-muted-foreground pl-6 border-l-2 border-primary/20"
                      >
                        {thought}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasToolCalls && (
                <div className="space-y-2">
                  {toolCalls!.map((toolCall, i) => {
                    const Icon = toolIcons[toolCall.tool] || Wrench;
                    const displayName = toolNames[toolCall.tool] || toolCall.tool;
                    const isExpanded = expandedTool === `${i}`;

                    return (
                      <div
                        key={i}
                        className="p-3 rounded-md bg-muted/30 border border-border/50"
                      >
                        <button
                          onClick={() => setExpandedTool(isExpanded ? null : `${i}`)}
                          className="flex items-center gap-2 w-full text-left"
                        >
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground flex-1">
                            {displayName}
                          </span>
                          {toolCall.args && (
                            <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                              {toolCall.tool === "web_search"
                                ? toolCall.args.query
                                : toolCall.tool === "get_market_data"
                                ? (toolCall.args.tickers as string[])?.join(", ")
                                : ""}
                            </span>
                          )}
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 pt-2 border-t border-border/50">
                                {toolCall.args && (
                                  <div className="mb-2">
                                    <span className="text-xs text-muted-foreground">Arguments:</span>
                                    <pre className="text-xs text-foreground mt-1 p-2 rounded bg-muted/50 overflow-x-auto">
                                      {JSON.stringify(toolCall.args, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {toolCall.result && (
                                  <div>
                                    <span className="text-xs text-muted-foreground">Result:</span>
                                    <pre className="text-xs text-foreground mt-1 p-2 rounded bg-muted/50 overflow-x-auto max-h-40">
                                      {toolCall.result}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
