import React, { useState } from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';

interface AreaData {
  month: string;
  users: number;
  sessions: number;
  pageViews: number;
  conversions: number;
}

const mockData: AreaData[] = [
  { month: 'Jan', users: 4000, sessions: 6200, pageViews: 12400, conversions: 400 },
  { month: 'Feb', users: 3500, sessions: 5800, pageViews: 11600, conversions: 350 },
  { month: 'Mar', users: 5200, sessions: 8100, pageViews: 16200, conversions: 520 },
  { month: 'Apr', users: 4800, sessions: 7500, pageViews: 15000, conversions: 480 },
  { month: 'May', users: 6100, sessions: 9300, pageViews: 18600, conversions: 610 },
  { month: 'Jun', users: 5700, sessions: 8800, pageViews: 17600, conversions: 570 },
  { month: 'Jul', users: 6800, sessions: 10200, pageViews: 20400, conversions: 680 },
  { month: 'Aug', users: 7200, sessions: 11000, pageViews: 22000, conversions: 720 },
  { month: 'Sep', users: 6900, sessions: 10500, pageViews: 21000, conversions: 690 },
  { month: 'Oct', users: 7800, sessions: 11800, pageViews: 23600, conversions: 780 },
  { month: 'Nov', users: 8200, sessions: 12400, pageViews: 24800, conversions: 820 },
  { month: 'Dec', users: 8900, sessions: 13500, pageViews: 27000, conversions: 890 },
];

interface AreaChartProps {
  data?: AreaData[];
  title?: string;
  showDots?: boolean;
  stackedMode?: boolean;
  compact?: boolean;
  height?: number;
  size?: 'small' | 'medium' | 'large' | 'auto'; // New size prop for better control
}

const AreaChart: React.FC<AreaChartProps> = ({ 
  data = mockData, 
  title = 'Website Analytics Trends',
  showDots = true,
  stackedMode = false,
  compact = false,
  height,
  size = 'auto'
}) => {
  const { isDarkMode } = useDarkMode();
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [hiddenAreas, setHiddenAreas] = useState<Set<string>>(new Set());
  const [zoomDomain, setZoomDomain] = useState<any>(null);
  const [localStackedMode, setLocalStackedMode] = useState(stackedMode);
  const [localShowDots, setLocalShowDots] = useState(showDots);

  const areas = [
    { dataKey: 'users', color: '#3B82F6', name: 'Users', opacity: 0.8 },
    { dataKey: 'sessions', color: '#10B981', name: 'Sessions', opacity: 0.7 },
    { dataKey: 'pageViews', color: '#F59E0B', name: 'Page Views', opacity: 0.6 },
    { dataKey: 'conversions', color: '#EF4444', name: 'Conversions', opacity: 0.9 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className={`p-3 border rounded-lg shadow-lg ${compact ? 'text-xs' : 'text-sm'} ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600 text-white' 
            : 'bg-white border-gray-200 text-gray-800'
        }`}>
          <p className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {`${label}`}
          </p>
          <div className="space-y-1">
            {payload
              .filter((item: any) => !hiddenAreas.has(item.dataKey))
              .slice(0, compact ? 2 : 4)
              .map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="truncate">{compact ? item.name.split(' ')[0] : item.name}:</span>
                  </div>
                  <span className="font-bold ml-2">
                    {compact && item.value >= 1000 
                      ? `${(item.value / 1000).toFixed(1)}k`
                      : item.value?.toLocaleString() || '0'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const onAreaMouseEnter = (data: any) => {
    setActiveArea(data);
  };

  const onAreaMouseLeave = () => {
    setActiveArea(null);
  };

  const toggleArea = (dataKey: string) => {
    const newHiddenAreas = new Set(hiddenAreas);
    if (newHiddenAreas.has(dataKey)) {
      newHiddenAreas.delete(dataKey);
    } else {
      newHiddenAreas.add(dataKey);
    }
    setHiddenAreas(newHiddenAreas);
  };

  const resetZoom = () => {
    setZoomDomain(null);
  };

  const CustomLegend = () => {
    if (compact) {
      return (
        <div className="flex flex-wrap justify-center gap-1 mb-3">
          {areas.slice(0, 3).map((area) => {
            const isHidden = hiddenAreas.has(area.dataKey);
            
            return (
              <button
                key={area.dataKey}
                onClick={() => toggleArea(area.dataKey)}
                className={`flex items-center px-2 py-1 rounded text-xs transition-all ${
                  isHidden 
                    ? 'opacity-50' 
                    : isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: area.color }}
                ></div>
                <span className={isHidden ? 'line-through' : ''}>{area.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {areas.map((area) => {
          const isHidden = hiddenAreas.has(area.dataKey);
          const isActive = activeArea === area.dataKey;
          
          return (
            <button
              key={area.dataKey}
              onClick={() => toggleArea(area.dataKey)}
              onMouseEnter={() => setActiveArea(area.dataKey)}
              onMouseLeave={() => setActiveArea(null)}
              className={`flex items-center px-3 py-2 rounded-lg border transition-all ${
                isHidden 
                  ? isDarkMode 
                    ? 'bg-gray-700 border-gray-600 opacity-50' 
                    : 'bg-gray-100 border-gray-300 opacity-50'
                  : isActive
                    ? isDarkMode 
                      ? 'bg-blue-900 border-blue-700 shadow-md' 
                      : 'bg-blue-50 border-blue-300 shadow-md'
                    : isDarkMode
                      ? 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div 
                className={`w-3 h-3 rounded-full mr-2 ${isHidden ? 'opacity-30' : ''}`}
                style={{ backgroundColor: area.color }}
              ></div>
              <span className={`text-sm ${
                isHidden 
                  ? isDarkMode ? 'line-through text-gray-500' : 'line-through text-gray-400'
                  : 'font-medium'
              }`}>
                {area.name}
              </span>
            </button>
          );
        })}
        {zoomDomain && (
          <button
            onClick={resetZoom}
            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg border border-red-300 text-sm hover:bg-red-200 transition-colors"
          >
            Reset Zoom
          </button>
        )}
      </div>
    );
  };

  const formatYAxisTick = (value: number) => {
    if (compact && value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  // Calculate adaptive dimensions based on content
  const getAdaptiveDimensions = () => {
    const dataPoints = data.length;
    const visibleAreas = areas.filter(area => !hiddenAreas.has(area.dataKey)).length;
    
    // Base dimensions
    let chartHeight: number;
    let containerMinHeight: number;
    
    if (height) {
      // Use provided height if specified
      chartHeight = height;
      containerMinHeight = height + 100; // Add space for controls
    } else if (size === 'small' || compact) {
      chartHeight = 200;
      containerMinHeight = 280;
    } else if (size === 'large') {
      chartHeight = Math.max(400, dataPoints * 15 + visibleAreas * 20);
      containerMinHeight = chartHeight + 150;
    } else if (size === 'medium') {
      chartHeight = Math.max(300, dataPoints * 10 + visibleAreas * 15);
      containerMinHeight = chartHeight + 120;
    } else {
      // Auto sizing based on content complexity
      const baseHeight = 280;
      const dataComplexity = Math.min(dataPoints * 8, 80); // Max 80px for data
      const areaComplexity = Math.min(visibleAreas * 25, 100); // Max 100px for areas
      
      chartHeight = baseHeight + dataComplexity + areaComplexity;
      containerMinHeight = chartHeight + (compact ? 80 : 140);
    }
    
    return {
      chartHeight: Math.max(chartHeight, compact ? 180 : 250),
      containerMinHeight: Math.max(containerMinHeight, compact ? 260 : 390),
      chartWidth: '100%'
    };
  };

  const dimensions = getAdaptiveDimensions();

  return (
    <div className={`${compact ? 'p-2 sm:p-3' : 'p-4 sm:p-6'} rounded-lg shadow-sm border flex flex-col ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`} style={{ 
      minHeight: `${dimensions.containerMinHeight}px`,
      height: size === 'large' ? `${dimensions.containerMinHeight}px` : 'auto'
    }}>
      <div className="flex justify-between items-start mb-2 sm:mb-3 flex-shrink-0 gap-2">
        <h3 className={`${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-lg'} font-semibold flex-1 min-w-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        {!compact && (
          <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={() => setLocalStackedMode(!localStackedMode)}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                localStackedMode 
                  ? 'bg-blue-100 text-blue-700 border-blue-300' 
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {localStackedMode ? 'Stacked' : 'Overlay'}
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 mb-2">
        <CustomLegend />
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 w-full" style={{ height: `${dimensions.chartHeight}px` }}>
        <ResponsiveContainer width={dimensions.chartWidth} height={dimensions.chartHeight}>
          <RechartsAreaChart
            data={data}
            margin={{ 
              top: compact ? 5 : 10, 
              right: compact ? 8 : 15, 
              left: compact ? 5 : 10, 
              bottom: compact ? 5 : 10 
            }}
            onMouseEnter={onAreaMouseEnter}
            onMouseLeave={onAreaMouseLeave}
          >
            <defs>
              {areas.map((area) => (
                <linearGradient key={area.dataKey} id={`gradient${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={area.color} stopOpacity={area.opacity} />
                  <stop offset="95%" stopColor={area.color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#374151' : '#f0f0f0'} 
            />
            <XAxis 
              dataKey="month" 
              stroke={isDarkMode ? '#9CA3AF' : '#666'}
              fontSize={compact ? 10 : 12}
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#666' }}
              interval={compact ? 1 : 0}
            />
            <YAxis 
              stroke={isDarkMode ? '#9CA3AF' : '#666'}
              fontSize={compact ? 10 : 12}
              tickFormatter={formatYAxisTick}
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#666' }}
              width={compact ? 40 : 60}
            />
            <Tooltip content={<CustomTooltip />} />

            {areas.map((area, index) => {
              if (hiddenAreas.has(area.dataKey)) return null;
              
              const isActive = activeArea === area.dataKey;
              
              return (
                <Area
                  key={area.dataKey}
                  type="monotone"
                  dataKey={area.dataKey}
                  stackId={localStackedMode ? "1" : area.dataKey}
                  stroke={area.color}
                  strokeWidth={isActive ? 3 : compact ? 1.5 : 2}
                  fill={`url(#gradient${area.dataKey})`}
                  fillOpacity={isActive ? 1 : 0.8}
                  dot={!compact && localShowDots ? { 
                    fill: area.color, 
                    strokeWidth: 2, 
                    stroke: '#fff',
                    r: isActive ? 5 : 3,
                    filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'
                  } : false}
                  activeDot={!compact && localShowDots ? { 
                    r: 6, 
                    fill: area.color,
                    stroke: '#fff',
                    strokeWidth: 3,
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))'
                  } : undefined}
                  animationDuration={compact ? 500 : 1000 + index * 200}
                  animationEasing="ease-out"
                />
              );
            })}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Summary - Conditional display */}
      {!compact && (
        <div className="mt-2 sm:mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 flex-shrink-0">
          {areas.slice(0, 4).map((area) => {
            if (hiddenAreas.has(area.dataKey)) return null;
            
            const values = data.map(d => d[area.dataKey as keyof AreaData] as number);
            const total = values.reduce((sum, val) => sum + val, 0);
            const average = total / values.length;
            const growth = ((values[values.length - 1] - values[0]) / values[0] * 100);
            
            return (
              <div key={area.dataKey} className={`p-2 sm:p-3 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center mb-1 sm:mb-2 gap-1">
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: area.color }}
                  ></div>
                  <h4 className={`text-xs font-medium truncate ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{area.name}</h4>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Total:</span>
                    <span className="font-bold text-xs">{(total/1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Growth:</span>
                    <span className={`font-bold text-xs ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {growth >= 0 ? '+' : ''}{growth.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Controls hint - Only for non-compact mode */}
      {!compact && (
        <div className={`mt-2 sm:mt-3 text-xs text-center ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Click legend items to toggle areas • Hover for details
        </div>
      )}
    </div>
  );
};

export default AreaChart;