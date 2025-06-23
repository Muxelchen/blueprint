import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Target, Hash, Play, Pause, RotateCcw } from 'lucide-react';

interface CounterWidgetProps {
  title?: string;
  value: number;
  targetValue?: number;
  previousValue?: number;
  format?: 'number' | 'currency' | 'percentage' | 'decimal' | 'bytes';
  currency?: string;
  decimals?: number;
  duration?: number; // Animation duration in milliseconds
  suffix?: string;
  prefix?: string;
  showTrend?: boolean;
  showTarget?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  theme?: 'light' | 'dark';
  className?: string;
  onAnimationComplete?: () => void;
  enableControls?: boolean;
}

const CounterWidget: React.FC<CounterWidgetProps> = ({
  title = 'Counter',
  value,
  targetValue,
  previousValue,
  format = 'number',
  currency = 'USD',
  decimals = 0,
  duration = 2000,
  suffix = '',
  prefix = '',
  showTrend = true,
  showTarget = false,
  showProgress = false,
  autoStart = true,
  size = 'md',
  color = 'blue',
  theme = 'light',
  className = '',
  onAnimationComplete,
  enableControls = false
}) => {
  const [displayValue, setDisplayValue] = useState(autoStart ? 0 : value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStartTime, setAnimationStartTime] = useState<number | null>(null);

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setAnimationStartTime(Date.now());
    setDisplayValue(0);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setAnimationStartTime(null);
    setDisplayValue(0);
  };

  useEffect(() => {
    if (autoStart && !isAnimating) {
      startAnimation();
    }
  }, [value, autoStart]);

  useEffect(() => {
    if (!isAnimating || !animationStartTime) return;

    const animateValue = () => {
      const elapsed = Date.now() - animationStartTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = value * easeOut;
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateValue);
      } else {
        setIsAnimating(false);
        setDisplayValue(value);
        onAnimationComplete?.();
      }
    };

    requestAnimationFrame(animateValue);
  }, [isAnimating, animationStartTime, value, duration, onAnimationComplete]);

  const formatValue = (val: number): string => {
    let formattedValue = '';
    
    switch (format) {
      case 'currency':
        formattedValue = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(val);
        break;
      case 'percentage':
        formattedValue = `${(val * 100).toFixed(decimals)}%`;
        break;
      case 'decimal':
        formattedValue = val.toFixed(decimals);
        break;
      case 'bytes':
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (val === 0) return '0 Bytes';
        const i = Math.floor(Math.log(val) / Math.log(1024));
        formattedValue = `${(val / Math.pow(1024, i)).toFixed(decimals)} ${sizes[i]}`;
        break;
      default:
        formattedValue = val.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
    }
    
    return `${prefix}${formattedValue}${suffix}`;
  };

  const trend = useMemo(() => {
    if (!previousValue || !showTrend) return null;
    
    const change = value - previousValue;
    const changePercentage = ((change / previousValue) * 100);
    
    return {
      change,
      changePercentage,
      isPositive: change > 0,
      isNegative: change < 0,
      isNeutral: change === 0,
    };
  }, [value, previousValue, showTrend]);

  const progress = useMemo(() => {
    if (!targetValue || !showProgress) return null;
    
    const progressPercentage = Math.min((value / targetValue) * 100, 100);
    const isOnTarget = value >= targetValue;
    
    return {
      percentage: progressPercentage,
      isOnTarget,
      remaining: Math.max(targetValue - value, 0),
    };
  }, [value, targetValue, showProgress]);

  const sizeClasses = {
    sm: {
      container: 'p-4',
      title: 'text-sm',
      value: 'text-2xl',
      trend: 'text-xs',
      icon: 'w-4 h-4',
    },
    md: {
      container: 'p-6',
      title: 'text-base',
      value: 'text-4xl',
      trend: 'text-sm',
      icon: 'w-5 h-5',
    },
    lg: {
      container: 'p-8',
      title: 'text-lg',
      value: 'text-6xl',
      trend: 'text-base',
      icon: 'w-6 h-6',
    },
    xl: {
      container: 'p-10',
      title: 'text-xl',
      value: 'text-8xl',
      trend: 'text-lg',
      icon: 'w-8 h-8',
    },
  };

  const colorClasses = {
    blue: {
      bg: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      accent: 'text-blue-500',
    },
    green: {
      bg: theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      accent: 'text-green-500',
    },
    red: {
      bg: theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-600',
      accent: 'text-red-500',
    },
    yellow: {
      bg: theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-600',
      accent: 'text-yellow-500',
    },
    purple: {
      bg: theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      accent: 'text-purple-500',
    },
    gray: {
      bg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50',
      border: 'border-gray-200',
      text: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      accent: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    },
  };

  const containerClass = `${className} ${
    theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
  } ${colorClasses[color].bg} ${colorClasses[color].border} border rounded-lg ${sizeClasses[size].container}`;

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Hash className={`${colorClasses[color].text} ${sizeClasses[size].icon}`} />
          <h3 className={`font-semibold ${sizeClasses[size].title} ${colorClasses[color].text}`}>
            {title}
          </h3>
        </div>
        
        {enableControls && (
          <div className="flex items-center space-x-1">
            <button
              onClick={isAnimating ? undefined : startAnimation}
              disabled={isAnimating}
              className={`p-1 rounded ${
                isAnimating 
                  ? 'opacity-50 cursor-not-allowed' 
                  : `hover:bg-opacity-20 ${theme === 'dark' ? 'hover:bg-white' : 'hover:bg-gray-900'}`
              }`}
              title="Start Animation"
            >
              <Play className={sizeClasses[size].icon} />
            </button>
            <button
              onClick={resetAnimation}
              className={`p-1 rounded hover:bg-opacity-20 ${
                theme === 'dark' ? 'hover:bg-white' : 'hover:bg-gray-900'
              }`}
              title="Reset"
            >
              <RotateCcw className={sizeClasses[size].icon} />
            </button>
          </div>
        )}
      </div>

      {/* Main Counter Value */}
      <div className={`font-bold ${sizeClasses[size].value} ${colorClasses[color].text} mb-4`}>
        {formatValue(displayValue)}
      </div>

      {/* Trend Indicator */}
      {trend && (
        <div className={`flex items-center space-x-2 mb-4 ${sizeClasses[size].trend}`}>
          {trend.isPositive && (
            <div className="flex items-center text-green-600">
              <TrendingUp className={`mr-1 ${sizeClasses[size].icon}`} />
              <span>+{Math.abs(trend.changePercentage).toFixed(1)}%</span>
            </div>
          )}
          {trend.isNegative && (
            <div className="flex items-center text-red-600">
              <TrendingDown className={`mr-1 ${sizeClasses[size].icon}`} />
              <span>-{Math.abs(trend.changePercentage).toFixed(1)}%</span>
            </div>
          )}
          {trend.isNeutral && (
            <div className={`flex items-center ${colorClasses[color].accent}`}>
              <span>No change</span>
            </div>
          )}
          <span className={colorClasses[color].accent}>vs previous</span>
        </div>
      )}

      {/* Target Progress */}
      {progress && showTarget && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className={`${colorClasses[color].text} ${sizeClasses[size].icon}`} />
              <span className={`${sizeClasses[size].trend} ${colorClasses[color].text}`}>
                Target Progress
              </span>
            </div>
            <span className={`${sizeClasses[size].trend} ${
              progress.isOnTarget ? 'text-green-600' : colorClasses[color].accent
            }`}>
              {progress.percentage.toFixed(1)}%
            </span>
          </div>
          
          {showProgress && (
            <div className={`w-full bg-gray-200 rounded-full h-2 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  progress.isOnTarget ? 'bg-green-500' : colorClasses[color].text.replace('text-', 'bg-')
                }`}
                style={{ width: `${Math.min(progress.percentage, 100)}%` }}
              />
            </div>
          )}
          
          {!progress.isOnTarget && (
            <div className={`mt-1 ${sizeClasses[size].trend} ${colorClasses[color].accent}`}>
              {formatValue(progress.remaining)} remaining to reach target
            </div>
          )}
        </div>
      )}

      {/* Animation Indicator */}
      {isAnimating && (
        <div className={`flex items-center space-x-2 ${sizeClasses[size].trend} ${colorClasses[color].accent}`}>
          <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
          <span>Animating...</span>
        </div>
      )}
    </div>
  );
};

export default CounterWidget; 