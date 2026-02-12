import { Strategy, StrategyConfig, BacktestResult, Trade } from "@/lib/types/strategy";

export interface CreateStrategyRequest {
  name: string;
  description: string;
  config: StrategyConfig;
  tags?: string[];
}

export interface UpdateStrategyRequest {
  name?: string;
  description?: string;
  config?: StrategyConfig;
  status?: string;
  tags?: string[];
}

export interface BacktestResponse {
  success: boolean;
  backtest_id: string;
  status: string;
}

export interface StrategyListResponse {
  strategies: Strategy[];
}

export const strategyService = {
  // Get all strategies for the current user
  async getStrategies(): Promise<Strategy[]> {
    const response = await fetch("/api/strategies");
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch strategies");
    }
    
    const data: StrategyListResponse = await response.json();
    return data.strategies;
  },

  // Get a specific strategy
  async getStrategy(strategyId: string): Promise<Strategy> {
    const response = await fetch(`/api/strategies/${strategyId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch strategy");
    }
    
    return response.json();
  },

  // Create a new strategy
  async createStrategy(request: CreateStrategyRequest): Promise<{ success: boolean; strategy_id: string }> {
    const response = await fetch("/api/strategies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create strategy");
    }
    
    return response.json();
  },

  // Update a strategy
  async updateStrategy(strategyId: string, request: UpdateStrategyRequest): Promise<{ success: boolean }> {
    const response = await fetch(`/api/strategies/${strategyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update strategy");
    }
    
    return response.json();
  },

  // Delete a strategy
  async deleteStrategy(strategyId: string): Promise<{ success: boolean }> {
    const response = await fetch(`/api/strategies/${strategyId}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete strategy");
    }
    
    return response.json();
  },

  // Run a backtest
  async runBacktest(strategyId: string, backtestId?: string): Promise<BacktestResponse> {
    const response = await fetch(`/api/strategies/${strategyId}/backtest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backtestId ? { backtest_id: backtestId } : {}),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to start backtest");
    }
    
    return response.json();
  },

  // Get backtest status
  async getBacktestStatus(backtestId: string): Promise<BacktestResult> {
    const response = await fetch(`/api/backtest/${backtestId}/status`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch backtest status");
    }
    
    return response.json();
  },

  // Get full backtest results including trades
  async getBacktestResults(backtestId: string): Promise<BacktestResult & { trades: Trade[] }> {
    const response = await fetch(`/api/backtest/${backtestId}/results`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch backtest results");
    }
    
    return response.json();
  },

  // Poll backtest status until complete
  async pollBacktestStatus(
    backtestId: string,
    onStatusChange: (status: BacktestResult) => void,
    interval: number = 2000,
    maxAttempts: number = 300 // 10 minutes at 2 second intervals
  ): Promise<BacktestResult> {
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          attempts++;
          const status = await this.getBacktestStatus(backtestId);
          
          onStatusChange(status);
          
          if (status.status === "completed" || status.status === "failed") {
            resolve(status);
            return;
          }
          
          if (attempts >= maxAttempts) {
            reject(new Error("Backtest polling timed out"));
            return;
          }
          
          setTimeout(poll, interval);
        } catch (error) {
          reject(error);
        }
      };
      
      poll();
    });
  },
};

export default strategyService;
