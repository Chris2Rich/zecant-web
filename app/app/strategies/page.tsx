// Strategy-related TypeScript interfaces and types

interface Strategy {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: StrategyStatus;
  config: StrategyConfig;
  backtestResults?: BacktestResults;
  tags: string[];
}

type StrategyStatus = 'draft' | 'backtesting' | 'completed' | 'failed';

interface StrategyConfig {
  // Model configuration
  modelType: ModelType;
  modelParams: Record<string, any>;

  // Feature engineering
  features: FeatureConfig[];

  // Position sizing
  positionSizer: PositionSizerConfig;

  // Backtest parameters
  backtestStart: Date;
  backtestEnd: Date;
  symbols: string[];
  startingCapital: number;

  // Training parameters
  retrainFrequency: number;
  trainingWindowType: 'expanding' | 'rolling';
  trainingWindowSize?: number;
}

type ModelType = 'random_forest' | 'gradient_boosting' | 'neural_network';

interface FeatureConfig {
  type: FeatureType;
  params: Record<string, any>;
  enabled: boolean;
}

type FeatureType =
  | 'returns'
  | 'log_returns'
  | 'volatility'
  | 'correlation'
  | 'momentum'
  | 'moving_average'
  | 'rsi'
  | 'bollinger_bands'
  | 'macd'
  | 'atr'
  | 'volume_profile'
  | 'cross_sectional_rank'
  | 'regime'
  | 'seasonality'
  | 'lagged_features';

interface PositionSizerConfig {
  type: PositionSizerType;
  params: Record<string, any>;
}

type PositionSizerType =
  | 'fixed'
  | 'fixed_fractional'
  | 'kelly'
  | 'risk_parity'
  | 'volatility_targeting'
  | 'max_drawdown'
  | 'ensemble';

interface BacktestResults {
  id: string;
  strategyId: string;
  executedAt: Date;
  duration: number; // in seconds

  // Portfolio performance
  portfolio: PortfolioPerformance;

  // Trade analysis
  trades: Trade[];

  // Risk metrics
  risk: RiskMetrics;

  // Charts data
  equityCurve: EquityPoint[];
  drawdownCurve: DrawdownPoint[];
}

interface PortfolioPerformance {
  startingCapital: number;
  endingCapital: number;
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  calmarRatio: number;
  winRate: number;
  profitFactor: number;
  expectancy: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
}

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  pnl?: number;
  pnlPercent?: number;
}

interface RiskMetrics {
  valueAtRisk95: number;
  expectedShortfall95: number;
  beta: number;
  alpha: number;
  trackingError: number;
  informationRatio: number;
}

interface EquityPoint {
  date: Date;
  equity: number;
  cash: number;
  positions: Record<string, number>;
}

interface DrawdownPoint {
  date: Date;
  drawdown: number;
  peak: number;
}

// UI State types
type ViewMode = 'dashboard' | 'detail' | 'comparison';

interface StrategyFilters {
  status?: StrategyStatus[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

// Form types for strategy creation
interface StrategyFormData {
  name: string;
  description: string;
  config: StrategyConfig;
}

// Mock data generators
function generateMockStrategies(): Strategy[] {
  const strategies: Strategy[] = [
    {
      id: '1',
      name: 'SPY Momentum Strategy',
      description: 'A momentum-based strategy focused on SPY with RSI and MACD indicators',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      status: 'completed',
      tags: ['momentum', 'technical', 'SPY'],
      config: {
        modelType: 'random_forest',
        modelParams: { n_estimators: 100, max_depth: 10 },
        features: [
          { type: 'returns', params: { symbol: 'SPY', period: 1 }, enabled: true },
          { type: 'rsi', params: { symbol: 'SPY', period: 14 }, enabled: true },
          { type: 'macd', params: { symbol: 'SPY' }, enabled: true },
          { type: 'volatility', params: { symbol: 'SPY', window: 20 }, enabled: true }
        ],
        positionSizer: { type: 'fixed_fractional', params: { fraction: 0.1 } },
        backtestStart: new Date('2020-01-01'),
        backtestEnd: new Date('2023-12-31'),
        symbols: ['SPY'],
        startingCapital: 100000,
        retrainFrequency: 252,
        trainingWindowType: 'expanding'
      },
      backtestResults: generateMockBacktestResults('1')
    },
    {
      id: '2',
      name: 'Multi-Asset Mean Reversion',
      description: 'Mean reversion strategy across multiple tech stocks',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      status: 'completed',
      tags: ['mean-reversion', 'multi-asset', 'tech'],
      config: {
        modelType: 'gradient_boosting',
        modelParams: { n_estimators: 200, learning_rate: 0.1 },
        features: [
          { type: 'bollinger_bands', params: { symbol: 'AAPL', window: 20 }, enabled: true },
          { type: 'bollinger_bands', params: { symbol: 'MSFT', window: 20 }, enabled: true },
          { type: 'correlation', params: { symbols: ['AAPL', 'MSFT'] }, enabled: true }
        ],
        positionSizer: { type: 'risk_parity', params: { target_volatility: 0.15 } },
        backtestStart: new Date('2021-01-01'),
        backtestEnd: new Date('2023-12-31'),
        symbols: ['AAPL', 'MSFT', 'GOOGL'],
        startingCapital: 100000,
        retrainFrequency: 126,
        trainingWindowType: 'rolling',
        trainingWindowSize: 504
      },
      backtestResults: generateMockBacktestResults('2')
    },
    {
      id: '3',
      name: 'VIX Fear & Greed',
      description: 'Strategy that trades based on market fear indicators',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
      status: 'draft',
      tags: ['volatility', 'fear-greed', 'VIX'],
      config: {
        modelType: 'random_forest',
        modelParams: { n_estimators: 50, max_depth: 5 },
        features: [
          { type: 'volatility', params: { symbol: '^VIX', window: 20 }, enabled: true },
          { type: 'correlation', params: { symbols: ['SPY', '^VIX'] }, enabled: true }
        ],
        positionSizer: { type: 'kelly', params: { max_kelly_fraction: 0.25 } },
        backtestStart: new Date('2019-01-01'),
        backtestEnd: new Date('2023-12-31'),
        symbols: ['SPY'],
        startingCapital: 50000,
        retrainFrequency: 63,
        trainingWindowType: 'expanding'
      }
    }
  ];

  return strategies;
}

function generateMockBacktestResults(strategyId: string): BacktestResults {
  const baseDate = new Date('2020-01-01');
  const equityCurve: EquityPoint[] = [];
  const drawdownCurve: DrawdownPoint[] = [];

  let equity = 100000;
  let peak = equity;
  let maxDrawdown = 0;

  for (let i = 0; i < 1000; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);

    // Simulate equity growth with some volatility
    const dailyReturn = (Math.random() - 0.48) * 0.02; // Slight positive bias
    equity *= (1 + dailyReturn);

    peak = Math.max(peak, equity);
    const drawdown = (peak - equity) / peak;
    maxDrawdown = Math.max(maxDrawdown, drawdown);

    equityCurve.push({
      date,
      equity,
      cash: equity * 0.1,
      positions: { 'SPY': equity * 0.9 / 400 } // Approximate SPY price
    });

    drawdownCurve.push({
      date,
      drawdown,
      peak
    });
  }

  const trades: Trade[] = [];
  for (let i = 0; i < 50; i++) {
    const tradeDate = new Date(baseDate);
    tradeDate.setDate(tradeDate.getDate() + Math.floor(Math.random() * 1000));

    trades.push({
      id: `trade-${i}`,
      symbol: 'SPY',
      side: Math.random() > 0.5 ? 'buy' : 'sell',
      quantity: Math.floor(Math.random() * 100) + 10,
      price: 350 + Math.random() * 100,
      timestamp: tradeDate,
      pnl: (Math.random() - 0.4) * 1000,
      pnlPercent: (Math.random() - 0.4) * 5
    });
  }

  return {
    id: `backtest-${strategyId}`,
    strategyId,
    executedAt: new Date(),
    duration: Math.floor(Math.random() * 300) + 60,
    portfolio: {
      startingCapital: 100000,
      endingCapital: equity,
      totalReturn: (equity - 100000) / 100000,
      annualizedReturn: Math.pow(equity / 100000, 1 / 4) - 1, // Approximate 4-year return
      volatility: 0.15 + Math.random() * 0.1,
      sharpeRatio: 0.8 + Math.random() * 0.8,
      sortinoRatio: 1.0 + Math.random() * 0.5,
      maxDrawdown,
      calmarRatio: 0.5 + Math.random() * 0.5,
      winRate: 0.52 + Math.random() * 0.2,
      profitFactor: 1.1 + Math.random() * 0.3,
      expectancy: 50 + Math.random() * 100,
      totalTrades: trades.length,
      winningTrades: Math.floor(trades.length * (0.52 + Math.random() * 0.2)),
      losingTrades: Math.floor(trades.length * (0.48 - Math.random() * 0.2))
    },
    trades,
    risk: {
      valueAtRisk95: -0.05 - Math.random() * 0.05,
      expectedShortfall95: -0.08 - Math.random() * 0.04,
      beta: 0.8 + Math.random() * 0.4,
      alpha: -0.02 + Math.random() * 0.04,
      trackingError: 0.03 + Math.random() * 0.02,
      informationRatio: -0.5 + Math.random()
    },
    equityCurve,
    drawdownCurve
  };
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  Zap,
  Archive,
  GitCompare,
  Settings,
  Play,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarContext } from "@/components/SidebarContext";
import { StrategyLibraryModal } from "@/components/StrategyLibraryModal";

// Main Strategy Dashboard Component
function StrategyDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [comparisonStrategies, setComparisonStrategies] = useState<Strategy[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isCreationOpen, setIsCreationOpen] = useState(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for sidebar handlers
  const newStrategyHandlerRef = useRef<(() => void) | null>(null);
  const libraryHandlerRef = useRef<(() => void) | null>(null);
  const compareHandlerRef = useRef<(() => void) | null>(null);

  const { register, unregister } = useSidebarContext();

  // Load mock data on mount
  useEffect(() => {
    const loadStrategies = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStrategies(generateMockStrategies());
      setIsLoading(false);
    };

    loadStrategies();
  }, []);

  // Sidebar integration
  useEffect(() => {
    const regId = register([
      { icon: Plus, label: "New Strategy", fn: () => setIsCreationOpen(true) },
      { icon: Archive, label: "Strategy Library", fn: () => setIsLibraryOpen(true) },
      { icon: GitCompare, label: "Compare Strategies", fn: handleCompareToggle }
    ]);

    return () => unregister(regId);
  }, [register, unregister]);

  const handleCompareToggle = () => {
    if (viewMode === 'comparison') {
      setViewMode('dashboard');
      setComparisonStrategies([]);
    } else {
      setViewMode('comparison');
    }
  };

  const handleStrategySelect = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setViewMode('detail');
    setIsLibraryOpen(false);
  };

  const handleStrategyCreate = (newStrategy: Strategy) => {
    setStrategies(prev => [newStrategy, ...prev]);
    setSelectedStrategy(newStrategy);
    setViewMode('detail');
    setIsCreationOpen(false);
  };

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
    setSelectedStrategy(null);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading strategies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <AnimatePresence mode="wait">
        {viewMode === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full"
          >
            <StrategyDashboardView
              strategies={strategies}
              onStrategySelect={handleStrategySelect}
              onCreateNew={() => setIsCreationOpen(true)}
            />
          </motion.div>
        )}

        {viewMode === 'detail' && selectedStrategy && (
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
              onEdit={() => {/* TODO: Implement edit */}}
            />
          </motion.div>
        )}

        {viewMode === 'comparison' && (
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
              onAddStrategy={(strategy) => setComparisonStrategies(prev => [...prev, strategy])}
              onRemoveStrategy={(strategyId) => setComparisonStrategies(prev => prev.filter(s => s.id !== strategyId))}
              onBack={() => setViewMode('dashboard')}
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
  onStrategySelect,
  onCreateNew
}: {
  strategies: Strategy[];
  onStrategySelect: (strategy: Strategy) => void;
  onCreateNew: () => void;
}) {
  const completedStrategies = strategies.filter(s => s.status === 'completed');
  const totalReturn = completedStrategies.reduce((sum, s) =>
    sum + (s.backtestResults?.portfolio.totalReturn || 0), 0
  ) / Math.max(completedStrategies.length, 1);

  return (
    <div className="h-full space-y-6">
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
        <div className="bg-card/70 backdrop-blur-glass rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Total Strategies</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{strategies.length}</p>
        </div>

        <div className="bg-card/70 backdrop-blur-glass rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-muted-foreground">Completed</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {completedStrategies.length}
          </p>
        </div>

        <div className="bg-card/70 backdrop-blur-glass rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-muted-foreground">Avg Return</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {(totalReturn * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-card/70 backdrop-blur-glass rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-muted-foreground">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {strategies.filter(s => s.status === 'backtesting').length}
          </p>
        </div>
      </div>

      {/* Recent Strategies */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Recent Strategies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategies.slice(0, 6).map((strategy) => (
            <StrategyCard
              key={strategy.id}
              strategy={strategy}
              onClick={() => onStrategySelect(strategy)}
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
function StrategyCard({ strategy, onClick }: { strategy: Strategy; onClick: () => void }) {
  const getStatusColor = (status: StrategyStatus) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'backtesting': return 'text-blue-500';
      case 'failed': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: StrategyStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'backtesting': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-card/70 backdrop-blur-glass rounded-lg p-4 border border-border hover:border-border/80 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground truncate">{strategy.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {strategy.description}
          </p>
        </div>
        <div className={`flex items-center gap-1 ${getStatusColor(strategy.status)}`}>
          {getStatusIcon(strategy.status)}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {strategy.createdAt.toLocaleDateString()}
        </div>

        {strategy.backtestResults && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-green-500 font-medium">
              {(strategy.backtestResults.portfolio.totalReturn * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        {strategy.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// Strategy Detail View with Backtest Visualization
function StrategyDetailView({
  strategy,
  onBack,
  onEdit
}: {
  strategy: Strategy;
  onBack: () => void;
  onEdit: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'risk' | 'trades'>('overview');

  if (!strategy.backtestResults) {
    return (
      <div className="h-full space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{strategy.name}</h1>
            <p className="text-muted-foreground mt-1">{strategy.description}</p>
          </div>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Strategy Not Backtested</h3>
          <p className="text-muted-foreground mb-4">
            This strategy hasn't been backtested yet. Run a backtest to see performance metrics.
          </p>
          <Button>
            <Play className="w-4 h-4 mr-2" />
            Run Backtest
          </Button>
        </div>
      </div>
    );
  }

  const results = strategy.backtestResults;

  return (
    <div className="h-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{strategy.name}</h1>
          <p className="text-muted-foreground mt-1">{strategy.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Return"
          value={`${(results.portfolio.totalReturn * 100).toFixed(2)}%`}
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          color="text-green-500"
        />
        <MetricCard
          title="Sharpe Ratio"
          value={results.portfolio.sharpeRatio.toFixed(2)}
          icon={<Target className="w-5 h-5 text-blue-500" />}
          color="text-blue-500"
        />
        <MetricCard
          title="Max Drawdown"
          value={`${(results.portfolio.maxDrawdown * 100).toFixed(2)}%`}
          icon={<BarChart3 className="w-5 h-5 text-red-500" />}
          color="text-red-500"
        />
        <MetricCard
          title="Win Rate"
          value={`${(results.portfolio.winRate * 100).toFixed(1)}%`}
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
          color="text-green-500"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'risk', label: 'Risk Analysis', icon: AlertCircle },
            { id: 'trades', label: 'Trade History', icon: DollarSign }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
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
        {activeTab === 'overview' && (
          <StrategyOverviewTab strategy={strategy} results={results} />
        )}
        {activeTab === 'performance' && (
          <PerformanceTab results={results} />
        )}
        {activeTab === 'risk' && (
          <RiskAnalysisTab results={results} />
        )}
        {activeTab === 'trades' && (
          <TradeHistoryTab trades={results.trades} />
        )}
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  icon,
  color
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-card/70 backdrop-blur-glass rounded-lg p-4 border border-border">
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
function StrategyOverviewTab({
  strategy,
  results
}: {
  strategy: Strategy;
  results: BacktestResults;
}) {
  return (
    <div className="space-y-6">
      {/* Configuration Summary */}
      <div className="bg-card/70 backdrop-blur-glass rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Strategy Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-2">Model Settings</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Model Type: <span className="text-foreground">{strategy.config.modelType}</span></p>
              <p>Symbols: <span className="text-foreground">{strategy.config.symbols.join(', ')}</span></p>
              <p>Starting Capital: <span className="text-foreground">${strategy.config.startingCapital.toLocaleString()}</span></p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Backtest Period</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Start: <span className="text-foreground">{strategy.config.backtestStart.toLocaleDateString()}</span></p>
              <p>End: <span className="text-foreground">{strategy.config.backtestEnd.toLocaleDateString()}</span></p>
              <p>Duration: <span className="text-foreground">{results.duration}s</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-card/70 backdrop-blur-glass rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">
              ${(results.portfolio.endingCapital - results.portfolio.startingCapital).toLocaleString()}
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
    </div>
  );
}

// Performance Tab with Charts
function PerformanceTab({ results }: { results: BacktestResults }) {
  return (
    <div className="space-y-6">
      {/* Equity Curve Placeholder */}
      <div className="bg-card/70 backdrop-blur-glass rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Equity Curve</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
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
        <div className="bg-card/70 backdrop-blur-glass rounded-lg p-6 border border-border">
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

        <div className="bg-card/70 backdrop-blur-glass rounded-lg p-6 border border-border">
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
function RiskAnalysisTab({ results }: { results: BacktestResults }) {
  return (
    <div className="space-y-6">
      {/* Drawdown Chart Placeholder */}
      <div className="bg-card/70 backdrop-blur-glass rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Drawdown Analysis</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
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
        <div className="bg-card/70 backdrop-blur-glass rounded-lg p-6 border border-border">
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

        <div className="bg-card/70 backdrop-blur-glass rounded-lg p-6 border border-border">
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

        <div className="bg-card/70 backdrop-blur-glass rounded-lg p-6 border border-border">
          <h4 className="font-medium text-foreground mb-4">Risk-Adjusted Returns</h4>
          <div className="space-y-3">
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Calmar Ratio</span>
              <span className="font-medium text-foreground">
                {results.portfolio.calmarRatio.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Trade History Tab
function TradeHistoryTab({ trades }: { trades: Trade[] }) {
  return (
    <div className="space-y-6">
      {/* Trade Statistics */}
      <div className="bg-card/70 backdrop-blur-glass rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Trade Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{trades.length}</p>
            <p className="text-sm text-muted-foreground">Total Trades</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">
              {trades.filter(t => (t.pnl || 0) > 0).length}
            </p>
            <p className="text-sm text-muted-foreground">Winning</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">
              {trades.filter(t => (t.pnl || 0) < 0).length}
            </p>
            <p className="text-sm text-muted-foreground">Losing</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {trades.length > 0 ? (trades.filter(t => (t.pnl || 0) > 0).length / trades.length * 100).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Win Rate</p>
          </div>
        </div>
      </div>

      {/* Trade History Table */}
      <div className="bg-card/70 backdrop-blur-glass rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Symbol</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Side</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Quantity</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">P&L</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">P&L %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {trades.slice(0, 20).map((trade) => (
                <tr key={trade.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm text-foreground">
                    {trade.timestamp.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {trade.symbol}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      trade.side === 'buy'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {trade.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    {trade.quantity.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    ${trade.price.toFixed(2)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${
                    (trade.pnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    ${(trade.pnl || 0).toFixed(2)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${
                    (trade.pnlPercent || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {(trade.pnlPercent || 0).toFixed(2)}%
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
  onBack
}: {
  strategies: Strategy[];
  availableStrategies: Strategy[];
  onAddStrategy: (strategy: Strategy) => void;
  onRemoveStrategy: (strategyId: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="h-full space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Strategy Comparison</h1>
          <p className="text-muted-foreground mt-1">Compare performance across multiple strategies</p>
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
  onCreateStrategy
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateStrategy: (strategy: Strategy) => void;
}) {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="bg-card rounded-lg border border-border p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Create New Strategy</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>

          <div className="text-center py-12">
            <Plus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Strategy Creation Wizard</h3>
            <p className="text-muted-foreground">
              Multi-step configuration form will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StrategiesPage() {
  return <StrategyDashboard />;
}
