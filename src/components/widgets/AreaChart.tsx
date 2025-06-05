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
}

const AreaChart: React.FC<AreaChartProps> = ({ 
  data = mockData, 
  title = 'Website Analytics Trends',
  showDots = true,
  stackedMode = false
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
        <div className={`p-4 border rounded-lg shadow-lg ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600 text-white' 
            : 'bg-white border-gray-200 text-gray-800'
        }`}>
          <p className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {`Month: ${label}`}
          </p>
          <div className="space-y-2">
            {payload
              .filter((item: any) => !hiddenAreas.has(item.dataKey))
              .map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.name}:</span>
                  </div>
                  <span className="font-bold ml-4">
                    {item.value?.toLocaleString() || '0'}
                  </span>
                </div>
              ))}
          </div>
          <div className={`mt-3 pt-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
            <div className={`flex justify-between text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Total Interactions:</span>
              <span className="font-semibold">
                {payload.filter((item: any) => !hiddenAreas.has(item.dataKey))
                  .reduce((sum: number, item: any) => sum + (item.value || 0), 0)
                  .toLocaleString()}
              </span>
            </div>
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
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <CustomLegend />
        <div className="flex space-x-2">
          <button
            onClick={() => setLocalStackedMode(!localStackedMode)}
            className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
              localStackedMode 
                ? 'bg-blue-100 text-blue-700 border-blue-300' 
                : isDarkMode
                  ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {localStackedMode ? 'Stacked' : 'Overlayed'}
          </button>
          <button
            onClick={() => setLocalShowDots(!localShowDots)}
            className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
              localShowDots 
                ? 'bg-green-100 text-green-700 border-green-300' 
                : isDarkMode
                  ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {localShowDots ? 'Dots On' : 'Dots Off'}
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
              fontSize={12}
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#666' }}
            />
            <YAxis 
              stroke={isDarkMode ? '#9CA3AF' : '#666'}
              fontSize={12}
              tickFormatter={formatYAxisTick}
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#666' }}
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
                  strokeWidth={isActive ? 3 : 2}
                  fill={`url(#gradient${area.dataKey})`}
                  fillOpacity={isActive ? 1 : 0.8}
                  dot={localShowDots ? { 
                    fill: area.color, 
                    strokeWidth: 2, 
                    stroke: '#fff',
                    r: isActive ? 5 : 3,
                    filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'
                  } : false}
                  activeDot={localShowDots ? { 
                    r: 6, 
                    fill: area.color,
                    stroke: '#fff',
                    strokeWidth: 3,
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))'
                  } : undefined}
                  animationDuration={1000 + index * 200}
                  animationEasing="ease-out"
                />
              );
            })}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {areas.map((area) => {
          if (hiddenAreas.has(area.dataKey)) return null;
          
          const values = data.map(d => d[area.dataKey as keyof AreaData] as number);
          const total = values.reduce((sum, val) => sum + val, 0);
          const average = total / values.length;
          const growth = ((values[values.length - 1] - values[0]) / values[0] * 100);
          
          return (
            <div key={area.dataKey} className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center mb-2">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: area.color }}
                ></div>
                <h4 className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>{area.name}</h4>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-bold">{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average:</span>
                  <span className="font-bold">{Math.round(average).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Growth:</span>
                  <span className={`font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls hint */}
      <div className={`mt-4 text-xs text-center ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        Click legend items to toggle areas • Use mode buttons to change visualization • Hover for details
      </div>
    </div>
  );
};

export default AreaChart;