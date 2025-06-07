import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, Eye, Download, RotateCcw, Zap, Activity } from 'lucide-react';

interface PieData {
  name: string;
  value: number;
  color: string;
  id?: string;
}

// Performance metrics tracking
interface PerformanceMetrics {
  renderTime: number;
  dataProcessingTime: number;
  totalRenderCount: number;
  lastOptimization: string;
}

const mockData: PieData[] = [
  { name: 'Product Sales', value: 35, color: '#3B82F6', id: 'product-sales' },
  { name: 'Service Revenue', value: 25, color: '#10B981', id: 'service-revenue' },
  { name: 'Subscriptions', value: 20, color: '#F59E0B', id: 'subscriptions' },
  { name: 'Licensing', value: 12, color: '#EF4444', id: 'licensing' },
  { name: 'Partnerships', value: 8, color: '#8B5CF6', id: 'partnerships' },
];

interface PieChartProps {
  data?: PieData[];
  title?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  centerText?: string;
  size?: 'small' | 'medium' | 'large';
  compact?: boolean;
  height?: number;
  maxDataPoints?: number;
  enableVirtualization?: boolean;
  enablePerformanceMonitoring?: boolean;
  animationDuration?: number;
  onPerformanceUpdate?: (metrics: PerformanceMetrics) => void;
}

// Advanced data processing with virtualization
const processDataWithVirtualization = (
  data: PieData[],
  maxPoints: number = 10,
  enableVirtualization: boolean = false
): { processedData: PieData[]; isVirtualized: boolean } => {
  if (!enableVirtualization || data.length <= maxPoints) {
    return { processedData: data, isVirtualized: false };
  }

  // Sort by value and take top items, combine rest into "Others"
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const topItems = sortedData.slice(0, maxPoints - 1);
  const otherItems = sortedData.slice(maxPoints - 1);

  if (otherItems.length > 0) {
    const othersValue = otherItems.reduce((sum, item) => sum + item.value, 0);
    const othersItem: PieData = {
      name: `Others (${otherItems.length} items)`,
      value: othersValue,
      color: '#6B7280',
      id: 'others-virtualized',
    };

    return {
      processedData: [...topItems, othersItem],
      isVirtualized: true,
    };
  }

  return { processedData: topItems, isVirtualized: false };
};

// Enhanced dimension calculation with performance optimization
const getDimensions = (size: string, compact: boolean, height?: number) => {
  if (height) {
    return {
      minHeight: Math.max(height, 200),
      pieRadius: Math.min(height * 0.15, 140),
      containerPadding: 'p-4',
      titleSize: 'text-lg',
      legendCols: 'grid-cols-2',
    };
  }

  const sizeMap = {
    small: {
      minHeight: 250,
      pieRadius: 60,
      containerPadding: 'p-3',
      titleSize: 'text-sm',
      legendCols: 'grid-cols-1',
    },
    medium: {
      minHeight: 350,
      pieRadius: 80,
      containerPadding: 'p-4',
      titleSize: 'text-base',
      legendCols: 'grid-cols-2',
    },
    large: {
      minHeight: 450,
      pieRadius: 120,
      containerPadding: 'p-6',
      titleSize: 'text-lg',
      legendCols: 'grid-cols-3',
    },
  };

  return compact
    ? {
        ...sizeMap[size as keyof typeof sizeMap],
        minHeight: sizeMap[size as keyof typeof sizeMap].minHeight * 0.8,
      }
    : sizeMap[size as keyof typeof sizeMap];
};

// Custom hook for performance monitoring
const usePerformanceMonitoring = (
  enabled: boolean,
  onUpdate?: (metrics: PerformanceMetrics) => void
) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    dataProcessingTime: 0,
    totalRenderCount: 0,
    lastOptimization: 'initial',
  });

  const startTiming = useCallback(() => {
    return enabled ? performance.now() : 0;
  }, [enabled]);

  const endTiming = useCallback(
    (startTime: number, operation: keyof PerformanceMetrics) => {
      if (!enabled) return;

      const endTime = performance.now();
      const duration = endTime - startTime;

      metricsRef.current = {
        ...metricsRef.current,
        [operation]: duration,
        totalRenderCount: metricsRef.current.totalRenderCount + 1,
        lastOptimization: new Date().toISOString(),
      };

      onUpdate?.(metricsRef.current);
    },
    [enabled, onUpdate]
  );

  return { startTiming, endTiming, metrics: metricsRef.current };
};

const PieChart: React.FC<PieChartProps> = ({
  data = mockData,
  title = 'Revenue Distribution',
  showLegend = true,
  showTooltip = true,
  centerText,
  size = 'medium',
  compact = false,
  height,
  maxDataPoints = 10,
  enableVirtualization = false,
  enablePerformanceMonitoring = false,
  animationDuration = 800,
  onPerformanceUpdate,
}) => {
  // Performance monitoring
  const { startTiming, endTiming, metrics } = usePerformanceMonitoring(
    enablePerformanceMonitoring,
    onPerformanceUpdate
  );

  // State management
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPerformanceStats, setShowPerformanceStats] = useState(false);

  // Refs for performance optimization
  const chartRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Memoized data processing with virtualization
  const { processedData, calculatedTotal, dimensions, isVirtualized } = useMemo(() => {
    const processingStart = startTiming();

    const { processedData: virtualizedData, isVirtualized: isDataVirtualized } =
      processDataWithVirtualization(data, maxDataPoints, enableVirtualization);

    const total = virtualizedData.reduce((sum, item) => sum + item.value, 0);
    const dims = getDimensions(size, compact, height);

    endTiming(processingStart, 'dataProcessingTime');

    return {
      processedData: virtualizedData,
      calculatedTotal: total,
      dimensions: dims,
      isVirtualized: isDataVirtualized,
    };
  }, [data, size, compact, height, maxDataPoints, enableVirtualization, startTiming, endTiming]);

  // Optimized percentage calculation
  const getPercentage = useCallback(
    (value: number) => {
      return calculatedTotal > 0 ? ((value / calculatedTotal) * 100).toFixed(1) : '0.0';
    },
    [calculatedTotal]
  );

  // Enhanced mouse handlers with throttling
  const handleMouseEnter = useCallback((index: number) => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    animationRef.current = window.setTimeout(() => {
      setHoveredIndex(null);
    }, 150);
  }, []);

  // Refresh functionality with performance tracking
  const handleRefresh = useCallback(() => {
    const refreshStart = startTiming();
    setIsAnimating(true);

    // Simulate data refresh
    setTimeout(() => {
      setIsAnimating(false);
      endTiming(refreshStart, 'renderTime');
    }, animationDuration);
  }, [startTiming, endTiming, animationDuration]);

  // Performance stats toggle
  const togglePerformanceStats = useCallback(() => {
    setShowPerformanceStats(prev => !prev);
  }, []);

  // Enhanced tooltip content
  const CustomTooltip = useCallback(
    ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
            <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Value: <span className="font-semibold">{data.value}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Percentage: <span className="font-semibold">{getPercentage(data.value)}%</span>
            </p>
          </div>
        );
      }
      return null;
    },
    [getPercentage]
  );

  // Custom legend with enhanced features
  const CustomLegend = useMemo(() => {
    if (!showLegend) return null;

    return (
      <div className={`grid ${dimensions.legendCols} gap-2 mt-4`}>
        {processedData.map((entry, index) => (
          <div
            key={entry.id || entry.name}
            className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-all duration-200 ${
              hoveredIndex === index
                ? 'bg-gray-100 dark:bg-gray-700 scale-105'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {entry.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {entry.value} ({getPercentage(entry.value)}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }, [
    processedData,
    showLegend,
    dimensions.legendCols,
    hoveredIndex,
    getPercentage,
    handleMouseEnter,
    handleMouseLeave,
  ]);

  // Export functionality
  const handleExport = useCallback(async () => {
    if (!chartRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Simple export - in a real implementation, you'd use a library like html2canvas
      const dataStr = JSON.stringify(processedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `pie-chart-data-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [processedData]);

  // Performance stats component
  const PerformanceStats = useMemo(() => {
    if (!showPerformanceStats || !enablePerformanceMonitoring) return null;

    return (
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-2 mb-2">
          <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Performance Metrics
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-blue-800 dark:text-blue-200">
            Render Time: {(metrics.renderTime || 0).toFixed(2)}ms
          </div>
          <div className="text-blue-800 dark:text-blue-200">
            Data Processing: {(metrics.dataProcessingTime || 0).toFixed(2)}ms
          </div>
          <div className="text-blue-800 dark:text-blue-200">
            Total Renders: {metrics.totalRenderCount || 0}
          </div>
          {isVirtualized && (
            <div className="text-orange-600 dark:text-orange-400 col-span-2">
              Data virtualized: Showing {processedData.length} of {data.length} items
            </div>
          )}
        </div>
      </div>
    );
  }, [
    showPerformanceStats,
    enablePerformanceMonitoring,
    isVirtualized,
    processedData.length,
    data.length,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  // Track render performance
  useEffect(() => {
    const renderStart = startTiming();
    const timeoutId = setTimeout(() => {
      endTiming(renderStart, 'renderTime');
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [processedData, startTiming, endTiming]);

  return (
    <div
      ref={chartRef}
      className={`bg-surface border border-border rounded-lg shadow-sm ${dimensions.containerPadding} ${
        isAnimating ? 'opacity-75 pointer-events-none' : ''
      }`}
      style={{ minHeight: dimensions.minHeight }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h3 className={`font-semibold text-text-primary ${dimensions.titleSize}`}>
            {title}
          </h3>
          {isVirtualized && (
            <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded">
              Virtualized
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {enablePerformanceMonitoring && (
            <button
              onClick={togglePerformanceStats}
              className={`p-1.5 rounded-md transition-colors ${
                showPerformanceStats
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title="Toggle Performance Stats"
            >
              <Zap className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleExport}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-md transition-colors"
            title="Export Data"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleRefresh}
            className={`p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-md transition-all ${
              isAnimating ? 'animate-spin' : ''
            }`}
            title="Refresh"
            disabled={isAnimating}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowPerformanceStats(prev => !prev)}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-md transition-colors"
            title="Toggle Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={dimensions.minHeight - 100}>
          <RechartsPieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              innerRadius={compact ? dimensions.pieRadius * 0.5 : dimensions.pieRadius * 0.6}
              outerRadius={dimensions.pieRadius}
              paddingAngle={2}
              dataKey="value"
              animationDuration={animationDuration}
              onMouseEnter={(_, index) => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.id || index}`}
                  fill={entry.color}
                  stroke={hoveredIndex === index ? '#ffffff' : 'transparent'}
                  strokeWidth={hoveredIndex === index ? 2 : 0}
                  style={{
                    filter: hoveredIndex === index ? 'brightness(1.1)' : 'none',
                    transformOrigin: 'center',
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease-in-out',
                  }}
                />
              ))}
            </Pie>

            {showTooltip && <Tooltip content={CustomTooltip} />}
          </RechartsPieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        {centerText && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{centerText}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total: {calculatedTotal}</p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Legend */}
      {CustomLegend}

      {/* Performance Stats */}
      {PerformanceStats}
    </div>
  );
};

export default PieChart;
