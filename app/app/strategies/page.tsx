"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  BarChart3,
  TrendingUp,
  Calendar,
  Archive,
  GitCompare,
  Play,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ArrowLeft,
  X,
  Target,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarContext } from "@/components/SidebarContext";
import { StrategyLibraryModal } from "@/components/StrategyLibraryModal";
import { strategyService } from "@/lib/services/strategyService";
import type {
  Strategy,
  StrategyConfig,
  BacktestResult,
  StrategyStatus,
} from "@/lib/types/strategy";

// Auto-camelCase tags for display
const camelCaseTag = (tag: string) => {
  return tag
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Main Strategy Dashboard Component
function StrategyDashboard() {
  const [viewMode, setViewMode] = useState<"dashboard" | "detail" | "comparison">("dashboard");
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [comparisonStrategies, setComparisonStrategies] = useState<Strategy[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isCreationOpen, setIsCreationOpen] = useState(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backtestingId, setBacktestingId] = useState<string | null>(null);

  const { register, unregister } = useSidebarContext();

  // Load strategies on mount
  useEffect(() => {
    loadStrategies();
  }, []);

  // Sidebar integration
  useEffect(() => {
    const regId = register([
      { icon: Plus, label: "New Strategy", fn: () => setIsCreationOpen(true) },
      { icon: Archive, label: "Strategy Library", fn: () => setIsLibraryOpen(true) },
      { icon: GitCompare, label: "Compare Strategies", fn: handleCompareToggle },
    ]);

    return () => unregister(regId);
  }, [register, unregister]);

  const loadStrategies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const strategies = await strategyService.getStrategies();
      setStrategies(strategies);
    } catch (err: any) {
      setError(err.message || "Failed to load strategies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareToggle = () => {
    if (viewMode === "comparison") {
      setViewMode("dashboard");
      setComparisonStrategies([]);
    } else {
      setViewMode("comparison");
    }
  };

  const handleStrategySelect = async (strategy: Strategy) => {
    // Fetch full strategy data with backtest results from the detail endpoint
    try {
      const fullStrategy = await strategyService.getStrategy(strategy.strategy_id);
      setSelectedStrategy(fullStrategy);
    } catch (err) {
      // Fallback to local data if fetch fails
      console.error("Failed to fetch strategy details:", err);
      setSelectedStrategy(strategy);
    }
    setViewMode("detail");
    setIsLibraryOpen(false);
  };

  const handleStrategyCreate = async (newStrategy: Strategy) => {
    try {
      await loadStrategies(); // Refresh the list
      setSelectedStrategy(newStrategy);
      setViewMode("detail");
      setIsCreationOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to create strategy");
    }
  };

  const handleBackToDashboard = () => {
    setViewMode("dashboard");
    setSelectedStrategy(null);
  };

  const handleRunBacktest = async (strategyId: string) => {
    setBacktestingId(strategyId);
    setError(null);
    try {
      const response = await strategyService.runBacktest(strategyId);
      
      // Poll for status
      await strategyService.pollBacktestStatus(
        response.backtest_id,
        (status) => {
          // Update the strategy in the list with new backtest status
          setStrategies((prev) =>
            prev.map((s) =>
              s.strategy_id === strategyId
                ? { ...s, status: status.status === "completed" ? "completed" : "backtesting" }
                : s
            )
          );
          
          // If this is the selected strategy, update it too
          if (selectedStrategy?.strategy_id === strategyId) {
            setSelectedStrategy((prev) =>
              prev
                ? {
                    ...prev,
                    status: status.status === "completed" ? "completed" : "backtesting",
                    backtest_results: status,
                  }
                : null
            );
          }
        }
      );

      // Reload strategies to get final results
      await loadStrategies();
    } catch (err: any) {
      setError(err.message || "Failed to run backtest");
    } finally {
      setBacktestingId(null);
    }
  };

  const handleDeleteStrategy = async (strategyId: string) => {
    if (!confirm("Are you sure you want to delete this strategy?")) return;
    
    try {
      await strategyService.deleteStrategy(strategyId);
      await loadStrategies();
      if (selectedStrategy?.strategy_id === strategyId) {
        handleBackToDashboard();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete strategy");
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Loading strategies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full scrollbar-thin">
      <AnimatePresence mode="wait">
        {viewMode === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full"
          >
            <StrategyDashboardView
              strategies={strategies}
              error={error}
              onStrategySelect={handleStrategySelect}
              onCreateNew={() => setIsCreationOpen(true)}
              onRunBacktest={handleRunBacktest}
              onDeleteStrategy={handleDeleteStrategy}
              backtestingId={backtestingId}
            />
          </motion.div>
        )}

        {viewMode === "detail" && selectedStrategy && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <StrategyDetailView
              strategy={selectedStrategy}
              onBack={handleBackToDashboard}
              onRunBacktest={() => handleRunBacktest(selectedStrategy.strategy_id)}
              onDelete={() => handleDeleteStrategy(selectedStrategy.strategy_id)}
              isBacktesting={backtestingId === selectedStrategy.strategy_id}
            />
          </motion.div>
        )}

        {viewMode === "comparison" && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-full"
          >
            <StrategyComparisonView
              strategies={comparisonStrategies}
              availableStrategies={strategies}
              onAddStrategy={(strategy) =>
                setComparisonStrategies((prev) => [...prev, strategy])
              }
              onRemoveStrategy={(strategyId) =>
                setComparisonStrategies((prev) =>
                  prev.filter((s) => s.strategy_id !== strategyId)
                )
              }
              onBack={() => setViewMode("dashboard")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <StrategyLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        strategies={strategies}
        onSelectStrategy={handleStrategySelect}
      />

      <StrategyCreationModal
        isOpen={isCreationOpen}
        onClose={() => setIsCreationOpen(false)}
        onCreateStrategy={handleStrategyCreate}
      />
    </div>
  );
}

// Dashboard View Component
function StrategyDashboardView({
  strategies,
  error,
  onStrategySelect,
  onCreateNew,
  onRunBacktest,
  onDeleteStrategy,
  backtestingId,
}: {
  strategies: Strategy[];
  error: string | null;
  onStrategySelect: (strategy: Strategy) => void;
  onCreateNew: () => void;
  onRunBacktest: (strategyId: string) => void;
  onDeleteStrategy: (strategyId: string) => void;
  backtestingId: string | null;
}) {
  const completedStrategies = strategies.filter((s) => s.status === "completed");
  const avgReturn =
    completedStrategies.length > 0
      ? completedStrategies.reduce(
          (sum, s) => sum + (s.backtest_results?.portfolio?.totalReturn || 0),
          0
        ) / completedStrategies.length
      : 0;

  return (
    <div className="h-full space-y-6">
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 rounded-sm border border-red-500/20 bg-red-500/10 text-red-500">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trading Strategies</h1>
          <p className="text-muted-foreground mt-1">
            Create, backtest, and analyze algorithmic trading strategies
          </p>
        </div>
        <Button onClick={onCreateNew} className="gap-2">
          <Plus className="w-4 h-4" />
          New Strategy
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card/70 backdrop-blur-glass rounded-sm p-4 border border-border">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Total Strategies
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{strategies.length}</p>
        </div>

        <div className="bg-card/70 backdrop-blur-glass rounded-sm p-4 border border-border">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-muted-foreground">Completed</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {completedStrategies.length}
          </p>
        </div>

        <div className="bg-card/70 backdrop-blur-glass rounded-sm p-4 border border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-muted-foreground">Avg Return</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {(avgReturn * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-card/70 backdrop-blur-glass rounded-sm p-4 border border-border">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-muted-foreground">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {strategies.filter((s) => s.status === "backtesting").length}
          </p>
        </div>
      </div>

      {/* Recent Strategies */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Recent Strategies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategies.slice(0, 6).map((strategy) => (
            <StrategyCard
              key={strategy.strategy_id}
              strategy={strategy}
              onClick={() => onStrategySelect(strategy)}
              onRunBacktest={(e) => {
                e.stopPropagation();
                onRunBacktest(strategy.strategy_id);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                onDeleteStrategy(strategy.strategy_id);
              }}
              isBacktesting={backtestingId === strategy.strategy_id}
            />
          ))}
        </div>

        {strategies.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No strategies yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first trading strategy to get started
            </p>
            <Button onClick={onCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Strategy
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Strategy Card Component
function StrategyCard({
  strategy,
  onClick,
  onRunBacktest,
  onDelete,
  isBacktesting,
}: {
  strategy: Strategy;
  onClick: () => void;
  onRunBacktest: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  isBacktesting: boolean;
}) {
  const getStatusColor = (status: StrategyStatus) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "backtesting":
        return "text-blue-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: StrategyStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "backtesting":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative group bg-card/70 backdrop-blur-glass rounded-sm p-4 border border-border hover:border-border/80 cursor-pointer transition-colors h-56 flex flex-col" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate group-hover:text-accent-foreground transition-colors">{strategy.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10 overflow-hidden">
            {strategy.description}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 ${getStatusColor(strategy.status)} flex-shrink-0`}
        >
          {getStatusIcon(strategy.status)}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {new Date(strategy.created_at).toLocaleDateString()}
        </div>

        {strategy.backtest_results?.portfolio && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-green-500 font-medium">
              {(strategy.backtest_results.portfolio.totalReturn * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mt-auto mb-3">
        {strategy.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
          >
            {camelCaseTag(tag)}
          </span>
        ))}
      </div>

      {/* Action Buttons - positioned at bottom */}
      <div className="flex gap-2 mt-auto">
        {strategy.status === "draft" && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onRunBacktest(e);
            }}
            disabled={isBacktesting}
          >
            {isBacktesting ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Play className="w-3 h-3 mr-1" />
            )}
            Run Backtest
          </Button>
        )}
      </div>

      {/* Delete Button - right aligned, absolute positioned */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(e);
        }}
        className="absolute bottom-2 right-2 p-2 rounded-sm bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all opacity-50 hover:opacity-100 z-10 hover:cursor-pointer"
        title="Delete strategy"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// Strategy Detail View with Backtest Visualization
function StrategyDetailView({
  strategy,
  onBack,
  onRunBacktest,
  onDelete,
  isBacktesting,
}: {
  strategy: Strategy;
  onBack: () => void;
  onRunBacktest: () => void;
  onDelete: () => void;
  isBacktesting: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "performance" | "risk" | "trades">(
    "overview"
  );

  const results = strategy.backtest_results;

  if (!results) {
    return (
      <div className="h-full space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{strategy.name}</h1>
            <p className="text-muted-foreground mt-1">{strategy.description}</p>
          </div>
          <button
        onClick={onDelete}
        className="p-2 rounded-sm bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all opacity-50 hover:opacity-100 z-10 hover:cursor-pointer"
        title="Delete strategy"
      >
        <Trash2 className="w-4 h-4" />
      </button>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Strategy Not Backtested</h3>
          <p className="text-muted-foreground mb-4">
            This strategy hasn't been backtested yet. Run a backtest to see performance
            metrics.
          </p>
          <Button onClick={onRunBacktest} disabled={isBacktesting}>
            {isBacktesting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Run Backtest
          </Button>
        </div>
      </div>
    );
  }

  const portfolio = results.portfolio;

  return (
    <div className="h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{strategy.name}</h1>
            <p className="text-muted-foreground mt-1">{strategy.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onRunBacktest}
            disabled={isBacktesting}
          >
            {isBacktesting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Re-Run Backtest
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <button
        onClick={onDelete}
        className="p-2 rounded-sm bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all opacity-50 hover:opacity-100 z-10 hover:cursor-pointer"
        title="Delete strategy"
      >
        <Trash2 className="w-4 h-4" />
      </button>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      {portfolio && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total Return"
            value={`${(portfolio.totalReturn * 100).toFixed(2)}%`}
            icon={<TrendingUp className="w-5 h-5 text-green-500" />}
            color="text-green-500"
          />
          <MetricCard
            title="Sharpe Ratio"
            value={portfolio.sharpeRatio.toFixed(2)}
            icon={<Target className="w-5 h-5 text-blue-500" />}
            color="text-blue-500"
          />
          <MetricCard
            title="Max Drawdown"
            value={`${(portfolio.maxDrawdown * 100).toFixed(2)}%`}
            icon={<BarChart3 className="w-5 h-5 text-red-500" />}
            color="text-red-500"
          />
          <MetricCard
            title="Win Rate"
            value={`${(portfolio.winRate * 100).toFixed(1)}%`}
            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
            color="text-green-500"
          />
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-8">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "performance", label: "Performance", icon: TrendingUp },
            { id: "risk", label: "Risk Analysis", icon: AlertCircle },
            { id: "trades", label: "Trade History", icon: DollarSign },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === "overview" && <StrategyOverviewTab strategy={strategy} />}
        {activeTab === "performance" && results && <PerformanceTab results={results} />}
        {activeTab === "risk" && results && <RiskAnalysisTab results={results} />}
        {activeTab === "trades" && results?.trades && <TradeHistoryTab trades={results.trades} />}
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-card/70 backdrop-blur-glass rounded-sm p-4 border border-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

// Overview Tab
function StrategyOverviewTab({ strategy }: { strategy: Strategy }) {
  const config = strategy.config as any;
  const results = strategy.backtest_results;

  return (
    <div className="space-y-6">
      {/* Configuration Summary */}
      <div className="bg-card/70 backdrop-blur-glass rounded-sm p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Strategy Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-2">Model Settings</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                Model Type:{" "}
                <span className="text-foreground">{config?.model_type || "N/A"}</span>
              </p>
              <p>
                Symbols:{" "}
                <span className="text-foreground">
                  {(config?.traded_symbols || []).join(", ")}
                </span>
              </p>
              <p>
                Starting Capital:{" "}
                <span className="text-foreground">
                  ${config?.starting_capital?.toLocaleString() || "N/A"}
                </span>
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Backtest Period</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                Start:{" "}
                <span className="text-foreground">
                  {config?.backtest_start
                    ? new Date(config.backtest_start).toLocaleDateString()
                    : "N/A"}
                </span>
              </p>
              <p>
                End:{" "}
                <span className="text-foreground">
                  {config?.backtest_end
                    ? new Date(config.backtest_end).toLocaleDateString()
                    : "N/A"}
                </span>
              </p>
              <p>
                Duration:{" "}
                <span className="text-foreground">
                  {results?.duration_seconds
                    ? `${results.duration_seconds}s`
                    : "N/A"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      {results?.portfolio && (
        <div className="bg-card/70 backdrop-blur-glass rounded-sm p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Performance Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                ${
                  (
                    results.portfolio.endingCapital - results.portfolio.startingCapital
                  ).toLocaleString()
                }
              </p>
              <p className="text-sm text-muted-foreground">Total P&L</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {results.portfolio.totalTrades}
              </p>
              <p className="text-sm text-muted-foreground">Total Trades</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {results.portfolio.winningTrades}
              </p>
              <p className="text-sm text-muted-foreground">Winning Trades</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">
                {results.portfolio.losingTrades}
              </p>
              <p className="text-sm text-muted-foreground">Losing Trades</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Performance Tab with Charts
function PerformanceTab({ results }: { results: BacktestResult }) {
  if (!results.portfolio) return null;

  return (
    <div className="space-y-6">
      {/* Equity Curve Placeholder */}
      <div className="bg-card/70 backdrop-blur-glass rounded-sm p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Equity Curve</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-sm">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Equity curve chart will be implemented here</p>
            <p className="text-sm text-muted-foreground mt-1">
              Showing portfolio value over time
            </p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card/70 backdrop-blur-glass rounded-sm p-6 border border-border">
          <h4 className="font-medium text-foreground mb-4">Return Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Annualized Return</span>
              <span className="font-medium text-foreground">
                {(results.portfolio.annualizedReturn * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volatility</span>
              <span className="font-medium text-foreground">
                {(results.portfolio.volatility * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sharpe Ratio</span>
              <span className="font-medium text-foreground">
                {results.portfolio.sharpeRatio.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sortino Ratio</span>
              <span className="font-medium text-foreground">
                {results.portfolio.sortinoRatio.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-glass rounded-sm p-6 border border-border">
          <h4 className="font-medium text-foreground mb-4">Risk Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Drawdown</span>
              <span className="font-medium text-red-500">
                {(results.portfolio.maxDrawdown * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Calmar Ratio</span>
              <span className="font-medium text-foreground">
                {results.portfolio.calmarRatio.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Win Rate</span>
              <span className="font-medium text-foreground">
                {(results.portfolio.winRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profit Factor</span>
              <span className="font-medium text-foreground">
                {results.portfolio.profitFactor.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Risk Analysis Tab
function RiskAnalysisTab({ results }: { results: BacktestResult }) {
  if (!results.risk) return null;

  return (
    <div className="space-y-6">
      {/* Drawdown Chart Placeholder */}
      <div className="bg-card/70 backdrop-blur-glass rounded-sm p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Drawdown Analysis</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-sm">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Drawdown chart will be implemented here</p>
            <p className="text-sm text-muted-foreground mt-1">
              Showing peak-to-trough declines
            </p>
          </div>
        </div>
      </div>

      {/* Risk Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card/70 backdrop-blur-glass rounded-sm p-6 border border-border">
          <h4 className="font-medium text-foreground mb-4">Market Risk</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Beta</span>
              <span className="font-medium text-foreground">
                {results.risk.beta.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Alpha</span>
              <span className="font-medium text-foreground">
                {(results.risk.alpha * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tracking Error</span>
              <span className="font-medium text-foreground">
                {(results.risk.trackingError * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-glass rounded-sm p-6 border border-border">
          <h4 className="font-medium text-foreground mb-4">Value at Risk</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">VaR (95%)</span>
              <span className="font-medium text-foreground">
                {(results.risk.valueAtRisk95 * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expected Shortfall</span>
              <span className="font-medium text-foreground">
                {(results.risk.expectedShortfall95 * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Information Ratio</span>
              <span className="font-medium text-foreground">
                {results.risk.informationRatio.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-glass rounded-sm p-6 border border-border">
          <h4 className="font-medium text-foreground mb-4">Risk-Adjusted Returns</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sharpe Ratio</span>
              <span className="font-medium text-foreground">
                {results.portfolio?.sharpeRatio.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sortino Ratio</span>
              <span className="font-medium text-foreground">
                {results.portfolio?.sortinoRatio.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Calmar Ratio</span>
              <span className="font-medium text-foreground">
                {results.portfolio?.calmarRatio.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Trade History Tab
function TradeHistoryTab({ trades }: { trades: any[] }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No trades available</p>
      </div>
    );
  }

  const winningTrades = trades.filter((t) => (t.pnl || 0) > 0).length;

  return (
    <div className="space-y-6">
      {/* Trade Statistics */}
      <div className="bg-card/70 backdrop-blur-glass rounded-sm p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Trade Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{trades.length}</p>
            <p className="text-sm text-muted-foreground">Total Trades</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">{winningTrades}</p>
            <p className="text-sm text-muted-foreground">Winning</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">{trades.length - winningTrades}</p>
            <p className="text-sm text-muted-foreground">Losing</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {trades.length > 0 ? ((winningTrades / trades.length) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Win Rate</p>
          </div>
        </div>
      </div>

      {/* Trade History Table */}
      <div className="bg-card/70 backdrop-blur-glass rounded-sm border border-border overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-96">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Symbol
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Side
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  P&L
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  P&L %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {trades.slice(0, 20).map((trade, idx) => (
                <tr key={idx} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm text-foreground">
                    {trade.timestamp ? new Date(trade.timestamp).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {trade.symbol}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        trade.side === "buy"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {trade.side?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    {trade.quantity?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    ${trade.price?.toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-right font-medium ${
                      (trade.pnl || 0) >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    ${(trade.pnl || 0).toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-right font-medium ${
                      (trade.pnl_percent || 0) >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {(trade.pnl_percent || 0).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {trades.length > 20 && (
          <div className="px-4 py-3 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Showing 20 of {trades.length} trades. Export for full history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Placeholder components for other views
function StrategyComparisonView({
  strategies,
  availableStrategies,
  onAddStrategy,
  onRemoveStrategy,
  onBack,
}: {
  strategies: Strategy[];
  availableStrategies: Strategy[];
  onAddStrategy: (strategy: Strategy) => void;
  onRemoveStrategy: (strategyId: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="h-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Strategy Comparison</h1>
          <p className="text-muted-foreground mt-1">
            Compare performance across multiple strategies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="text-center py-12">
        <GitCompare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Strategy Comparison</h3>
        <p className="text-muted-foreground">
          Side-by-side analysis and comparison charts will be implemented here
        </p>
      </div>
    </div>
  );
}

function StrategyCreationModal({
  isOpen,
  onClose,
  onCreateStrategy,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateStrategy: (strategy: Strategy) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [symbols, setSymbols] = useState("SPY");
  const [startingCapital, setStartingCapital] = useState("100000");
  const [backtestStart, setBacktestStart] = useState("2020-01-01");
  const [backtestEnd, setBacktestEnd] = useState("2023-12-31");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const config: StrategyConfig = {
        traded_symbols: symbols.split(",").map((s) => s.trim()),
        backtest_start: backtestStart,
        backtest_end: backtestEnd,
        starting_capital: parseFloat(startingCapital),
        model_type: "RandomForest",
        model_params: {
          n_estimators: 100,
          max_depth: 10,
        },
      };

      const response = await strategyService.createStrategy({
        name,
        description,
        config,
        tags: ["user-created"],
      });

      if (response.strategy_id) {
        const newStrategy = await strategyService.getStrategy(response.strategy_id);
        onCreateStrategy(newStrategy);
        // Reset form
        setName("");
        setDescription("");
        setSymbols("SPY");
        setStartingCapital("100000");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create strategy");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-sm border border-border p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Create New Strategy</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-sm border border-red-500/20 bg-red-500/10 text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Strategy Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., SPY Momentum Strategy"
                className="w-full px-3 py-2 rounded-sm bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your strategy..."
                rows={3}
                className="w-full px-3 py-2 rounded-sm bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Symbols (comma-separated)
              </label>
              <input
                type="text"
                value={symbols}
                onChange={(e) => setSymbols(e.target.value)}
                placeholder="e.g., SPY, AAPL, MSFT"
                className="w-full px-3 py-2 rounded-sm bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Starting Capital
                </label>
                <input
                  type="number"
                  value={startingCapital}
                  onChange={(e) => setStartingCapital(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Backtest Start
                </label>
                <input
                  type="date"
                  value={backtestStart}
                  onChange={(e) => setBacktestStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Backtest End
              </label>
              <input
                type="date"
                value={backtestEnd}
                onChange={(e) => setBacktestEnd(e.target.value)}
                className="w-full px-3 py-2 rounded-sm bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Strategy"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function StrategiesPage() {
  return <StrategyDashboard />;
}
