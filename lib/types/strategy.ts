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
  "rsi",
  "macd",
  "sma",
  "ema",
  "volume",
  "bb_width",
  "atr",
  "price",
  "vwap",
  "adx",
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
