import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, Users, Target, Award, Minus } from 'lucide-react';

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
  icon: React.ComponentType<any>;
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
    description: 'Total revenue for current month'
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
    description: 'Monthly active users'
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
    description: 'Lead to customer conversion'
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
    description: 'Overall system performance'
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
    description: 'Average session engagement'
  }
];

interface KPICardProps {
  data?: KPIData;
  showTrend?: boolean;
  showTarget?: boolean;
  animate?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const KPICard: React.FC<KPICardProps> = ({ 
  data,
  showTrend = true,
  showTarget = true,
  animate = true,
  size = 'medium'
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // If no specific KPI data provided, use the first mock KPI
  const kpi = data || mockKPIs[0];

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
      const timer = setTimeout(() => {
        setAnimatedValue(kpi.value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(kpi.value);
    }
  }, [kpi.value, animate]);

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

  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const iconSizes = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const titleSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const valueSizes = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  const Icon = kpi.icon;

  return (
    <div 
      className={`bg-white rounded-lg shadow-lg border border-gray-200 performance-hover cursor-pointer ${sizeClasses[size]} gpu-accelerated`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className={`${iconSizes[size]} rounded-lg flex items-center justify-center text-white transition-colors duration-200`}
            style={{ backgroundColor: kpi.color }}
          >
            <Icon className={`${size === 'small' ? 'w-4 h-4' : size === 'medium' ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </div>
          <div>
            <h3 className={`font-semibold text-gray-900 ${titleSizes[size]}`}>{kpi.title}</h3>
            {kpi.description && (
              <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
            )}
          </div>
        </div>
        
        {showTrend && (
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 hover-bounce ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1">
              {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="mb-4">
        <div 
          className={`font-bold text-gray-900 transition-colors duration-300 ${valueSizes[size]}`}
          style={{ 
            color: isHovered ? kpi.color : undefined
          }}
        >
          {formattedValue}
        </div>
        
        {showTrend && (
          <div className="flex items-center space-x-2 mt-2 opacity-70 transition-opacity duration-200">
            <span className="text-sm text-gray-600">vs last period:</span>
            <span className="text-sm font-medium text-gray-900">
              {formattedPreviousValue}
            </span>
          </div>
        )}
      </div>

      {/* Target Progress */}
      {showTarget && kpi.target && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Target Progress</span>
            <span className="text-sm font-medium" style={{ color: kpi.color }}>
              {targetProgress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${targetProgress}%`,
                backgroundColor: kpi.color
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Current</span>
            <span>Target: {formatValue(kpi.target, kpi.format, kpi.unit)}</span>
          </div>
        </div>
      )}

      {/* Simplified Mini Trend Chart - Better Performance */}
      <div className="mt-4">
        <div className="flex items-end space-x-1 h-8">
          {Array.from({ length: 7 }, (_, i) => {
            const height = Math.max(10, 20 + Math.random() * 12);
            return (
              <div
                key={i}
                className="flex-1 rounded-t transition-colors duration-200 hover:opacity-80 cursor-pointer"
                style={{ 
                  height: `${height}px`,
                  backgroundColor: i === 6 ? kpi.color : `${kpi.color}66`
                }}
              ></div>
            );
          })}
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">7-day trend</div>
      </div>

      {/* Performance Insights - Only show on hover with animation */}
      {isHovered && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
          <div className="text-xs text-blue-800 font-medium mb-2">Performance Insights</div>
          <div className="space-y-1 text-xs text-blue-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Change:</span>
              <span className="font-medium text-gray-900">
                {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(kpi.format === 'percentage' ? 1 : 0)} {kpi.unit}
              </span>
            </div>
            {kpi.target && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">To target:</span>
                <span className="font-medium text-gray-900">
                  {kpi.target - kpi.value > 0 ? '+' : ''}{(kpi.target - kpi.value).toFixed(kpi.format === 'percentage' ? 1 : 0)} {kpi.unit}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-blue-200 pt-1">
              <span className="text-gray-600">Performance:</span>
              <span className={`font-medium ${targetProgress >= 90 ? 'text-green-600' : targetProgress >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                {targetProgress >= 90 ? 'Excellent' : targetProgress >= 70 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
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
  size = 'medium'
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Key Performance Indicators</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className={`grid gap-6 grid-cols-1 ${
        columns === 2 ? 'md:grid-cols-2' :
        columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' :
        columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
        'md:grid-cols-3'
      }`}>
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
              {Math.round(kpis.reduce((sum, k) => sum + Math.abs(k.changePercent), 0) / kpis.length)}%
            </p>
            <p className="text-gray-600">Avg Change</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICard;