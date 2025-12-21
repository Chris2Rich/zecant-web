import React, { memo, useMemo } from 'react';
import {
  ComposedChart,
  LineChart,
  BarChart,
  AreaChart,
  ScatterChart,
  PieChart,
  Line,
  Bar,
  Area,
  Scatter,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SeriesConfig {
  key: string;
  name: string;
  color?: string;
  type?: 'line' | 'bar' | 'area';
  ramp?: ColorRamp;
}

interface AxisConfig {
  key: string;
  label?: string;
}

interface ChartConfig {
  type: 'line' | 'bar' | 'area' | 'scatter' | 'pie' | 'combo';
  title?: string;
  data: any[];
  xAxis: AxisConfig;
  yAxis?: AxisConfig;
  series?: SeriesConfig[];
  colors?: string[];
  height?: number;
}

interface GenericChartProps {
  config: ChartConfig;
}

const DEFAULT_COLORS: string[] = [];

type ColorRamp = string[];

const COLOR_RAMPS: Record<string, ColorRamp> = {
  red: [
    '#d47d76', // red-300
    '#fa958d', // red-500
    '#fbaaa3', // red-700
  ],
  orange: [
    '#cd8358', // orange-300
    '#f29c6a', // orange-500
    '#f5b089', // orange-700
  ],
  yellow: [
    '#a4963e', // yellow-300
    '#c2b24d', // yellow-500
    '#cdc176', // yellow-700
  ],
  green: [
    '#5ca46d', // green-300
    '#70c383', // green-500
    '#8ece9b', // green-700
  ],
  turquoise: [
    '#0ca4aa', // turquoise-300
    '#1ec3ca', // turquoise-500
    '#66cfd4', // turquoise-700
  ],
  blue: [
    '#6d96d8', // blue-300
    '#83b2fe', // blue-500
    '#9bc1fe', // blue-700
  ],
  purple: [
    '#a288d1', // purple-300
    '#c1a2f7', // purple-500
    '#cbb4f7', // purple-700
  ],
};

const RAMP_KEYS = Object.keys(COLOR_RAMPS);

function getRampForSeries(seriesIndex: number): ColorRamp {
  return COLOR_RAMPS[RAMP_KEYS[seriesIndex % RAMP_KEYS.length]];
}


function getRampForKey(key: string): ColorRamp {
const hash = [...key].reduce((a, c) => a + c.charCodeAt(0), 0);
const rampKey = RAMP_KEYS[hash % RAMP_KEYS.length];
return COLOR_RAMPS[rampKey];
}


const CustomTooltip = memo(function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-popover border border-border-divider rounded-sm p-3 shadow-lg">
      <p className="text-xs text-muted-foreground mb-2 font-medium">{label}</p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
            </div>
            <span className="font-medium text-foreground">
              {typeof entry.value === 'number' 
                ? entry.value.toLocaleString(undefined, { 
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2 
                  })
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

const PieTooltip = memo(function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  
  const data = payload[0];
  const total = payload[0].payload.total || 100;
  const percentage = ((data.value / total) * 100).toFixed(1);

  return (
    <div className="bg-popover border border-border-divider rounded-sm p-3 shadow-lg">
      <div className="flex items-center gap-2 mb-1">
        <div 
          className="w-3 h-3 rounded-sm" 
          style={{ backgroundColor: data.payload.fill }}
        />
        <p className="text-sm font-medium text-foreground">{data.name}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        {data.value.toLocaleString(undefined, { 
          minimumFractionDigits: 0,
          maximumFractionDigits: 2 
        })} ({percentage}%)
      </p>
    </div>
  );
});

export const GenericChart = memo(function GenericChart({ config }: GenericChartProps) {
  const {
    type,
    title,
    data,
    xAxis,
    yAxis,
    series,
    colors = DEFAULT_COLORS,
    height = 300,
  } = config;

  // Validate required fields
  if (!data || data.length === 0) {
    return (
      <div className="rounded-sm border border-border-divider bg-card/70 backdrop-blur-glass p-6 mx-8">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">No data available</p>
        </div>
      </div>
    );
  }

  // Calculate total for pie chart percentages
  const pieDataWithTotal = useMemo(() => {
    if (type !== 'pie' || !yAxis) return data;
    const total = data.reduce((sum, item) => sum + (item[yAxis.key] || 0), 0);
    return data.map(item => ({ ...item, total }));
  }, [data, type, yAxis]);

  // Determine which keys to plot
  const plotKeys = useMemo((): SeriesConfig[] => {
    const resolveType = (): SeriesConfig['type'] =>
      type === 'line'
        ? 'line'
        : type === 'bar'
        ? 'bar'
        : type === 'area'
        ? 'area'
        : 'line';
  
    if (series && series.length > 0) {
      return series.map((s, i) => {
        const ramp = getRampForKey(s.key);

        return {
          ...s,
          type: s.type ?? resolveType(),
          ramp,
          color: s.color ?? ramp[1], // 500 shade
        };
      });
    }
  
    if (yAxis?.key) {
      const keys = Array.isArray(yAxis.key) ? yAxis.key : [yAxis.key];
  
      return keys.map((key, i) => {
        const ramp = getRampForSeries(i);
  
        return {
          key,
          name: key,
          type: resolveType(),
          ramp,
          color: ramp[1], // 500 shade
        };
      });
    }
  
    return [];
  }, [series, yAxis, type]);
  

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey={xAxis.key}
              stroke="#71717a"
              fontSize={11}
              tickMargin={8}
              label={xAxis.label ? { value: xAxis.label, position: 'insideBottom', offset: -5, style: { fill: '#71717a', fontSize: 11 } } : undefined}
            />
            <YAxis 
              stroke="#71717a"
              fontSize={11}
              width={60}
              label={yAxis?.label ? { value: yAxis.label, angle: -90, position: 'insideLeft', style: { fill: '#71717a', fontSize: 11 } } : undefined}
            />
            <Tooltip content={<CustomTooltip />} />
            {plotKeys.length > 1 && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />}
            {plotKeys.map((s, i) => (
              <Line
                key={s.key}
                type="linear"
                dataKey={s.key}
                name={s.name}
                stroke={s.ramp?.[2] ?? s.color}   // 700
                strokeWidth={2}
                dot={{ r: 3, fill: s.ramp?.[1] }} // 500
                activeDot={{ r: 5, fill: s.ramp?.[0] }} // 300
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey={xAxis.key}
              stroke="#71717a"
              fontSize={11}
              tickMargin={8}
              label={xAxis.label ? { value: xAxis.label, position: 'insideBottom', offset: -5, style: { fill: '#71717a', fontSize: 11 } } : undefined}
            />
            <YAxis 
              stroke="#71717a"
              fontSize={11}
              width={60}
              label={yAxis?.label ? { value: yAxis.label, angle: -90, position: 'insideLeft', style: { fill: '#71717a', fontSize: 11 } } : undefined}
            />
            <Tooltip content={<CustomTooltip />} />
            {plotKeys.length > 1 && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />}
            {plotKeys.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.name}
                fill={s.ramp?.[1] ?? s.color} // 500
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey={xAxis.key}
              stroke="#71717a"
              fontSize={11}
              tickMargin={8}
              label={xAxis.label ? { value: xAxis.label, position: 'insideBottom', offset: -5, style: { fill: '#71717a', fontSize: 11 } } : undefined}
            />
            <YAxis 
              stroke="#71717a"
              fontSize={11}
              width={60}
              label={yAxis?.label ? { value: yAxis.label, angle: -90, position: 'insideLeft', style: { fill: '#71717a', fontSize: 11 } } : undefined}
            />
            <Tooltip content={<CustomTooltip />} />
            {plotKeys.length > 1 && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />}
            {plotKeys.map((s, i) => (
              <Area
                key={s.key}
                type="linear"
                dataKey={s.key}
                name={s.name}
                stroke={s.ramp?.[2] ?? s.color} // 700
                fill={s.ramp?.[1] ?? s.color}   // 500
                fillOpacity={0.6}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case 'scatter':
        const scatterRamp = getRampForSeries(0);
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis 
              dataKey={xAxis.key}
              stroke="#71717a"
              fontSize={11}
              tickMargin={8}
              type="number"
              label={xAxis.label ? { value: xAxis.label, position: 'insideBottom', offset: -5, style: { fill: '#71717a', fontSize: 11 } } : undefined}
            />
            <YAxis 
              dataKey={yAxis?.key}
              stroke="#71717a"
              fontSize={11}
              width={60}
              type="number"
              label={yAxis?.label ? { value: yAxis.label, angle: -90, position: 'insideLeft', style: { fill: '#71717a', fontSize: 11 } } : undefined}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter
              name={yAxis?.label || yAxis?.key || 'Value'}
              data={data}
              fill={scatterRamp[1]} // 500
            />
          </ScatterChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={pieDataWithTotal}
              dataKey={yAxis?.key || 'value'}
              nameKey={xAxis.key}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: '#71717a' }}
            >
              {pieDataWithTotal.map((entry, index) => {
                const ramp = getRampForSeries(index);
                return <Cell key={`cell-${index}`} fill={ramp[1]} stroke={ramp[2]} />
                })}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        );

      case 'combo':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey={xAxis.key}
              stroke="#71717a"
              fontSize={11}
              tickMargin={8}
              label={xAxis.label ? { value: xAxis.label, position: 'insideBottom', offset: -5, style: { fill: '#71717a', fontSize: 11 } } : undefined}
            />
            <YAxis 
              stroke="#71717a"
              fontSize={11}
              width={60}
              label={yAxis?.label ? { value: yAxis.label, angle: -90, position: 'insideLeft', style: { fill: '#71717a', fontSize: 11 } } : undefined}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            {plotKeys.map((s, i) => {
              const color = s.color || colors[i % colors.length];
              if (s.type === 'line') {
                return (
                  <Line
                    key={s.key}
                    type="linear"
                    dataKey={s.key}
                    name={s.name}
                    stroke={s.ramp?.[2]} // 700
                    strokeWidth={2}
                    dot={{ r: 3, fill: s.ramp?.[1] }}
                  />
                );
              }
              return (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.name}
                  fill={s.ramp?.[1]} // 500
                  radius={[4, 4, 0, 0]}
                />
              );
            })}
          </ComposedChart>
        );

      default:
        return <div className="text-center text-muted-foreground text-sm">Unsupported chart type</div>;
    }
  };

  return (
    <div className="rounded-sm border border-border-divider bg-card/70 backdrop-blur-glass overflow-hidden mx-8 my-6">
      {title && (
        <div className="px-6 py-4 border-b border-border-divider">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>
      )}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
});