import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
}

const BarChart: React.FC<BarChartProps> = ({ 
  data = mockData, 
  title = 'Monthly Sales Performance' 
}) => {

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{`Month: ${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <span style={{ color: pld.color }}>{pld.dataKey}:</span>
              <span className="font-bold ml-2">${pld.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const onBarMouseEnter = (_data: any) => {
    // Could be used for future highlighting functionality
  };

  const onBarMouseLeave = () => {
    // Could be used for future highlighting functionality
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onMouseEnter={onBarMouseEnter}
            onMouseLeave={onBarMouseLeave}
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
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="sales" 
              fill="#3B82F6" 
              name="Sales"
              radius={[2, 2, 0, 0]}
              animationDuration={1000}
            />
            <Bar 
              dataKey="revenue" 
              fill="#10B981" 
              name="Revenue"
              radius={[2, 2, 0, 0]}
              animationDuration={1200}
            />
            <Bar 
              dataKey="profit" 
              fill="#F59E0B" 
              name="Profit"
              radius={[2, 2, 0, 0]}
              animationDuration={1400}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>Total Sales: ${data.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span>Total Revenue: ${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BarChart;