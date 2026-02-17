"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, BarChart3, Calendar, CheckCircle, Clock, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Strategy, StrategyStatus } from "@/lib/types/strategy";

interface StrategyLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategies: Strategy[];
  onSelectStrategy: (strategy: Strategy) => void;
}

export function StrategyLibraryModal({
  isOpen,
  onClose,
  strategies,
  onSelectStrategy
}: StrategyLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StrategyStatus | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  // Get unique tags
  const allTags = Array.from(new Set(strategies.flatMap(s => s.tags)));

  // Filter strategies
  const filteredStrategies = strategies.filter((strategy) => {
    const matchesSearch = !searchQuery ||
      strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strategy.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || strategy.status === statusFilter;
    const matchesTag = tagFilter === 'all' || strategy.tags.includes(tagFilter);

    return matchesSearch && matchesStatus && matchesTag;
  });

  const getStatusColor = (status: StrategyStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'backtesting': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: StrategyStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'backtesting': return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-hud"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-card/95 backdrop-blur-glass border border-border-glass rounded-sm shadow-2xl w-full mx-12 flex flex-col h-[85%]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-divider">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Strategy Library</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredStrategies.length} of {strategies.length} strategies
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-sm"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-border-divider space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search strategies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border-divider rounded-xs text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-border-glass"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StrategyStatus | 'all')}
                className="px-3 py-2 bg-muted border border-border-divider rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="backtesting">Backtesting</option>
                <option value="draft">Draft</option>
                <option value="failed">Failed</option>
              </select>

              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="px-3 py-2 bg-muted border border-border-divider rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {filteredStrategies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' || tagFilter !== 'all'
                    ? "No strategies match your filters"
                    : "No strategies found"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStrategies.map((strategy) => (
                  <motion.div
                    key={strategy.strategy_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <button
                      onClick={() => onSelectStrategy(strategy)}
                      className="w-full p-4 rounded-sm border border-border-divider bg-card/70 backdrop-blur-glass hover:bg-accent hover:border-accent-foreground/20 hover:inner-light-subtle hover:cursor-pointer transition-colors text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-accent-foreground">
                            {strategy.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {strategy.description}
                          </p>

                          <div className="flex items-center gap-2 mt-3">
                            <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${getStatusColor(strategy.status)}`}>
                              {getStatusIcon(strategy.status)}
                              {strategy.status[0].toUpperCase() + strategy.status.slice(1)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(strategy.created_at).toLocaleDateString()}</span>
                            {strategy.backtest_results?.portfolio && (
                              <>
                                <span>•</span>
                                <span className="text-green-500">
                                  {(strategy.backtest_results.portfolio.totalReturn * 100).toFixed(1)}%
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {strategy.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                              >
                                {tag[0].toUpperCase() + tag.slice(1)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
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
