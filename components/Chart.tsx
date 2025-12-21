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

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

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
    if (series && series.length > 0) {
      return series;
    }
    if (yAxis?.key) {
      // Determine default type based on chart type
      const defaultType: SeriesConfig['type'] = 
        type === 'line' ? 'line' : 
        type === 'bar' ? 'bar' : 
        type === 'area' ? 'area' : 
        'line'; // fallback for combo/scatter/pie
      
      if (Array.isArray(yAxis.key)) {
        return yAxis.key.map((key, i) => ({
          key,
          name: key,
          color: colors[i % colors.length],
          type: defaultType,
        }));
      }
      return [{
        key: yAxis.key,
        name: yAxis.key,
        color: colors[0],
        type: defaultType,
      }];
    }
    return [];
  }, [series, yAxis, colors, type]);

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
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color || colors[i % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
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
                fill={s.color || colors[i % colors.length]}
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
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color || colors[i % colors.length]}
                fill={s.color || colors[i % colors.length]}
                fillOpacity={0.6}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case 'scatter':
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
              fill={colors[0]}
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
              {pieDataWithTotal.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
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
                    type="monotone"
                    dataKey={s.key}
                    name={s.name}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                );
              }
              return (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.name}
                  fill={color}
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