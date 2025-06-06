import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DonutData {
  name: string;
  value: number;
  color: string;
}

const mockData: DonutData[] = [
  { name: 'Desktop', value: 45, color: '#3B82F6' },
  { name: 'Mobile', value: 35, color: '#10B981' },
  { name: 'Tablet', value: 15, color: '#F59E0B' },
  { name: 'Other', value: 5, color: '#EF4444' },
];

interface DonutChartProps {
  data?: DonutData[];
  title?: string;
  centerText?: string;
  size?: 'small' | 'medium' | 'large' | 'auto';
  compact?: boolean;
  height?: number;
  showLegend?: boolean;
  showSummary?: boolean;
  showTrends?: boolean;
}

const DonutChart: React.FC<DonutChartProps> = ({ 
  data = mockData, 
  title = 'Device Usage Distribution',
  centerText = 'Total Users',
  size = 'auto',
  compact = false,
  height,
  showLegend = true,
  showSummary = true,
  showTrends = true,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calculate adaptive dimensions based on content complexity
  const getAdaptiveDimensions = () => {
    const dataComplexity = data.length;
    
    // Calculate space needed for each section
    let extraSectionHeight = 0;
    
    if (showLegend && !compact) {
      const legendRows = Math.ceil(data.length / (data.length <= 2 ? 1 : 2));
      extraSectionHeight += 60 + (legendRows * 60); // Header + rows
    }
    
    if (showSummary && !compact) {
      extraSectionHeight += 120; // Summary section height
    }
    
    if (showTrends && !compact) {
      extraSectionHeight += 60; // Trends section height
    }
    
    let chartHeight: number;
    let containerMinHeight: number;
    let outerRadius: number;
    let innerRadius: number;
    
    if (height) {
      // Use provided height if specified
      chartHeight = Math.max(height * 0.4, 200); // Reduced from 0.6 to leave more space for sections
      containerMinHeight = height;
      outerRadius = Math.min(chartHeight * 0.35, 120);
      innerRadius = outerRadius * 0.5;
    } else if (size === 'small' || compact) {
      chartHeight = 160;
      containerMinHeight = chartHeight + 100 + (compact ? 0 : extraSectionHeight);
      outerRadius = Math.max(50, Math.min(70, chartHeight * 0.35));
      innerRadius = outerRadius * 0.5;
    } else if (size === 'large') {
      chartHeight = Math.max(350, 350 + dataComplexity * 12);
      containerMinHeight = chartHeight + 150 + extraSectionHeight;
      outerRadius = Math.max(120, Math.min(160, chartHeight * 0.35));
      innerRadius = outerRadius * 0.5;
    } else if (size === 'medium') {
      chartHeight = Math.max(250, 250 + dataComplexity * 8);
      containerMinHeight = chartHeight + 120 + extraSectionHeight;
      outerRadius = Math.max(90, Math.min(115, chartHeight * 0.35));
      innerRadius = outerRadius * 0.5;
    } else {
      // Auto sizing based on data complexity
      const baseHeight = 220;
      const complexityBonus = Math.min(dataComplexity * 15, 60);
      
      chartHeight = baseHeight + complexityBonus;
      containerMinHeight = chartHeight + 140 + extraSectionHeight;
      outerRadius = Math.max(80, Math.min(120, chartHeight * 0.35));
      innerRadius = outerRadius * 0.5;
    }
    
    return {
      chartHeight: Math.max(chartHeight, compact ? 140 : 180),
      containerMinHeight: Math.max(containerMinHeight, compact ? 280 : 420),
      outerRadius: Math.max(outerRadius, compact ? 40 : 60),
      innerRadius: Math.max(innerRadius, compact ? 20 : 30),
      fontSize: compact ? 9 : 11,
      centerTextSize: compact ? 'text-base' : 'text-xl',
      legendCols: compact || data.length <= 2 ? 1 : 2,
    };
  };

  const dimensions = getAdaptiveDimensions();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-center mb-2">
            <div 
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: data.payload.color }}
            ></div>
            <p className="font-semibold text-gray-800">{data.name}</p>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Value:</span>
              <span className="font-bold">{data.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Percentage:</span>
              <span className="font-bold">{percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
    setHoveredSegment(data[index].name);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
    setHoveredSegment(null);
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for segments < 5%

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={dimensions.fontSize}
        fontWeight="bold"
        className="drop-shadow-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div 
      className={`bg-white ${compact ? 'p-3' : 'p-6'} rounded-lg shadow-lg`}
      style={{ 
        minHeight: `${dimensions.containerMinHeight}px`,
        height: size === 'large' ? `${dimensions.containerMinHeight}px` : 'auto'
      }}
    >
      <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-semibold ${compact ? 'mb-2' : 'mb-4'} text-center`}>{title}</h3>
      
      <div style={{ height: `${dimensions.chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={compact ? false : <CustomLabel />}
              outerRadius={dimensions.outerRadius}
              innerRadius={dimensions.innerRadius}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationDuration={compact ? 500 : 1000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke={activeIndex === index ? '#ffffff' : 'none'}
                  strokeWidth={activeIndex === index ? (compact ? 2 : 3) : 0}
                  style={{
                    filter: activeIndex === index ? 'brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none',
                    transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'all 0.2s ease-in-out'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
              <tspan x="50%" y="45%" className={`${dimensions.centerTextSize} font-bold fill-gray-800`}>
                {compact ? `${Math.round(total / 1000)}k` : total.toLocaleString()}
              </tspan>
              <tspan x="50%" y="60%" className={`${compact ? 'text-xs' : 'text-sm'} fill-gray-600`}>
                {compact ? centerText.split(' ')[0] : centerText}
              </tspan>
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with adaptive layout */}
      {showLegend && !compact && (
        <div className={`${compact ? 'mt-3' : 'mt-6'} grid grid-cols-${dimensions.legendCols} gap-${compact ? '2' : '3'}`}>
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            const isHovered = hoveredSegment === item.name;
            
            return (
              <div 
                key={item.name}
                className={`flex items-center ${compact ? 'p-2' : 'p-3'} rounded-lg cursor-pointer transition-all ${
                  isHovered ? 'bg-gray-100 scale-105' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onMouseEnter={() => {
                  setActiveIndex(index);
                  setHoveredSegment(item.name);
                }}
                onMouseLeave={() => {
                  setActiveIndex(null);
                  setHoveredSegment(null);
                }}
              >
                <div 
                  className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} rounded-full ${compact ? 'mr-2' : 'mr-3'} flex-shrink-0`}
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${compact ? 'text-xs' : 'text-sm'} text-gray-800 truncate`}>
                    {compact ? item.name.slice(0, 8) + (item.name.length > 8 ? '...' : '') : item.name}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`${compact ? 'text-xs' : 'text-xs'} text-gray-600`}>
                      {compact ? `${Math.round(item.value / 1000)}k` : item.value.toLocaleString()}
                    </span>
                    <span className={`${compact ? 'text-xs' : 'text-xs'} font-bold text-gray-800`}>
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary statistics - Only show in non-compact mode */}
      {showSummary && !compact && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="font-bold text-lg">{data.length}</p>
              <p className="text-gray-600">Categories</p>
            </div>
            <div>
              <p className="font-bold text-lg">
                {data.reduce((max, item) => item.value > max.value ? item : max, data[0]).name}
              </p>
              <p className="text-gray-600">Largest</p>
            </div>
            <div>
              <p className="font-bold text-lg">
                {((data.reduce((max, item) => item.value > max.value ? item : max, data[0]).value / total) * 100).toFixed(0)}%
              </p>
              <p className="text-gray-600">Max Share</p>
            </div>
          </div>
        </div>
      )}

      {/* Trend indicators - Only show in non-compact mode */}
      {showTrends && !compact && (
        <div className="mt-4 flex justify-center space-x-6 text-xs">
          {data.map((item) => {
            const trend = Math.random() > 0.5 ? 'up' : 'down';
            const change = (Math.random() * 10).toFixed(1);
            
            return (
              <div key={item.name} className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600">{item.name}</span>
                  <span className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend === 'up' ? '↗' : '↘'} {change}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DonutChart;