"use client";

import { memo, useMemo } from "react";
import { TrendingUp, TrendingDown, X, Plus} from "lucide-react";
import { Button } from "@/components/ui/button"

// Proper SnapTrade types based on API documentation
interface UniversalSymbol {
  id: string;
  symbol: string;
  raw_symbol: string;
  description: string | null;
  currency: Currency;
  exchange: Exchange;
  type: SecurityType;
  figi_code: string | null;
  figi_instrument: FigiInstrument | null;
}

interface Currency {
  id: string;
  code: string;
  name: string;
}

interface Exchange {
  id: string;
  code: string;
  mic_code: string;
  name: string;
  timezone: string;
  start_time: string;
  close_time: string;
  suffix: string | null;
}

interface SecurityType {
  id: string;
  code: string;
  description: string;
  is_supported: boolean;
}

interface FigiInstrument {
  figi_code: string | null;
  figi_share_class: string | null;
}

interface PositionSymbol {
  symbol: UniversalSymbol;
  id: string;
  description: string;
  local_id: string | null;
  is_quotable: boolean;
  is_tradable: boolean;
}

interface Position {
  symbol: PositionSymbol;
  units: number | null;
  price: number | null;
  open_pnl: number | null;
  average_purchase_price: number | null;
  fractional_units: number | null;
  currency: Currency;
  cash_equivalent: boolean | null;
}

interface UniversalActivity {
  id: string;
  symbol: UniversalSymbol | null;
  option_symbol: any | null;
  price: number;
  units: number;
  amount: number | null;
  currency: Currency;
  type: string;
  option_type?: string;
  description: string;
  trade_date: string | null;
  settlement_date: string;
  fee: number;
  fx_rate: number | null;
  institution: string;
  external_reference_id: string | null;
}

interface Account {
  id: string;
  authorizationId: string;
  name: string;
  accountNumber: string;
  brokerage: string;
  type: string;
}

interface PortfolioDisplayProps {
  accounts: Account[];
  totalNav: number;
  positions: Position[];
  trades: UniversalActivity[];
  onRemoveBroker?: (authorizationId: string) => void; // ADD THIS
  connectedBrokers?: string[];
  onAddBroker?: () => void; // ADD THIS
  connecting?: boolean; // ADD THIS
}

const formatCurrency = (value: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
};

const PositionCard = memo(function PositionCard({ position }: { position: Position }) {
  const symbol = position.symbol.symbol.symbol;
  const description = position.symbol.symbol.description || symbol;
  const quantity = Math.abs(Number(position.units || position.fractional_units) || 0);
  const currentPrice = Number(position.price) || 0;
  const avgPrice = Number(position.average_purchase_price) || currentPrice;
  const marketValue = currentPrice * quantity;
  const costBasis = avgPrice * quantity;
  const totalGainLoss = marketValue - costBasis;
  const gainLossPercent = costBasis > 0 ? (totalGainLoss / costBasis) * 100 : 0;
  const isPositive = totalGainLoss >= 0;
  const currency = position.currency.code;

  return (
    <div className="rounded-sm border border-border-divider bg-card/70 backdrop-blur-glass p-4 hover:bg-muted transition-colors">
      <div className="flex items-start justify-between gap-2 mb-3 min-w-0">
        {/* Left */}
        <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-foreground">
            {symbol}
            </h4>
            <p className="text-xs text-muted-foreground truncate max-w-full">
            {description}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
            {formatNumber(quantity)} shares
            </p>
        </div>

        {/* Right */}
        <div
            className={`flex items-center gap-1 shrink-0 whitespace-nowrap ${
            isPositive ? "text-green-500" : "text-red-500"
            }`}
        >
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium truncate">
            {isPositive ? "+" : ""}
            {gainLossPercent.toFixed(2)}%
            </span>
        </div>
        </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs mb-0.5">Market Value</p>
          <p className="font-semibold text-foreground">{formatCurrency(marketValue, currency)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs mb-0.5">Current Price</p>
          <p className="font-medium text-foreground">{formatCurrency(currentPrice, currency)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs mb-0.5">Cost Basis</p>
          <p className="font-medium text-foreground">{formatCurrency(costBasis, currency)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs mb-0.5">Avg Price</p>
          <p className="font-medium text-foreground">{formatCurrency(avgPrice, currency)}</p>
        </div>
        <div className="col-span-2">
          <p className="text-muted-foreground text-xs mb-0.5">Total Gain/Loss</p>
          <p className={`font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "+" : ""}{formatCurrency(totalGainLoss, currency)}
          </p>
        </div>
      </div>
    </div>
  );
});

const TradeRow = memo(function TradeRow({ trade }: { trade: UniversalActivity }) {
  const isBuy = trade.type?.toLowerCase().includes("buy");
  const date = formatDate(trade.trade_date || trade.settlement_date);
  const symbol = trade.symbol?.symbol || "N/A";
  const currency = trade.currency.code;
  
  return (
    <div className="grid grid-cols-6 gap-4 py-3 px-4 hover:bg-muted/30 transition-colors text-sm border-b border-border-divider last:border-b-0">
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">Date</p>
        <p className="font-medium text-foreground">{date}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">Type</p>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          isBuy ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        }`}>
          {trade.type}
        </span>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">Symbol</p>
        <p className="font-semibold text-foreground">{symbol}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">Quantity</p>
        <p className="font-medium text-foreground">{formatNumber(trade.units)}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">Price</p>
        <p className="font-medium text-foreground">{formatCurrency(trade.price, currency)}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">Total</p>
        <p className="font-semibold text-foreground">
          {trade.amount !== null ? formatCurrency(Math.abs(trade.amount), currency) : "N/A"}
        </p>
      </div>
    </div>
  );
});

export const PortfolioDisplay = memo(function PortfolioDisplay({
  accounts,
  totalNav,
  positions,
  trades,
  onRemoveBroker, // ADD THIS
  connectedBrokers = [],
  onAddBroker, // ADD THIS
  connecting = false, // ADD THIS
}: PortfolioDisplayProps) {
  const positionsByValue = useMemo(() => {
    return [...positions]
      .map(p => ({
        ...p,
        marketValue: Number(p.price) * Math.abs(Number(p.units || p.fractional_units) || 0)
      }))
      .sort((a, b) => b.marketValue - a.marketValue);
  }, [positions]);

  const recentTrades = useMemo(() => {
    return trades.slice(0, 10);
  }, [trades]);

  const totalGainLoss = useMemo(() => {
    return positions.reduce((total, position) => {
      const quantity = Math.abs(Number(position.units || position.fractional_units) || 0);
      const currentPrice = Number(position.price) || 0;
      const avgPrice = Number(position.average_purchase_price) || currentPrice;
      const marketValue = currentPrice * quantity;
      const costBasis = avgPrice * quantity;
      return total + (marketValue - costBasis);
    }, 0);
  }, [positions]);

  const gainLossPercent = useMemo(() => {
    const totalCostBasis = positions.reduce((total, position) => {
      const quantity = Math.abs(Number(position.units || position.fractional_units) || 0);
      const avgPrice = Number(position.average_purchase_price) || Number(position.price) || 0;
      return total + (avgPrice * quantity);
    }, 0);
    return totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;
  }, [positions, totalGainLoss]);

  const isPositive = totalGainLoss >= 0;

  return (
    <>
      {/* Portfolio Summary */}
      <div className="flex flex-row p-6 items-middle rounded-sm border border-border-divider bg-card/70 backdrop-blur-glass">
        <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">Total Portfolio Value</h2>
            <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-foreground">
                {formatCurrency(totalNav)}
                </span>
                <div className={`flex items-center gap-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <span className="text-lg font-medium">
                    {isPositive ? "+" : ""}{formatCurrency(totalGainLoss)} ({isPositive ? "+" : ""}{gainLossPercent.toFixed(2)}%)
                </span>
                </div>
            </div>
        </div>
      </div>

      {/* Connected Accounts - UPDATED */}
      {accounts.length > 0 && (
        <div className="rounded-sm border border-border-divider bg-card/70 backdrop-blur-glass p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Connected Accounts</h3>
          <div className="space-y-3">
            {accounts.map((account) => {
              const authorizationId = account.authorizationId;
              const canRemove = onRemoveBroker && authorizationId && connectedBrokers.includes(authorizationId);

              console.log('Account:', account);
              console.log('Authorization ID:', authorizationId);
              console.log('Connected Brokers:', connectedBrokers);
              console.log('Can Remove:', canRemove);
              
              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 rounded-sm bg-muted/30 border border-border-divider"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {account.name || account.accountNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">{account.brokerage}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {account.type}
                    </p>
                  </div>
                  
                  {canRemove && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-sm ml-2"
                    onClick={() => onRemoveBroker(authorizationId)}
                    title="Remove broker connection"
                    >
                    <X className="w-5 h-5" />
                  </Button>
                  )}
                </div>
              );
            })}
            
            {/* Add Broker Button - ADDED HERE */}
            {onAddBroker && (
              <Button
                variant="outline"
                onClick={onAddBroker}
                disabled={connecting}
                className="w-full gap-2 mt-2"
              >
                <Plus className="h-4 w-4" />
                {connecting ? "Connecting..." : "Add Broker"}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Current Positions */}
      {positionsByValue.length > 0 && (
        <div className="rounded-sm border border-border-divider bg-card/70 backdrop-blur-glass overflow-hidden">
          <div className="p-6 border-b border-border-divider">
            <h3 className="text-lg font-semibold text-foreground">Current Holdings</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {positionsByValue.length} position{positionsByValue.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {positionsByValue.map((position, idx) => (
              <PositionCard key={`${position.symbol.symbol.symbol}-${idx}`} position={position} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Trades */}
      {recentTrades.length > 0 && (
        <div className="rounded-sm border border-border-divider bg-card/70 backdrop-blur-glass overflow-hidden">
          <div className="p-6 border-b border-border-divider">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Showing {recentTrades.length} of {trades.length} trade{trades.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div>
            {recentTrades.map((trade, idx) => (
              <TradeRow key={`${trade.id}-${idx}`} trade={trade} />
            ))}
          </div>
        </div>
      )}
    </>
  );
});