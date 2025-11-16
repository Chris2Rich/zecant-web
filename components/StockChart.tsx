"use client";

import { useState, useEffect, useRef, memo } from "react";
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
  volume?: string;
}

interface StockChartProps {
  ticker: string;
  days?: number;
}

// Memoize the candle shape component
const CandleShape = memo((props: any) => {
  const { x, y, width, payload, data } = props;
  const isPositive = payload.close >= payload.open;
  const color = isPositive ? "#10b981" : "#ef4444";

  const bodyHeight = Math.abs(payload.close - payload.open);
  const bodyY = Math.min(payload.close, payload.open);

  const wickTop = payload.high;
  const wickBottom = payload.low;

  const priceRange = Math.max(...data.map((d: CandleData) => d.high)) - Math.min(...data.map((d: CandleData) => d.low));
  const chartHeight = 250;
  const scale = chartHeight / priceRange;

  const wickX = x + width / 2;
  const bodyWidth = Math.max(width * 0.6, 2);
  const bodyX = x + (width - bodyWidth) / 2;

  return (
    <g>
      <line
        x1={wickX}
        y1={y - (wickTop - bodyY) * scale}
        x2={wickX}
        y2={y + (bodyY - wickBottom + bodyHeight) * scale}
        stroke={color}
        strokeWidth={1}
      />
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
});

CandleShape.displayName = "CandleShape";

export const StockChart = memo(function StockChart({ ticker, days = 30 }: StockChartProps) {
  const { getToken } = useAuth();
  const [data, setData] = useState<CandleData[]>([]);
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredData, setHoveredData] = useState<CandleData | null>(null);
  
  // Track what we've already fetched
  const fetchedRef = useRef<string>("");
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchKey = `${ticker}-${days}`;
    
    // Don't refetch if we already have this data or are currently fetching
    if (fetchedRef.current === fetchKey || isFetchingRef.current) {
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        if (!token || cancelled) return;

        const response = await fetch(
          `${API_URL}/data/tickerdata?action=trading&ticker=${ticker}&days=${days}&interval=1d`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok || cancelled) return;

        const result = await response.json();
        if (cancelled) return;

        setData(result.data);
        fetchedRef.current = fetchKey; // Mark as fetched

        if (result.data && result.data.length > 1) {
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
        if (!cancelled) {
          console.error("Error fetching stock data:", err);
          setError(err.message || "Failed to load data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          isFetchingRef.current = false;
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
      isFetchingRef.current = false;
    };
  }, [ticker, days, getToken]);

  const formatVolume = (vol: number) => {
    if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(2)}K`;
    return vol.toString();
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  const displayPrice = hoveredData || (data.length > 0 ? data[data.length - 1] : null);
  const isPositive = stockInfo ? stockInfo.change >= 0 : true;

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 flex items-center justify-center mx-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 mx-8">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden mx-8">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{ticker.toUpperCase()}</h3>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-foreground">
                {displayPrice ? formatPrice(displayPrice.close) : "--"}
              </span>
              {stockInfo && (
                <div className={`flex items-center gap-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {formatPrice(Math.abs(stockInfo.change))} ({stockInfo.changePercent.toFixed(2)}%)
                  </span>
                </div>
              )}
            </div>
          </div>
          {hoveredData && <div className="text-right text-sm text-muted-foreground">{formatDate(hoveredData.date)}</div>}
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onMouseMove={(state) => {
              if (state.activePayload && state.activePayload[0]) setHoveredData(state.activePayload[0].payload);
              else setHoveredData(null);
            }}
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
            <Tooltip content={() => null} cursor={{ stroke: "#71717a", strokeWidth: 1 }} />
            <Bar dataKey="close" shape={<CandleShape data={data} />} isAnimationActive={false} />
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
                <p className="text-sm font-medium text-foreground">{formatPrice(displayPrice.open)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">High</p>
                <p className="text-sm font-medium text-foreground">{formatPrice(displayPrice.high)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Low</p>
                <p className="text-sm font-medium text-foreground">{formatPrice(displayPrice.low)}</p>
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
});