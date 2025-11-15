"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const API_URL = "https://api.zecant.com";

interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockInfo {
  currentPrice: number;
  change: number;
  changePercent: number;
  marketCap?: string;
  eps?: number;
  peRatio?: number;
  revenue?: string;
  volume?: string;
}

interface StockChartProps {
  ticker: string;
  days?: number;
}

export function StockChart({ ticker, days = 30 }: StockChartProps) {
  const { getToken } = useAuth();
  const [data, setData] = useState<CandleData[]>([]);
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredData, setHoveredData] = useState<CandleData | null>(null);
  const hoverRef = useRef<CandleData | null>(null);

  useEffect(() => {
    fetchStockData();
  }, [ticker, days]);

  const fetchStockData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      // Fetch trading data
      const response = await fetch(
        `${API_URL}/data/tickerdata?action=trading&ticker=${ticker}&days=${days}&interval=1d`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setData(result.data);

      // Calculate stock info from latest data
      if (result.data && result.data.length > 0) {
        const latest = result.data[result.data.length - 1];
        const previous = result.data[result.data.length - 2];
        
        const change = latest.close - previous.close;
        const changePercent = (change / previous.close) * 100;

        setStockInfo({
          currentPrice: latest.close,
          change,
          changePercent,
          volume: formatVolume(latest.volume),
        });
      }
    } catch (err: any) {
      console.error("Error fetching stock data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const formatVolume = (vol: number): string => {
    if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(2)}K`;
    return vol.toString();
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  // Custom candlestick shape
  const CandleShape = (props: any) => {
    const { x, y, width, payload } = props;
    const isPositive = payload.close >= payload.open;
    const color = isPositive ? "#10b981" : "#ef4444"; // green-500 : red-500
    
    const bodyHeight = Math.abs(payload.close - payload.open);
    const bodyY = Math.min(payload.close, payload.open);
    
    const wickTop = payload.high;
    const wickBottom = payload.low;
    
    // Scale factor (approximation, adjust based on your data range)
    const priceRange = Math.max(...data.map(d => d.high)) - Math.min(...data.map(d => d.low));
    const chartHeight = 250; // Approximate chart height
    const scale = chartHeight / priceRange;
    
    const wickX = x + width / 2;
    const bodyWidth = Math.max(width * 0.6, 2);
    const bodyX = x + (width - bodyWidth) / 2;

    return (
      <g>
        {/* Wick */}
        <line
          x1={wickX}
          y1={y - (wickTop - bodyY) * scale}
          x2={wickX}
          y2={y + (bodyY - wickBottom + bodyHeight) * scale}
          stroke={color}
          strokeWidth={1}
        />
        {/* Body */}
        <rect
          x={bodyX}
          y={y}
          width={bodyWidth}
          height={Math.max(bodyHeight * scale, 1)}
          fill={color}
          stroke={color}
          strokeWidth={1}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      hoverRef.current = payload[0].payload;
      return null; // We show data in header instead
    }
    return null;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (hoverRef.current !== hoveredData) {
        setHoveredData(hoverRef.current);
      }
    }, 16); // 60fps check
  
    return () => clearInterval(interval);
  }, [hoveredData]);

  const displayPrice = hoveredData || (data.length > 0 ? data[data.length - 1] : null);
  const isPositive = stockInfo ? stockInfo.change >= 0 : true;

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {ticker.toUpperCase()}
            </h3>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-foreground">
                {displayPrice ? formatPrice(displayPrice.close) : "--"}
              </span>
              {stockInfo && (
                <div className={`flex items-center gap-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {formatPrice(Math.abs(stockInfo.change))} ({stockInfo.changePercent.toFixed(2)}%)
                  </span>
                </div>
              )}
            </div>
          </div>
          {hoveredData && (
            <div className="text-right text-sm text-muted-foreground">
              {formatDate(hoveredData.date)}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onMouseLeave={() => setHoveredData(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#71717a"
              style={{ fontSize: "12px" }}
              tickMargin={10}
            />
            <YAxis
              domain={["dataMin - 5", "dataMax + 5"]}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              stroke="#71717a"
              style={{ fontSize: "12px" }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#71717a", strokeWidth: 1 }} />
            <Bar
              dataKey="close"
              shape={<CandleShape />}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Footer */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayPrice && (
            <>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Open</p>
                <p className="text-sm font-medium text-foreground">
                  {formatPrice(displayPrice.open)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">High</p>
                <p className="text-sm font-medium text-foreground">
                  {formatPrice(displayPrice.high)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Low</p>
                <p className="text-sm font-medium text-foreground">
                  {formatPrice(displayPrice.low)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Volume</p>
                <p className="text-sm font-medium text-foreground">
                  {stockInfo?.volume || formatVolume(displayPrice.volume)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}