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
  size?: 'small' | 'medium' | 'large' | 'auto';
  compact?: boolean;
  height?: number;
  showChart?: boolean;
  showInsights?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ 
  data,
  showTrend = true,
  showTarget = true,
  animate = true,
  size = 'medium',
  compact = false,
  height,
  showChart = true,
  showInsights = true,
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

  // Calculate adaptive dimensions based on content complexity
  const getAdaptiveDimensions = () => {
    const hasTarget = showTarget && kpi.target;
    const hasChart = showChart;
    const hasInsights = showInsights && size === 'large';
    const hasDescription = kpi.description && size === 'large';
    
    // Count active features to determine space needs
    const featureCount = [showTrend, hasTarget, hasChart, hasInsights, hasDescription].filter(Boolean).length;
    
    let cardHeight: number;
    let cardPadding: string;
    let iconDimensions: string;
    let titleFontSize: string;
    let valueFontSize: string;
    let spacing: string;
    
    if (height) {
      // Use provided height and scale elements accordingly
      cardHeight = height;
      const isLarge = height > 200;
      const isSmall = height < 140;
      
      cardPadding = isSmall ? 'p-2' : isLarge ? 'p-6' : 'p-4';
      iconDimensions = isSmall ? 'w-5 h-5' : isLarge ? 'w-10 h-10' : 'w-8 h-8';
      titleFontSize = isSmall ? 'text-xs' : isLarge ? 'text-lg' : 'text-base';
      valueFontSize = isSmall ? 'text-lg' : isLarge ? 'text-2xl' : 'text-xl';
      spacing = isSmall ? 'space-x-1' : isLarge ? 'space-x-3' : 'space-x-2';
    } else if (size === 'small' || compact) {
      cardHeight = 120 + (featureCount * 15); // Base + feature space
      cardPadding = compact ? 'p-2' : 'p-3';
      iconDimensions = 'w-5 h-5';
      titleFontSize = 'text-xs';
      valueFontSize = 'text-base';
      spacing = 'space-x-1';
    } else if (size === 'large') {
      cardHeight = 200 + (featureCount * 25); // More generous space
      cardPadding = 'p-6';
      iconDimensions = 'w-10 h-10';
      titleFontSize = 'text-lg';
      valueFontSize = 'text-2xl';
      spacing = 'space-x-3';
    } else if (size === 'medium') {
      cardHeight = 160 + (featureCount * 20); // Balanced space
      cardPadding = 'p-4';
      iconDimensions = 'w-8 h-8';
      titleFontSize = 'text-base';
      valueFontSize = 'text-xl';
      spacing = 'space-x-2';
    } else {
      // Auto sizing based on content complexity
      const baseHeight = 140;
      const featureBonus = featureCount * 18;
      const valueComplexity = kpi.value.toString().length > 6 ? 10 : 0;
      
      cardHeight = baseHeight + featureBonus + valueComplexity;
      cardPadding = cardHeight > 180 ? 'p-4' : 'p-3';
      iconDimensions = cardHeight > 180 ? 'w-8 h-8' : 'w-6 h-6';
      titleFontSize = cardHeight > 180 ? 'text-base' : 'text-sm';
      valueFontSize = cardHeight > 180 ? 'text-xl' : 'text-lg';
      spacing = cardHeight > 180 ? 'space-x-2' : 'space-x-1';
    }
    
    return {
      cardHeight: Math.max(cardHeight, compact ? 100 : 120),
      cardPadding,
      iconDimensions,
      titleFontSize,
      valueFontSize,
      spacing,
      showCompactMode: cardHeight < 140,
      chartBars: cardHeight < 140 ? 3 : cardHeight > 200 ? 8 : 6,
    };
  };

  const dimensions = getAdaptiveDimensions();

  const Icon = kpi.icon;

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer ${dimensions.cardPadding} flex flex-col h-full overflow-hidden`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ height: dimensions.cardHeight ? `${dimensions.cardHeight}px` : 'auto' }}
    >
      {/* Header - Optimized for space */}
      <div className="flex items-start justify-between mb-2 flex-shrink-0">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div 
            className={`${dimensions.iconDimensions} rounded-lg flex items-center justify-center text-white transition-colors duration-200 flex-shrink-0`}
            style={{ backgroundColor: kpi.color }}
          >
            <Icon className={`${size === 'small' ? 'w-3 h-3' : size === 'medium' ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`font-semibold text-gray-900 ${dimensions.titleFontSize} truncate leading-tight`}>{kpi.title}</h3>
            {kpi.description && size === 'large' && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{kpi.description}</p>
            )}
          </div>
        </div>
        
        {showTrend && (
          <div className={`flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${getTrendColor()} flex-shrink-0 ml-2`}>
            {getTrendIcon()}
            <span className="ml-1">
              {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Main Value - Better space utilization */}
      <div className="mb-2 flex-grow flex flex-col justify-center">
        <div 
          className={`font-bold text-gray-900 transition-colors duration-300 ${dimensions.valueFontSize} leading-none`}
          style={{ 
            color: isHovered ? kpi.color : undefined
          }}
        >
          {formattedValue}
        </div>
        
        {showTrend && size !== 'small' && (
          <div className="flex items-center space-x-2 mt-1 opacity-70 transition-opacity duration-200">
            <span className="text-xs text-gray-600">vs last:</span>
            <span className="text-xs font-medium text-gray-900">
              {formattedPreviousValue}
            </span>
          </div>
        )}
      </div>

      {/* Target Progress - Compact version */}
      {showTarget && kpi.target && size !== 'small' && (
        <div className="mb-2 flex-shrink-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Target</span>
            <span className="text-xs font-medium" style={{ color: kpi.color }}>
              {targetProgress.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${targetProgress}%`,
                backgroundColor: kpi.color
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Mini Trend Chart - Optimized for small spaces */}
      {showChart && (
        <div className="mt-auto flex-shrink-0">
          <div className="flex items-end space-x-0.5 h-4">
            {Array.from({ length: size === 'small' ? 4 : size === 'medium' ? 6 : 8 }, (_, i) => {
              const height = Math.max(4, 6 + Math.random() * 10);
              const isLast = i === (size === 'small' ? 3 : size === 'medium' ? 5 : 7);
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-colors duration-200 hover:opacity-80 cursor-pointer"
                  style={{ 
                    height: `${height}px`,
                    backgroundColor: isLast ? kpi.color : `${kpi.color}66`
                  }}
                ></div>
              );
            })}
          </div>
          {size !== 'small' && (
            <div className="text-xs text-gray-500 text-center mt-0.5">
              {size === 'medium' ? '6d' : '8d'} trend
            </div>
          )}
        </div>
      )}

      {/* Performance Insights - Compact hover display */}
      {isHovered && size === 'large' && showInsights && (
        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200 animate-fade-in flex-shrink-0">
          <div className="text-xs text-blue-800 font-medium mb-1">Quick Stats</div>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
            <div className="text-center">
              <div className="font-medium text-gray-900">
                {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(kpi.format === 'percentage' ? 1 : 0)}
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