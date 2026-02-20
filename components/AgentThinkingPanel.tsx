"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Brain, 
  Network, 
  BookOpen, 
  TrendingUp, 
  Zap, 
  Activity,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export type AgentType = 'orchestrator' | 'research' | 'analysis' | 'trading' | 'market';

export interface AgentTab {
  id: string;
  agent: AgentType;
  status: 'running' | 'completed' | 'error';
  task: string;
  progress?: string;
  summary?: string;
  startedAt: number;
  completedAt?: number;
  order: number;
}

interface AgentThinkingPanelProps {
  agents: AgentTab[];
  isExpanded?: boolean;
  onToggle?: () => void;
}

const agentConfig: Record<AgentType, { 
  icon: React.ElementType; 
  label: string; 
  color: string;
  bgColor: string;
}> = {
  orchestrator: { 
    icon: Network, 
    label: "Orchestrator", 
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  research: { 
    icon: BookOpen, 
    label: "Research", 
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  analysis: { 
    icon: TrendingUp, 
    label: "Analysis", 
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  trading: { 
    icon: Zap, 
    label: "Trading", 
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  },
  market: { 
    icon: Activity, 
    label: "Market", 
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10"
  },
};

function AgentIcon({ agent, status, className }: { agent: AgentType; status: 'running' | 'completed' | 'error'; className?: string }) {
  const config = agentConfig[agent];
  const Icon = config.icon;
  
  if (status === 'running') {
    return <Loader2 className={`${config.color} ${className} animate-spin`} />;
  }
  if (status === 'error') {
    return <AlertCircle className="text-red-500" />;
  }
  return <Icon className={`${config.color} ${className}`} />;
}

function StatusBadge({ status }: { status: 'running' | 'completed' | 'error' }) {
  if (status === 'running') {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2 className="w-3 h-3 animate-spin" />
        Running
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="flex items-center gap-1 text-xs text-red-500">
        <AlertCircle className="w-3 h-3" />
        Error
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-green-500">
      <CheckCircle2 className="w-3 h-3" />
      Done
    </span>
  );
}

export function AgentThinkingPanel({ agents, isExpanded: externalExpanded, onToggle }: AgentThinkingPanelProps) {
  const [internalExpanded, setInternalExpanded] = useState(true);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  
  const isExpanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;
  const setExpanded = externalExpanded !== undefined 
    ? (v: boolean) => onToggle?.()
    : setInternalExpanded;

  // Auto-collapse agents after 3 seconds when completed
  useEffect(() => {
    agents.forEach(agent => {
      if (agent.status === 'completed' && !agent.completedAt) {
        const timeout = setTimeout(() => {
          setExpandedAgent(prev => prev === agent.id ? null : prev);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    });
  }, [agents]);

  if (!agents || agents.length === 0) {
    return null;
  }

  // Sort: orchestrator first (order=0), then chronological
  const sortedAgents = [...agents].sort((a, b) => {
    if (a.order === 0) return -1;
    if (b.order === 0) return 1;
    return a.startedAt - b.startedAt;
  });

  const runningCount = agents.filter(a => a.status === 'running').length;
  const completedCount = agents.filter(a => a.status === 'completed').length;

  return (
    <div className="mt-3 ml-14">
      {/* Header Button - matches ThinkingPanel exactly */}
      <button
        onClick={() => setExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground border border-border/30"
      >
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
        <Brain className="w-3.5 h-3.5" />
        <span className="flex items-center gap-1">
          Agents
        </span>
        <span className="text-border">|</span>
        {runningCount > 0 && (
          <span className="flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            {runningCount} active
          </span>
        )}
        {runningCount > 0 && completedCount > 0 && <span className="text-border">|</span>}
        {completedCount > 0 && (
          <span className="flex items-center gap-1 text-green-500">
            <CheckCircle2 className="w-3 h-3" />
            {completedCount} done
          </span>
        )}
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2">
              {sortedAgents.map((agent) => {
                const config = agentConfig[agent.agent];
                const Icon = config.icon;
                const isAgentExpanded = expandedAgent === agent.id;
                
                return (
                  <div
                    key={agent.id}
                    className={`p-3 rounded-md border transition-all ${
                      agent.status === 'running' 
                        ? 'bg-muted/50 border-primary/30' 
                        : agent.status === 'error'
                        ? 'bg-red-500/5 border-red-500/30'
                        : 'bg-muted/30 border-border/50'
                    }`}
                  >
                    {/* Agent Header */}
                    <button
                      onClick={() => setExpandedAgent(isAgentExpanded ? null : agent.id)}
                      className="flex items-center gap-2 w-full text-left"
                    >
                      <AgentIcon 
                        agent={agent.agent} 
                        status={agent.status} 
                        className="w-4 h-4" 
                      />
                      <span className={`text-sm font-medium ${config.color}`}>
                        {config.label} Agent
                      </span>
                      <span className="flex-1" />
                      <StatusBadge status={agent.status} />
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform ${
                          isAgentExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Task Description */}
                    <div className="mt-2 pl-6">
                      <p className="text-xs text-muted-foreground">
                        {agent.task}
                      </p>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isAgentExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-border/50">
                            {/* Progress Updates */}
                            {agent.progress && agent.status === 'running' && (
                              <div className="mb-3">
                                <span className="text-xs text-muted-foreground">Progress:</span>
                                <p className="text-sm text-foreground mt-1 pl-2 border-l-2 border-primary/20">
                                  {agent.progress}
                                </p>
                              </div>
                            )}
                            
                            {/* Summary (when completed) */}
                            {agent.summary && agent.status === 'completed' && (
                              <div>
                                <span className="text-xs text-muted-foreground">Result:</span>
                                <pre className="text-xs text-foreground mt-1 p-2 rounded bg-muted/50 overflow-x-auto max-h-40 whitespace-pre-wrap">
                                  {agent.summary}
                                </pre>
                              </div>
                            )}
                            
                            {/* Error */}
                            {agent.status === 'error' && (
                              <div className="p-2 rounded bg-red-500/10 text-red-500 text-xs">
                                {agent.summary || 'An error occurred'}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AgentThinkingPanel;
