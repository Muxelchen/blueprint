import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Users,
  Target,
  Award,
  Minus,
} from 'lucide-react';

interface KPIData {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  change: number;
  target?: number;
  unit: string;
  format: 'number' | 'currency' | 'percentage';
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
}

const mockKPIs: KPIData[] = [
  {
    id: 'revenue',
    title: 'Monthly Revenue',
    value: 124500,
    previousValue: 118200,
    change: 6300,
    target: 130000,
    unit: '',
    format: 'currency',
    trend: 'up',
    changePercent: 5.3,
    icon: DollarSign,
    color: '#10B981',
    description: 'Total revenue for current month',
  },
  {
    id: 'users',
    title: 'Active Users',
    value: 8945,
    previousValue: 8234,
    change: 711,
    target: 10000,
    unit: '',
    format: 'number',
    trend: 'up',
    changePercent: 8.6,
    icon: Users,
    color: '#3B82F6',
    description: 'Monthly active users',
  },
  {
    id: 'conversion',
    title: 'Conversion Rate',
    value: 3.24,
    previousValue: 2.98,
    change: 0.26,
    unit: '%',
    format: 'percentage',
    trend: 'up',
    changePercent: 8.7,
    icon: Target,
    color: '#F59E0B',
    description: 'Lead to customer conversion',
  },
  {
    id: 'performance',
    title: 'Performance Score',
    value: 94.2,
    previousValue: 91.8,
    change: 2.4,
    target: 95,
    unit: '%',
    format: 'percentage',
    trend: 'up',
    changePercent: 2.6,
    icon: Award,
    color: '#8B5CF6',
    description: 'Overall system performance',
  },
  {
    id: 'engagement',
    title: 'User Engagement',
    value: 76.8,
    previousValue: 78.2,
    change: -1.4,
    unit: '%',
    format: 'percentage',
    trend: 'down',
    changePercent: -1.8,
    icon: Activity,
    color: '#EF4444',
    description: 'Average session engagement',
  },
];

interface KPICardProps {
  data?: KPIData;
  showTrend?: boolean;
  showTarget?: boolean;
  animate?: boolean;
  size?: 'small' | 'medium' | 'large';
  showChart?: boolean;
  showInsights?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  data,
  showTrend = true,
  showTarget = true,
  animate = true,
  size = 'medium',
  showChart = true,
  showInsights = true,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // If no specific KPI data provided, use the first mock KPI
  const kpi = data || mockKPIs[0];

  // Simplified size configuration - moved up before being used
  const sizeConfig = {
    small: {
      height: '160px',
      padding: 'p-3',
      iconSize: 'w-6 h-6',
      iconClass: 'w-3 h-3',
      titleSize: 'text-sm',
      valueSize: 'text-lg',
      showDescription: false,
      showChart: true,
      showTarget: false,
      showInsights: false,
      chartBars: 4,
      chartHeight: 60, // Back to reasonable size
      spacing: 'space-x-1',
    },
    medium: {
      height: '200px',
      padding: 'p-4',
      iconSize: 'w-8 h-8',
      iconClass: 'w-4 h-4',
      titleSize: 'text-base',
      valueSize: 'text-xl',
      showDescription: false,
      showChart: showChart,
      showTarget: showTarget,
      showInsights: false,
      chartBars: 6,
      chartHeight: 70, // Back to reasonable size
      spacing: 'space-x-2',
    },
    large: {
      height: '240px',
      padding: 'p-6',
      iconSize: 'w-10 h-10',
      iconClass: 'w-5 h-5',
      titleSize: 'text-lg',
      valueSize: 'text-2xl',
      showDescription: true,
      showChart: showChart,
      showTarget: showTarget,
      showInsights: showInsights,
      chartBars: 8,
      chartHeight: 80, // Back to reasonable size
      spacing: 'space-x-3',
    },
  };

  const config = sizeConfig[size];
  const Icon = kpi.icon;

  // Generate STABLE trend data (no random) for the mini chart
  const trendData = useMemo(() => {
    const days = config.chartBars;
    const data: number[] = []; // Explicitly type the array
    const currentValue = kpi.value;
    const previousValue = kpi.previousValue;

    // Create a smooth progression without random values
    for (let i = 0; i < days; i++) {
      const progress = i / (days - 1);
      // Use sine wave for natural variation instead of random
      const waveVariation = Math.sin(i * 0.8) * (currentValue * 0.05);
      const baseValue = previousValue + (currentValue - previousValue) * progress;
      const value = Math.max(0, baseValue + waveVariation);
      data.push(value);
    }
    return data;
  }, [kpi.value, kpi.previousValue, config.chartBars]);

  // Move formatValue function BEFORE it's used in useMemo
  const formatValue = useCallback((value: number, format: string, unit: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}${unit}`;
      case 'number':
      default:
        return value >= 1000
          ? `${(value / 1000).toFixed(1)}k${unit}`
          : `${value.toLocaleString()}${unit}`;
    }
  }, []);

  // Memoize expensive calculations - NOW formatValue is available
  const targetProgress = useMemo(() => {
    if (!kpi.target) return 0;
    return Math.min((kpi.value / kpi.target) * 100, 100);
  }, [kpi.value, kpi.target]);

  const formattedValue = useMemo(() => {
    return formatValue(animatedValue, kpi.format, kpi.unit);
  }, [formatValue, animatedValue, kpi.format, kpi.unit]);

  const formattedPreviousValue = useMemo(() => {
    return formatValue(kpi.previousValue, kpi.format, kpi.unit);
  }, [formatValue, kpi.previousValue, kpi.format, kpi.unit]);

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    if (animate) {
      // Animate the main value
      const valueTimer = setTimeout(() => {
        setAnimatedValue(kpi.value);
      }, 200);

      // Animate the progress bar
      const progressTimer = setTimeout(() => {
        setAnimatedProgress(targetProgress);
      }, 400);

      return () => {
        clearTimeout(valueTimer);
        clearTimeout(progressTimer);
      };
    } else {
      setAnimatedValue(kpi.value);
      setAnimatedProgress(targetProgress);
    }
  }, [kpi.value, animate, targetProgress]);

  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    switch (kpi.trend) {
      case 'up':
        return 'text-green-600 bg-green-100';
      case 'down':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div
      className={`bg-white border-2 border-gray-100 hover:border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${config.padding} flex flex-col w-full relative overflow-hidden group`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ height: config.height, minHeight: config.height }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 flex-shrink-0">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div
            className={`${config.iconSize} rounded-lg flex items-center justify-center text-white transition-all duration-300 flex-shrink-0 ${isHovered ? 'scale-110' : ''}`}
            style={{ backgroundColor: kpi.color }}
          >
            <Icon className={config.iconClass} />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className={`font-bold text-gray-900 ${config.titleSize} truncate leading-tight tracking-tight`}
            >
              {kpi.title}
            </h3>
            {config.showDescription && kpi.description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-1 font-medium">{kpi.description}</p>
            )}
          </div>
        </div>

        {showTrend && (
          <div
            className={`flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${getTrendColor()} flex-shrink-0 ml-2`}
          >
            {getTrendIcon()}
            <span className="ml-1">
              {kpi.changePercent > 0 ? '+' : ''}
              {kpi.changePercent.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="mb-4 flex-grow flex flex-col justify-center">
        <div
          className={`font-black text-gray-900 transition-all duration-500 ${config.valueSize} leading-none tracking-tight group-hover:scale-105`}
          style={{
            color: isHovered ? kpi.color : '#111827',
          }}
        >
          {formattedValue}
        </div>

        {showTrend && size !== 'small' && (
          <div className="flex items-center space-x-2 mt-3 opacity-80 group-hover:opacity-100 transition-all duration-200">
            <span className="text-xs text-gray-500 font-medium">vs last:</span>
            <span className="text-xs font-bold text-gray-700">{formattedPreviousValue}</span>
          </div>
        )}
      </div>

      {/* Target Progress */}
      {config.showTarget && kpi.target && (
        <div className="mb-3 flex-shrink-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-text-secondary">Target</span>
            <span className="text-xs font-medium" style={{ color: kpi.color }}>
              {targetProgress.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-surface-secondary rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${animatedProgress}%`,
                backgroundColor: kpi.color,
                boxShadow: `0 0 10px ${kpi.color}33`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Mini Trend Chart */}
      {config.showChart && (
        <div className="mt-auto flex-shrink-0 bg-surface-secondary rounded-lg p-2">
          <div
            className="flex items-end justify-between gap-1"
            style={{ height: `${config.chartHeight}px` }}
          >
            {trendData.map((value, i) => {
              const maxValue = Math.max(...trendData);
              const minValue = Math.min(...trendData);

              // Simple, reliable height calculation
              const normalizedValue =
                maxValue > minValue ? (value - minValue) / (maxValue - minValue) : 0.5;

              const barHeight = Math.max(8, normalizedValue * (config.chartHeight - 8) + 8);
              const isLast = i === trendData.length - 1;
              const isIncreasing = i > 0 && value > trendData[i - 1];

              return (
                <div
                  key={i}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer rounded-t"
                  style={{
                    height: `${barHeight}px`,
                    width: `${Math.floor(100 / config.chartBars) - 2}%`,
                    backgroundColor: isLast
                      ? kpi.color
                      : isIncreasing
                        ? `${kpi.color}CC`
                        : `${kpi.color}88`,
                    transform: isHovered && isLast ? 'scaleY(1.15)' : 'scaleY(1)',
                    transformOrigin: 'bottom',
                    boxShadow: isLast ? `0 2px 8px ${kpi.color}44` : 'none',
                  }}
                ></div>
              );
            })}
          </div>
          <div className="text-xs text-text-secondary text-center mt-1">{config.chartBars}d trend</div>
        </div>
      )}

      {/* Performance Insights - Fixed positioning */}
      {isHovered && config.showInsights && (
        <div className="absolute inset-x-3 bottom-3 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-fade-in">
          <div className="text-xs text-gray-700 font-medium mb-2">Quick Stats</div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center">
              <div className="font-medium text-gray-900">
                {kpi.change > 0 ? '+' : ''}
                {kpi.change.toFixed(kpi.format === 'percentage' ? 1 : 0)}
              </div>
              <div className="text-gray-600">Change</div>
            </div>
            {kpi.target && (
              <div className="text-center">
                <div className="font-medium text-gray-900">
                  {(kpi.target - kpi.value).toFixed(kpi.format === 'percentage' ? 1 : 0)}
                </div>
                <div className="text-gray-600">To Target</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Grid component for multiple KPIs
export const KPIGrid: React.FC<{
  kpis?: KPIData[];
  columns?: number;
  showTrend?: boolean;
  showTarget?: boolean;
  animate?: boolean;
  size?: 'small' | 'medium' | 'large';
}> = ({
  kpis = mockKPIs,
  columns = 3,
  showTrend = true,
  showTarget = true,
  animate = true,
  size = 'medium',
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Key Performance Indicators</h2>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      <div
        className={`grid gap-6 grid-cols-1 ${
          columns === 2
            ? 'md:grid-cols-2'
            : columns === 3
              ? 'md:grid-cols-2 lg:grid-cols-3'
              : columns === 4
                ? 'md:grid-cols-2 lg:grid-cols-4'
                : 'md:grid-cols-3'
        }`}
      >
        {kpis.map((kpi, index) => (
          <div
            key={kpi.id}
            className="transform transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <KPICard
              data={kpi}
              showTrend={showTrend}
              showTarget={showTarget}
              animate={animate}
              size={size}
            />
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="font-bold text-lg text-green-600">
              {kpis.filter(k => k.trend === 'up').length}
            </p>
            <p className="text-gray-600">Improving</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-red-600">
              {kpis.filter(k => k.trend === 'down').length}
            </p>
            <p className="text-gray-600">Declining</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-blue-600">
              {kpis.filter(k => k.target && k.value >= k.target).length}
            </p>
            <p className="text-gray-600">Target Met</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-gray-900">
              {Math.round(
                kpis.reduce((sum, k) => sum + Math.abs(k.changePercent), 0) / kpis.length
              )}
              %
            </p>
            <p className="text-gray-600">Avg Change</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICard;
