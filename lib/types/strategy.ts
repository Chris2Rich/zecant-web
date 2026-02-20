// Generic strategy config - matches TradingSystemConfig in Python backend
// The structure is flexible and can contain any configuration
export interface StrategyConfig {
  [key: string]: any;
}

// Helper interface for common fields that might be used
export interface TradingSystemConfig {
  seed?: number;
  id?: string;
  traded_symbols: string[];
  non_traded_timeseries?: string[];
  features?: Array<[string, Record<string, any>]>;
  model_type?: string;
  model_output_type?: string;
  model_params?: Record<string, any>;
  backtest_start: string;
  backtest_end: string;
  starting_capital: number;
  commission_rate?: number;
  max_leverage?: number;
  position_sizer_type?: string;
  position_sizer_params?: Record<string, any>;
  retrain_frequency?: number;
  training_window_type?: string;
  training_window_size?: number;
  data_adapters?: Record<string, any>;
  model_save_path?: string;
}

export interface Strategy {
  strategy_id: string;
  clerk_user_id: string;
  name: string;
  description: string;
  config: StrategyConfig;
  status: "draft" | "backtesting" | "completed" | "failed";
  tags: string[];
  created_at: string;
  updated_at: string;
  backtest_results?: BacktestResult;
}

export interface BacktestResult {
  backtest_id: string;
  strategy_id: string;
  clerk_user_id: string;
  status: "pending" | "running" | "completed" | "failed";
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  duration_seconds?: number;
  starting_capital?: number;
  ending_capital?: number;
  
  // Portfolio Metrics
  portfolio?: {
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
  };
  
  // Risk Metrics
  risk?: {
    valueAtRisk95: number;
    expectedShortfall95: number;
    beta: number;
    alpha: number;
    trackingError: number;
    informationRatio: number;
  };
  
  // Curves
  equity_curve?: EquityPoint[];
  drawdown_curve?: DrawdownPoint[];
  
  // Trades (populated when fetching full results)
  trades?: Trade[];
}

export interface EquityPoint {
  date: string;
  equity: number;
  cash: number;
  positions: Record<string, number>;
}

export interface DrawdownPoint {
  date: string;
  drawdown: number;
  peak: number;
}

export interface Trade {
  trade_id: string;
  backtest_id: string;
  symbol: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  timestamp: string;
  pnl?: number;
  pnl_percent?: number;
}

export type StrategyStatus = "draft" | "backtesting" | "completed" | "failed";
export type BacktestStatus = "pending" | "running" | "completed" | "failed";

export const INDICATORS = [
  // Trend
  { value: "sma", label: "SMA (Simple Moving Average)", category: "Trend", params: ["window"] },
  { value: "ema", label: "EMA (Exponential Moving Average)", category: "Trend", params: ["period"] },
  { value: "adx", label: "ADX (Average Directional Index)", category: "Trend", params: ["period"] },
  { value: "donchian", label: "Donchian Channel", category: "Trend", params: ["period"] },
  // Momentum
  { value: "rsi", label: "RSI (Relative Strength Index)", category: "Momentum", params: ["period"] },
  { value: "macd", label: "MACD", category: "Momentum", params: ["fast", "slow", "signal"] },
  { value: "momentum", label: "Momentum", category: "Momentum", params: ["period"] },
  // Volatility
  { value: "volatility", label: "Volatility", category: "Volatility", params: ["window"] },
  { value: "atr", label: "ATR (Average True Range)", category: "Volatility", params: ["period"] },
  { value: "bb_width", label: "Bollinger Band Width", category: "Volatility", params: ["window"] },
  // Volume
  { value: "volume", label: "Volume MA", category: "Volume", params: ["window"] },
  { value: "vwap", label: "VWAP", category: "Volume", params: ["window"] },
  // Returns
  { value: "returns", label: "Returns", category: "Returns", params: ["period"] },
] as const;

export const OPERATORS = [
  { value: "<", label: "Less Than" },
  { value: ">", label: "Greater Than" },
  { value: "<=", label: "Less Than or Equal" },
  { value: ">=", label: "Greater Than or Equal" },
  { value: "==", label: "Equals" },
  { value: "!=", label: "Not Equals" },
] as const;

export const TIMEFRAMES = [
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "30m", label: "30 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
] as const;

export const MODEL_TYPES = [
  { value: "random_forest", label: "Random Forest" },
  { value: "rules_based", label: "Rules-Based" },
  { value: "gradient_boosting", label: "Gradient Boosting" },
] as const;

export const RULES = [
  { value: "ema_crossover", label: "EMA Crossover" },
  { value: "price_filter", label: "Price Filter (SMA)" },
  { value: "adx_filter", label: "ADX Trend Strength" },
  { value: "donchian_breakout", label: "Donchian Breakout" },
] as const;

export const POSITION_SIZERS = [
  { value: "fixed_fractional", label: "Fixed Fractional" },
  { value: "kelly", label: "Kelly Criterion" },
  { value: "risk_parity", label: "Risk Parity" },
  { value: "volatility_targeting", label: "Volatility Targeting" },
  { value: "max_drawdown", label: "Max Drawdown" },
] as const;

export const TRAINING_WINDOW_TYPES = [
  { value: "expanding", label: "Expanding Window" },
  { value: "rolling", label: "Rolling Window" },
] as const;

export const RANDOM_FOREST_PARAMS = [
  { 
    name: "n_estimators", 
    label: "Number of Trees", 
    type: "number", 
    default: 100,
    min: 10,
    max: 500,
    step: 10,
    description: "Number of decision trees in the forest"
  },
  { 
    name: "max_depth", 
    label: "Max Depth", 
    type: "number", 
    default: 10,
    min: 1,
    max: 50,
    step: 1,
    description: "Maximum depth of each decision tree"
  },
  { 
    name: "min_samples_split", 
    label: "Min Samples Split", 
    type: "number", 
    default: 2,
    min: 1,
    max: 20,
    step: 1,
    description: "Minimum samples required to split a node"
  },
] as const;
