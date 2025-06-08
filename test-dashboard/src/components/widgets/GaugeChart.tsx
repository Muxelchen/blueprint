import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value?: number;
  maxValue?: number;
  title?: string;
  unit?: string;
  color?: string;
  animate?: boolean;
  size?: 'small' | 'medium' | 'large' | 'auto';
  compact?: boolean;
  height?: number;
  showMarkers?: boolean;
  showStatusIndicators?: boolean;
  showStatistics?: boolean;
  showProgressBar?: boolean;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value = 75,
  maxValue = 100,
  title = 'Performance Score',
  unit = '%',
  color = '#3B82F6',
  animate = true,
  size = 'medium',
  compact = false,
  height,
  showMarkers = true,
  showStatusIndicators = true,
  showStatistics = true,
  showProgressBar = true,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value, animate]);

  const percentage = Math.min((animatedValue / maxValue) * 100, 100);
  const remainingPercentage = 100 - percentage;

  const data = [
    { name: 'Value', value: percentage, color: color },
    { name: 'Remaining', value: remainingPercentage, color: '#f0f0f0' },
  ];

  const getColorByValue = (val: number) => {
    if (val >= 80) return '#10B981'; // Green
    if (val >= 60) return '#F59E0B'; // Yellow
    if (val >= 40) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const dynamicColor = color === '#3B82F6' ? getColorByValue(percentage) : color;

  const RADIAN = Math.PI / 180;
  const startAngle = 180;
  const endAngle = 0;

  // Determine sizes based on the size prop
  let outerRadius = 90;
  let innerRadius = 60;
  let labelFontSize = 'text-4xl';
  let statusIndicatorSize = 'text-xs';
  let statisticsFontSize = 'text-lg';
  let progressBarHeight = 'h-2';

  switch (size) {
    case 'small':
      outerRadius = 60;
      innerRadius = 40;
      labelFontSize = 'text-3xl';
      statusIndicatorSize = 'text-xs';
      statisticsFontSize = 'text-base';
      progressBarHeight = 'h-1.5';
      break;
    case 'medium':
      outerRadius = 90;
      innerRadius = 60;
      labelFontSize = 'text-4xl';
      statusIndicatorSize = 'text-xs';
      statisticsFontSize = 'text-lg';
      progressBarHeight = 'h-2';
      break;
    case 'large':
      outerRadius = 120;
      innerRadius = 80;
      labelFontSize = 'text-5xl';
      statusIndicatorSize = 'text-sm';
      statisticsFontSize = 'text-xl';
      progressBarHeight = 'h-2.5';
      break;
    case 'auto':
    default:
      outerRadius = 90;
      innerRadius = 60;
      labelFontSize = 'text-4xl';
      statusIndicatorSize = 'text-xs';
      statisticsFontSize = 'text-lg';
      progressBarHeight = 'h-2';
      break;
  }

  return (
    <div className={`bg-surface border border-border p-6 rounded-lg shadow-lg ${compact ? 'p-4' : ''}`}>
      <h3 className="text-lg font-semibold mb-4 text-center text-text-primary">{title}</h3>

      <div className="relative" style={{ height: height || outerRadius + 40 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="90%"
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill="var(--color-accent)"
              dataKey="value"
              animationDuration={animate ? 1500 : 0}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? dynamicColor : 'var(--color-surface-secondary)'} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center value display */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ top: '20%' }}>
          <div className="text-center">
            <div
              className={`transition-all duration-1000 ${animate ? 'scale-110' : ''} font-bold text-text-primary`}
              style={{ color: dynamicColor, fontSize: labelFontSize }}
            >
              {Math.round(animatedValue)}
              {unit}
            </div>
            <div className="text-sm text-text-secondary mt-1">
              of {maxValue}
              {unit}
            </div>
          </div>
        </div>

        {/* Gauge markers - Fixed positioning with correct angle calculation */}
        {showMarkers && (
          <div className="absolute inset-0">
            {[0, 25, 50, 75, 100].map(mark => {
              // Correct angle calculation for semicircle gauge (180° to 0°)
              // For a semicircle: 0% = 180°, 25% = 135°, 50% = 90°, 75% = 45°, 100% = 0°
              const angle = 180 - (mark / 100) * 180;

              // Position markers outside the gauge arc with proper radius
              const containerHeight = height || outerRadius + 40;
              const markerDistance = outerRadius + 25; // Fixed distance outside the arc
              const markerRadiusPercent = (markerDistance / containerHeight) * 100;

              const x = 50 + markerRadiusPercent * Math.cos(angle * RADIAN);
              const y = 90 + markerRadiusPercent * Math.sin(angle * RADIAN);

              return (
                <div
                  key={mark}
                  className="absolute text-xs text-gray-600 font-medium"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {mark}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status indicators */}
      {showStatusIndicators && (
        <div className="mt-6 grid grid-cols-4 gap-2 text-center">
          <div
            className={`p-2 rounded ${percentage >= 80 ? 'bg-success/10 text-success' : 'bg-surface-secondary text-text-tertiary'}`}
          >
            <div className="w-3 h-3 bg-success rounded-full mx-auto mb-1"></div>
            Great
          </div>
          <div
            className={`p-2 rounded ${percentage >= 60 && percentage < 80 ? 'bg-warning/10 text-warning' : 'bg-surface-secondary text-text-tertiary'}`}
          >
            <div className="w-3 h-3 bg-warning rounded-full mx-auto mb-1"></div>
            Good
          </div>
          <div
            className={`p-2 rounded ${percentage >= 40 && percentage < 60 ? 'bg-accent/10 text-accent' : 'bg-surface-secondary text-text-tertiary'}`}
          >
            <div className="w-3 h-3 bg-accent rounded-full mx-auto mb-1"></div>
            Fair
          </div>
          <div
            className={`p-2 rounded ${percentage < 40 ? 'bg-error/10 text-error' : 'bg-surface-secondary text-text-tertiary'}`}
          >
            <div className="w-3 h-3 bg-error rounded-full mx-auto mb-1"></div>
            Poor
          </div>
        </div>
      )}

      {/* Statistics */}
      {showStatistics && (
        <div className="mt-4 p-4 bg-surface-secondary rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p
                className="font-bold text-text-primary"
                style={{ color: dynamicColor, fontSize: statisticsFontSize }}
              >
                {Math.round(animatedValue)}
              </p>
              <p className="text-text-secondary">Current</p>
            </div>
            <div>
              <p className="font-bold text-text-primary">{maxValue}</p>
              <p className="text-text-secondary">Maximum</p>
            </div>
            <div>
              <p className="font-bold text-text-primary">{Math.round(percentage)}%</p>
              <p className="text-text-secondary">Progress</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress bar alternative view */}
      {showProgressBar && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-text-secondary mb-1">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full bg-surface-secondary rounded-full" style={{ height: progressBarHeight }}>
            <div
              className="rounded-full transition-all duration-1500 ease-out"
              style={{
                width: `${percentage}%`,
                backgroundColor: dynamicColor,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaugeChart;
