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
}

const LineChart: React.FC<LineChartProps> = ({ 
  data = mockData, 
  title = 'Annual Performance Trends' 
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center space-x-2">
          {zoomDomain && (
            <button
              onClick={resetZoom}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
            >
              Reset Zoom
            </button>
          )}
          <span className="text-xs text-gray-500">
            {zoomDomain ? `${displayData.length} of ${data.length} periods` : `${data.length} periods`}
          </span>
        </div>
      </div>

      {/* Line toggles */}
      <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
        {Object.entries(activeLines).map(([key, isActive]) => (
          <button
            key={key}
            onClick={() => toggleLine(key as keyof typeof activeLines)}
            className={`px-3 py-1 text-xs rounded transition-all ${
              isActive 
                ? 'bg-blue-100 text-blue-800 shadow-sm' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              key === 'sales' ? 'bg-blue-500' :
              key === 'revenue' ? 'bg-green-500' :
              key === 'profit' ? 'bg-orange-500' :
              'bg-purple-500'
            }`}></span>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={displayData}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
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
              fontSize={12}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => 
                activeLines.visitors && !activeLines.sales && !activeLines.revenue && !activeLines.profit
                  ? value.toLocaleString()
                  : `$${value}`
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {activeLines.sales && (
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3B82F6"
                strokeWidth={3}
                name="Sales"
                dot={<CustomDot />}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
                animationDuration={1000}
              />
            )}
            
            {activeLines.revenue && (
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981"
                strokeWidth={3}
                name="Revenue"
                dot={<CustomDot />}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#ffffff' }}
                animationDuration={1200}
              />
            )}
            
            {activeLines.profit && (
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#F59E0B"
                strokeWidth={3}
                name="Profit"
                dot={<CustomDot />}
                activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2, fill: '#ffffff' }}
                animationDuration={1400}
              />
            )}
            
            {activeLines.visitors && (
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#8B5CF6"
                strokeWidth={3}
                name="Visitors"
                dot={<CustomDot />}
                activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: '#ffffff' }}
                animationDuration={1600}
                yAxisId="visitors"
              />
            )}

            {/* Brush for zooming */}
            <Brush 
              dataKey="name" 
              height={30} 
              stroke="#8884d8"
              onChange={onBrushChange}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics panel */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(activeLines)
          .filter(([_, isActive]) => isActive)
          .map(([key]) => {
            const stats = getStatistics(key as keyof LineData);
            const isVisitors = key === 'visitors';
            
            return (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    key === 'sales' ? 'bg-blue-500' :
                    key === 'revenue' ? 'bg-green-500' :
                    key === 'profit' ? 'bg-orange-500' :
                    'bg-purple-500'
                  }`}></div>
                  <span className="font-medium text-sm capitalize">{key}</span>
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max:</span>
                    <span className="font-bold">
                      {isVisitors ? stats.max.toLocaleString() : `$${stats.max.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg:</span>
                    <span className="font-bold">
                      {isVisitors ? Math.round(stats.avg).toLocaleString() : `$${Math.round(stats.avg).toLocaleString()}`}
                    </span>
                  </div>
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

      {/* Instructions */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Use brush at bottom to zoom • Toggle lines above • Hover for details • Click reset to zoom out
      </div>
    </div>
  );
};

export default LineChart;