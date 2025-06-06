import React, { useState } from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';

interface LineData {
  name: string;
  sales: number;
  revenue: number;
  profit: number;
  visitors: number;
}

const mockData: LineData[] = [
  { name: 'Jan', sales: 4000, revenue: 2400, profit: 1200, visitors: 12000 },
  { name: 'Feb', sales: 3000, revenue: 1398, profit: 800, visitors: 9800 },
  { name: 'Mar', sales: 2000, revenue: 9800, profit: 2400, visitors: 15600 },
  { name: 'Apr', sales: 2780, revenue: 3908, profit: 1500, visitors: 11200 },
  { name: 'May', sales: 1890, revenue: 4800, profit: 2100, visitors: 13400 },
  { name: 'Jun', sales: 2390, revenue: 3800, profit: 1800, visitors: 10800 },
  { name: 'Jul', sales: 3490, revenue: 4300, profit: 2200, visitors: 14200 },
  { name: 'Aug', sales: 4200, revenue: 5100, profit: 2800, visitors: 16800 },
  { name: 'Sep', sales: 3800, revenue: 4600, profit: 2500, visitors: 15200 },
  { name: 'Oct', sales: 4100, revenue: 4900, profit: 2700, visitors: 17000 },
  { name: 'Nov', sales: 4500, revenue: 5400, profit: 3100, visitors: 18200 },
  { name: 'Dec', sales: 5000, revenue: 6000, profit: 3500, visitors: 20000 }
];

interface LineChartProps {
  data?: LineData[];
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'auto';
  compact?: boolean;
  height?: number;
  showBrush?: boolean;
  showStatistics?: boolean;
  showToggles?: boolean;
  showInstructions?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data = mockData, 
  title = 'Annual Performance Trends',
  size = 'auto',
  compact = false,
  height,
  showBrush = true,
  showStatistics = true,
  showToggles = true,
  showInstructions = true,
}) => {
  const [activeLines, setActiveLines] = useState({
    sales: true,
    revenue: true,
    profit: true,
    visitors: false
  });
  const [zoomDomain, setZoomDomain] = useState<{ startIndex: number; endIndex: number } | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const toggleLine = (lineKey: keyof typeof activeLines) => {
    setActiveLines(prev => ({
      ...prev,
      [lineKey]: !prev[lineKey]
    }));
  };

  const resetZoom = () => {
    setZoomDomain(null);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{`Period: ${label}`}</p>
          {payload
            .filter((pld: any) => activeLines[pld.dataKey as keyof typeof activeLines])
            .map((pld: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <span style={{ color: pld.color }} className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: pld.color }}></span>
                {pld.dataKey}:
              </span>
              <span className="font-bold ml-2">
                {pld.dataKey === 'visitors' ? pld.value.toLocaleString() : `$${pld.value.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!hoveredPoint || payload.name !== hoveredPoint) return null;
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        fill="#fff" 
        stroke="#3B82F6" 
        strokeWidth={2}
        className="animate-pulse"
      />
    );
  };

  const onBrushChange = (domain: any) => {
    if (domain && domain.startIndex !== undefined && domain.endIndex !== undefined) {
      setZoomDomain({ startIndex: domain.startIndex, endIndex: domain.endIndex });
    }
  };

  const displayData = zoomDomain 
    ? data.slice(zoomDomain.startIndex, zoomDomain.endIndex + 1)
    : data;

  const getStatistics = (key: keyof LineData) => {
    if (key === 'name') return { min: 0, max: 0, avg: 0, trend: 0 };
    
    const values = data.map(d => d[key] as number);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    
    // Calculate simple trend (last value vs first value)
    const trend = ((values[values.length - 1] - values[0]) / values[0]) * 100;
    
    return { min, max, avg, trend };
  };

  // Calculate adaptive dimensions based on content complexity
  const getAdaptiveDimensions = () => {
    const dataComplexity = Math.min(data.length / 12, 1); // Normalize data density (12 months = full complexity)
    const activeLineCount = Object.values(activeLines).filter(Boolean).length;
    const hasMultipleSections = showStatistics || showToggles || showBrush;
    
    let containerHeight: number;
    let containerPadding: string;
    let chartAreaHeight: string;
    let titleSize: string;
    let spacing: string;
    let gridColumns: string;
    
    if (height) {
      // Use provided height and calculate sections accordingly
      containerHeight = height;
      const availableChartHeight = height - (hasMultipleSections ? 200 : 80);
      chartAreaHeight = `${Math.max(availableChartHeight, 200)}px`;
      containerPadding = height > 500 ? 'p-6' : height > 300 ? 'p-4' : 'p-3';
      titleSize = height > 400 ? 'text-lg' : 'text-base';
      spacing = height > 400 ? 'space-x-3' : 'space-x-2';
      gridColumns = height > 500 ? 'grid-cols-4' : 'grid-cols-2';
    } else if (size === 'small' || compact) {
      const baseHeight = 280;
      const featureBonus = hasMultipleSections ? 120 : 60;
      containerHeight = baseHeight + featureBonus;
      chartAreaHeight = '200px';
      containerPadding = 'p-3';
      titleSize = 'text-sm';
      spacing = 'space-x-1';
      gridColumns = 'grid-cols-2';
    } else if (size === 'large') {
      const baseHeight = 500;
      const complexityBonus = Math.floor(dataComplexity * 100);
      const lineBonus = activeLineCount * 20;
      containerHeight = baseHeight + complexityBonus + lineBonus;
      chartAreaHeight = '400px';
      containerPadding = 'p-6';
      titleSize = 'text-xl';
      spacing = 'space-x-3';
      gridColumns = 'grid-cols-4';
    } else if (size === 'medium') {
      const baseHeight = 400;
      const complexityBonus = Math.floor(dataComplexity * 60);
      const lineBonus = activeLineCount * 15;
      containerHeight = baseHeight + complexityBonus + lineBonus;
      chartAreaHeight = '320px';
      containerPadding = 'p-4';
      titleSize = 'text-lg';
      spacing = 'space-x-2';
      gridColumns = 'grid-cols-3';
    } else {
      // Auto sizing based on content complexity
      const baseHeight = 350;
      const dataBonus = Math.floor(dataComplexity * 80);
      const lineBonus = activeLineCount * 18;
      const featureBonus = hasMultipleSections ? 150 : 80;
      
      containerHeight = baseHeight + dataBonus + lineBonus + featureBonus;
      chartAreaHeight = `${Math.max(250 + dataBonus + lineBonus, 250)}px`;
      containerPadding = containerHeight > 450 ? 'p-6' : 'p-4';
      titleSize = containerHeight > 450 ? 'text-lg' : 'text-base';
      spacing = containerHeight > 450 ? 'space-x-2' : 'space-x-1';
      gridColumns = containerHeight > 500 ? 'grid-cols-4' : activeLineCount > 2 ? 'grid-cols-3' : 'grid-cols-2';
    }
    
    return {
      containerHeight: Math.max(containerHeight, compact ? 250 : 320),
      containerPadding,
      chartAreaHeight,
      titleSize,
      spacing,
      gridColumns,
      showCompactToggles: containerHeight < 350,
      fontSize: containerHeight < 350 ? 'text-xs' : 'text-sm',
      marginBottomChart: containerHeight < 400 ? 'mb-2' : 'mb-4',
      showDetailedStats: containerHeight > 450 && activeLineCount <= 3,
    };
  };

  const dimensions = getAdaptiveDimensions();

  return (
    <div 
      className={`bg-white ${dimensions.containerPadding} rounded-lg shadow-lg h-full flex flex-col`}
      style={{ height: `${dimensions.containerHeight}px` }}
    >
      <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center ${dimensions.marginBottomChart} gap-2 flex-shrink-0`}>
        <div className="flex items-center ${dimensions.spacing}">
          <h3 className={`${dimensions.titleSize} font-semibold truncate`}>{title}</h3>
        </div>
        <div className={`flex items-center ${dimensions.spacing} justify-end`}>
          {zoomDomain && showBrush && (
            <button
              onClick={resetZoom}
              className={`px-2 py-1 ${dimensions.fontSize} bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors`}
            >
              Reset Zoom
            </button>
          )}
          <span className={`${dimensions.fontSize} text-gray-500 whitespace-nowrap`}>
            {zoomDomain ? `${displayData.length} of ${data.length} periods` : `${data.length} periods`}
          </span>
        </div>
      </div>

      {/* Line toggles - Enhanced responsive design */}
      {showToggles && (
        <div className={`flex flex-wrap gap-1 ${dimensions.marginBottomChart} p-2 bg-gray-50 rounded-lg flex-shrink-0`}>
          {Object.entries(activeLines).map(([key, isActive]) => (
            <button
              key={key}
              onClick={() => toggleLine(key as keyof typeof activeLines)}
              className={`px-2 py-1 ${dimensions.fontSize} rounded transition-all ${
                isActive 
                  ? 'bg-blue-100 text-blue-800 shadow-sm' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                key === 'sales' ? 'bg-blue-500' :
                key === 'revenue' ? 'bg-green-500' :
                key === 'profit' ? 'bg-orange-500' :
                'bg-purple-500'
              }`}></span>
              <span className={dimensions.showCompactToggles ? 'hidden' : 'inline'}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <span className={dimensions.showCompactToggles ? 'inline' : 'hidden'}>
                {key.charAt(0).toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Chart Area - Adaptive sizing */}
      <div className="flex-1 min-h-0" style={{ height: dimensions.chartAreaHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={displayData}
            margin={{ 
              top: 5, 
              right: compact ? 10 : 15, 
              left: compact ? 5 : 10, 
              bottom: showBrush ? 40 : 20 
            }}
            onMouseMove={(e: any) => {
              if (e && e.activeLabel) {
                setHoveredPoint(e.activeLabel);
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#666"
              fontSize={compact ? 8 : 10}
              interval={compact ? 1 : 0}
            />
            <YAxis 
              yAxisId="left"
              stroke="#666"
              fontSize={compact ? 8 : 10}
              width={compact ? 30 : 40}
              tickFormatter={(value) => 
                value >= 1000 ? `$${(value/1000).toFixed(0)}k` : `$${value}`
              }
            />
            {/* Add separate Y-axis for visitors when it's active */}
            {activeLines.visitors && (
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#8B5CF6"
                fontSize={compact ? 8 : 10}
                width={compact ? 30 : 40}
                tickFormatter={(value) => 
                  value >= 1000 ? `${(value/1000).toFixed(0)}k` : value.toString()
                }
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            {!compact && <Legend wrapperStyle={{ fontSize: dimensions.fontSize === 'text-xs' ? '10px' : '11px' }} />}
            
            {/* Render lines based on active state */}
            {activeLines.sales && (
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3B82F6"
                strokeWidth={compact ? 1.5 : 2}
                name="Sales"
                dot={compact ? false : <CustomDot />}
                activeDot={{ r: compact ? 3 : 4, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
                animationDuration={1000}
                yAxisId="left"
              />
            )}
            
            {activeLines.revenue && (
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981"
                strokeWidth={compact ? 1.5 : 2}
                name="Revenue"
                dot={compact ? false : <CustomDot />}
                activeDot={{ r: compact ? 3 : 4, stroke: '#10B981', strokeWidth: 2, fill: '#ffffff' }}
                animationDuration={1200}
                yAxisId="left"
              />
            )}
            
            {activeLines.profit && (
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#F59E0B"
                strokeWidth={compact ? 1.5 : 2}
                name="Profit"
                dot={compact ? false : <CustomDot />}
                activeDot={{ r: compact ? 3 : 4, stroke: '#F59E0B', strokeWidth: 2, fill: '#ffffff' }}
                animationDuration={1400}
                yAxisId="left"
              />
            )}
            
            {activeLines.visitors && (
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#8B5CF6"
                strokeWidth={compact ? 1.5 : 2}
                name="Visitors"
                dot={compact ? false : <CustomDot />}
                activeDot={{ r: compact ? 3 : 4, stroke: '#8B5CF6', strokeWidth: 2, fill: '#ffffff' }}
                animationDuration={1600}
                yAxisId="right"
              />
            )}

            {/* Brush for zooming - Only show if enabled and not compact */}
            {showBrush && !compact && (
              <Brush 
                dataKey="name" 
                height={25} 
                stroke="#8884d8"
                onChange={onBrushChange}
              />
            )}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics panel - Enhanced responsive layout */}
      {showStatistics && (
        <div className={`mt-3 grid ${dimensions.gridColumns} gap-2 flex-shrink-0`}>
          {Object.entries(activeLines)
            .filter(([_, isActive]) => isActive)
            .map(([key]) => {
              const stats = getStatistics(key as keyof LineData);
              const isVisitors = key === 'visitors';
              
              return (
                <div key={key} className="bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center mb-1">
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      key === 'sales' ? 'bg-blue-500' :
                      key === 'revenue' ? 'bg-green-500' :
                      key === 'profit' ? 'bg-orange-500' :
                      'bg-purple-500'
                    }`}></div>
                    <span className={`font-medium ${dimensions.fontSize} capitalize truncate`}>{key}</span>
                  </div>
                  
                  <div className={`space-y-0.5 ${dimensions.fontSize}`}>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max:</span>
                      <span className="font-bold">
                        {isVisitors ? 
                          (stats.max >= 1000 ? `${(stats.max/1000).toFixed(0)}k` : stats.max.toLocaleString()) : 
                          (stats.max >= 1000 ? `$${(stats.max/1000).toFixed(0)}k` : `$${stats.max.toLocaleString()}`)
                        }
                      </span>
                    </div>
                    {dimensions.showDetailedStats && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg:</span>
                        <span className="font-bold">
                          {isVisitors ? 
                            (stats.avg >= 1000 ? `${(stats.avg/1000).toFixed(0)}k` : Math.round(stats.avg).toLocaleString()) : 
                            (stats.avg >= 1000 ? `$${(stats.avg/1000).toFixed(0)}k` : `$${Math.round(stats.avg).toLocaleString()}`)
                          }
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trend:</span>
                      <span className={`font-bold ${stats.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.trend >= 0 ? '↗' : '↘'} {Math.abs(stats.trend).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Instructions - Only show if enabled and not compact */}
      {showInstructions && !compact && (
        <div className={`mt-2 ${dimensions.fontSize} text-gray-500 text-center`}>
          {showBrush ? 'Use brush at bottom to zoom • ' : ''}Toggle lines above • Hover for details{showBrush ? ' • Click reset to zoom out' : ''}
        </div>
      )}
    </div>
  );
};

export default LineChart;