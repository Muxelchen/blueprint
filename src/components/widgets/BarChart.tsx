import React, { useState, useCallback, useMemo, memo } from 'react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Download, Eye, RotateCcw } from 'lucide-react';

interface BarData {
  name: string;
  sales: number;
  revenue: number;
  profit: number;
}

const mockData: BarData[] = [
  { name: 'Jan', sales: 4000, revenue: 2400, profit: 1200 },
  { name: 'Feb', sales: 3000, revenue: 1398, profit: 800 },
  { name: 'Mar', sales: 2000, revenue: 9800, profit: 2400 },
  { name: 'Apr', sales: 2780, revenue: 3908, profit: 1500 },
  { name: 'May', sales: 1890, revenue: 4800, profit: 2100 },
  { name: 'Jun', sales: 2390, revenue: 3800, profit: 1800 },
  { name: 'Jul', sales: 3490, revenue: 4300, profit: 2200 },
];

interface BarChartProps {
  data?: BarData[];
  title?: string;
  showControls?: boolean;
  className?: string;
}

const MemoizedTooltip = memo(({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">{`${label}`}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm">{item.name}:</span>
            </div>
            <span className="font-bold ml-4">${item.value?.toLocaleString() || '0'}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
});

MemoizedTooltip.displayName = 'MemoizedTooltip';

const MemoizedStatisticsPanel = memo(({ 
  data, 
  isChartHovered, 
  statistics 
}: { 
  data: BarData[], 
  isChartHovered: boolean,
  statistics: any
}) => (
  <div className={`mt-6 p-4 rounded-lg transition-all duration-300 ${
    isChartHovered ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
  }`}>
    <div className="flex items-center justify-between mb-3">
      <h4 className={`text-sm font-medium transition-colors duration-300 ${
        isChartHovered ? 'text-blue-800' : 'text-gray-700'
      }`}>Performance Summary</h4>
      <TrendingUp className={`w-4 h-4 transition-all duration-300 ${
        isChartHovered ? 'text-blue-500 animate-pulse' : 'text-gray-500'
      }`} />
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
      <div className={`transition-all duration-300 p-2 rounded ${
        isChartHovered ? 'transform scale-105 bg-white shadow-sm' : ''
      }`}>
        <p className={`font-bold text-lg transition-colors duration-300 ${
          isChartHovered ? 'text-blue-600' : 'text-green-600'
        }`}>
          ${statistics?.sales?.sum?.toLocaleString() || data.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
        </p>
        <p className={`transition-colors duration-300 ${
          isChartHovered ? 'text-blue-700' : 'text-gray-600'
        }`}>Total Sales</p>
      </div>
      
      <div className={`transition-all duration-300 p-2 rounded ${
        isChartHovered ? 'transform scale-105 bg-white shadow-sm' : ''
      }`}>
        <p className={`font-bold text-lg transition-colors duration-300 ${
          isChartHovered ? 'text-blue-600' : 'text-green-600'
        }`}>
          ${statistics?.revenue?.sum?.toLocaleString() || data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
        </p>
        <p className={`transition-colors duration-300 ${
          isChartHovered ? 'text-blue-700' : 'text-gray-600'
        }`}>Total Revenue</p>
      </div>
      
      <div className={`transition-all duration-300 p-2 rounded ${
        isChartHovered ? 'transform scale-105 bg-white shadow-sm' : ''
      }`}>
        <p className={`font-bold text-lg transition-colors duration-300 ${
          isChartHovered ? 'text-blue-600' : 'text-gray-800'
        }`}>
          ${Math.round(statistics?.sales?.avg || data.reduce((sum, item) => sum + item.sales, 0) / data.length).toLocaleString()}
        </p>
        <p className={`transition-colors duration-300 ${
          isChartHovered ? 'text-blue-700' : 'text-gray-600'
        }`}>Avg Sales</p>
      </div>
      
      <div className={`transition-all duration-300 p-2 rounded ${
        isChartHovered ? 'transform scale-105 bg-white shadow-sm' : ''
      }`}>
        <p className={`font-bold text-lg transition-colors duration-300 ${
          isChartHovered ? 'text-blue-600' : 'text-purple-600'
        }`}>
          ${statistics?.profit?.sum?.toLocaleString() || data.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}
        </p>
        <p className={`transition-colors duration-300 ${
          isChartHovered ? 'text-blue-700' : 'text-gray-600'
        }`}>Total Profit</p>
      </div>
    </div>
  </div>
));

MemoizedStatisticsPanel.displayName = 'MemoizedStatisticsPanel';

export const BarChart: React.FC<BarChartProps> = memo(({ 
  data = mockData, 
  title = "Monthly Performance", 
  showControls = true,
  className = ""
}) => {
  const [isChartHovered, setIsChartHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const statistics = useMemo(() => {
    const sales = data.map(d => d.sales);
    const revenue = data.map(d => d.revenue);
    const profit = data.map(d => d.profit);
    
    return {
      sales: {
        sum: sales.reduce((a, b) => a + b, 0),
        avg: sales.reduce((a, b) => a + b, 0) / sales.length,
        max: Math.max(...sales),
        min: Math.min(...sales)
      },
      revenue: {
        sum: revenue.reduce((a, b) => a + b, 0),
        avg: revenue.reduce((a, b) => a + b, 0) / revenue.length,
        max: Math.max(...revenue),
        min: Math.min(...revenue)
      },
      profit: {
        sum: profit.reduce((a, b) => a + b, 0),
        avg: profit.reduce((a, b) => a + b, 0) / profit.length,
        max: Math.max(...profit),
        min: Math.min(...profit)
      }
    };
  }, [data]);

  const handleExport = useCallback(() => {
    const csvContent = [
      ['Month', 'Sales', 'Revenue', 'Profit'],
      ...data.map(item => [item.name, item.sales, item.revenue, item.profit])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bar-chart-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  const handleReset = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  if (!isVisible) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {showControls && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="Toggle visibility"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
              title="Export data"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
              title="Reset chart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div 
        className="h-64"
        onMouseEnter={() => setIsChartHovered(true)}
        onMouseLeave={() => setIsChartHovered(false)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<MemoizedTooltip />} />
            <Legend />
            <Bar 
              dataKey="sales" 
              fill="#3b82f6" 
              name="Sales"
              radius={[2, 2, 0, 0]}
              className="transition-all duration-300 hover:opacity-80"
            />
            <Bar 
              dataKey="revenue" 
              fill="#10b981" 
              name="Revenue"
              radius={[2, 2, 0, 0]}
              className="transition-all duration-300 hover:opacity-80"
            />
            <Bar 
              dataKey="profit" 
              fill="#8b5cf6" 
              name="Profit"
              radius={[2, 2, 0, 0]}
              className="transition-all duration-300 hover:opacity-80"
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      <MemoizedStatisticsPanel 
        data={data} 
        isChartHovered={isChartHovered} 
        statistics={statistics}
      />
    </div>
  );
});

BarChart.displayName = 'BarChart';

export default BarChart;