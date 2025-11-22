"use client";

import { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
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
  Cell,
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

interface ProcessedCandle extends CandleData {
  isPositive: boolean;
  candleHeight: number;
  wickHigh: number;
  wickLow: number;
}

interface StockInfo {
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: string;
}

interface StockChartProps {
  ticker: string;
  days?: number;
  showVolumeChart?: boolean;
}

type TimeRange = "7" | "30" | "90" | "180" | "365";

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: "1W", value: "7" },
  { label: "1M", value: "30" },
  { label: "3M", value: "90" },
  { label: "6M", value: "180" },
  { label: "1Y", value: "365" },
];

// Utility functions
const formatVolume = (vol: number): string => {
  if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(2)}K`;
  return vol.toFixed(0);
};

const formatPrice = (price: number): string => {
  if (price >= 1000) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${price.toFixed(2)}`;
};

const formatDate = (dateStr: string, includeYear = false): string => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (includeYear) options.year = "numeric";
  return date.toLocaleDateString(undefined, options);
};

// Custom Candlestick Shape - uses price domain for positioning
const CandleShape = memo(function CandleShape(props: any) {
  const { x, width, payload, priceDomain, chartHeight, chartTop } = props;
  if (!payload || !priceDomain) return null;

  const { open, high, low, close } = payload;
  const isPositive = close >= open;
  const color = isPositive ? "#10b981" : "#ef4444";

  const [minPrice, maxPrice] = priceDomain;
  const priceRange = maxPrice - minPrice;

  // Convert price to Y coordinate (Y increases downward)
  const priceToY = (price: number) => {
    const ratio = (maxPrice - price) / priceRange;
    return chartTop + ratio * chartHeight;
  };

  const openY = priceToY(open);
  const closeY = priceToY(close);
  const highY = priceToY(high);
  const lowY = priceToY(low);

  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.max(Math.abs(closeY - openY), 1);
  const bodyWidth = Math.max(width * 0.7, 3);
  const bodyX = x + (width - bodyWidth) / 2;
  const wickX = x + width / 2;

  return (
    <g>
      {/* Wick */}
      <line
        x1={wickX}
        y1={highY}
        x2={wickX}
        y2={lowY}
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Body */}
      <rect
        x={bodyX}
        y={bodyTop}
        width={bodyWidth}
        height={bodyHeight}
        fill={color}
        stroke={color}
        strokeWidth={1}
        rx={1}
      />
    </g>
  );
});

// Custom Tooltip
const CustomTooltip = memo(function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  
  const data = payload[0].payload as CandleData;
  const isPositive = data.close >= data.open;
  
  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
      <p className="text-xs text-muted-foreground mb-2">{formatDate(data.date, true)}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <span className="text-muted-foreground">Open:</span>
        <span className="font-medium text-right">{formatPrice(data.open)}</span>
        <span className="text-muted-foreground">High:</span>
        <span className="font-medium text-right">{formatPrice(data.high)}</span>
        <span className="text-muted-foreground">Low:</span>
        <span className="font-medium text-right">{formatPrice(data.low)}</span>
        <span className="text-muted-foreground">Close:</span>
        <span className={`font-medium text-right ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {formatPrice(data.close)}
        </span>
        <span className="text-muted-foreground">Volume:</span>
        <span className="font-medium text-right">{formatVolume(data.volume)}</span>
      </div>
    </div>
  );
});

export const StockChart = memo(function StockChart({ 
  ticker, 
  days: initialDays = 30,
  showVolumeChart = true 
}: StockChartProps) {
  const { getToken } = useAuth();
  const [data, setData] = useState<CandleData[]>([]);
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<TimeRange>(String(initialDays) as TimeRange);
  
  const fetchedRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const days = parseInt(selectedRange, 10);

  useEffect(() => {
    const fetchKey = `${ticker}-${days}`;
    if (fetchedRef.current === fetchKey) return;

    // Cancel any in-flight request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        if (!token || controller.signal.aborted) return;

        const response = await fetch(
          `${API_URL}/data/tickerdata?action=trading&ticker=${ticker}&days=${days}&interval=1d`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch data`);
        }

        const result = await response.json();
        if (controller.signal.aborted) return;

        const candleData: CandleData[] = result.data || [];
        setData(candleData);
        fetchedRef.current = fetchKey;

        if (candleData.length >= 2) {
          const latest = candleData[candleData.length - 1];
          const first = candleData[0];
          const change = latest.close - first.close;
          const changePercent = (change / first.close) * 100;

          setStockInfo({
            currentPrice: latest.close,
            change,
            changePercent,
            volume: formatVolume(latest.volume),
          });
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error fetching stock data:", err);
          setError(err.message || "Failed to load data");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [ticker, days, getToken]);

  // Calculate price domain with padding
  const priceDomain = useMemo(() => {
    if (data.length === 0) return [0, 100];
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    const max = Math.max(...highs);
    const min = Math.min(...lows);
    const padding = (max - min) * 0.1;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [data]);

  // Calculate volume domain
  const volumeDomain = useMemo(() => {
    if (data.length === 0) return [0, 1];
    const maxVol = Math.max(...data.map(d => d.volume));
    return [0, maxVol * 1.1];
  }, [data]);

  const handleRangeChange = useCallback((range: TimeRange) => {
    if (range !== selectedRange) {
      fetchedRef.current = ""; // Clear cache to force refetch
      setSelectedRange(range);
    }
  }, [selectedRange]);

  const isPositive = stockInfo ? stockInfo.change >= 0 : true;
  const latestCandle = data.length > 0 ? data[data.length - 1] : null;

  if (loading && data.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 flex items-center justify-center mx-8 min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 mx-8">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load chart data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden mx-8">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {ticker.toUpperCase()}
            </h3>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-foreground">
                {latestCandle ? formatPrice(latestCandle.close) : "--"}
              </span>
              {stockInfo && (
                <div className={`flex items-center gap-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {isPositive ? "+" : ""}{formatPrice(stockInfo.change)} ({stockInfo.changePercent >= 0 ? "+" : ""}{stockInfo.changePercent.toFixed(2)}%)
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedRange === "7" ? "Past week" : 
               selectedRange === "30" ? "Past month" :
               selectedRange === "90" ? "Past 3 months" :
               selectedRange === "180" ? "Past 6 months" : "Past year"}
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {TIME_RANGES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleRangeChange(value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedRange === value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Candlestick Chart */}
      <div className="p-6 pb-2">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => formatDate(d)}
              stroke="#71717a"
              fontSize={11}
              tickMargin={8}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              domain={priceDomain}
              tickFormatter={(v) => `$${v.toFixed(0)}`}
              stroke="#71717a"
              fontSize={11}
              width={55}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#525252", strokeDasharray: "4 4" }} />
            {latestCandle && (
              <ReferenceLine y={latestCandle.close} stroke="#525252" strokeDasharray="2 2" />
            )}
            <Bar 
              dataKey="high" 
              shape={(props: any) => (
                <CandleShape 
                  {...props} 
                  priceDomain={priceDomain} 
                  chartHeight={250} 
                  chartTop={10} 
                />
              )} 
              isAnimationActive={false} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      {showVolumeChart && (
        <div className="px-6 pb-4">
          <p className="text-xs text-muted-foreground mb-2">Volume</p>
          <ResponsiveContainer width="100%" height={60}>
            <ComposedChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" hide />
              <YAxis domain={volumeDomain} hide />
              <Bar dataKey="volume" isAnimationActive={false} radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.close >= entry.open ? "#10b98140" : "#ef444440"}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats Footer */}
      <div className="px-6 pb-6 pt-2 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {latestCandle && (
            <>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Open</p>
                <p className="text-sm font-medium text-foreground">{formatPrice(latestCandle.open)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">High</p>
                <p className="text-sm font-medium text-green-500">{formatPrice(latestCandle.high)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Low</p>
                <p className="text-sm font-medium text-red-500">{formatPrice(latestCandle.low)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Close</p>
                <p className="text-sm font-medium text-foreground">{formatPrice(latestCandle.close)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Volume</p>
                <p className="text-sm font-medium text-foreground">{formatVolume(latestCandle.volume)}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});