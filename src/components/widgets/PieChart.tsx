import React, { useState } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieData {
  name: string;
  value: number;
  color: string;
  category: string;
}

const mockData: PieData[] = [
  { name: 'Product Sales', value: 35, color: '#3B82F6', category: 'Revenue' },
  { name: 'Service Revenue', value: 25, color: '#10B981', category: 'Revenue' },
  { name: 'Subscriptions', value: 20, color: '#F59E0B', category: 'Revenue' },
  { name: 'Licensing', value: 12, color: '#EF4444', category: 'Revenue' },
  { name: 'Partnerships', value: 8, color: '#8B5CF6', category: 'Revenue' },
];

interface PieChartProps {
  data?: PieData[];
  title?: string;
}

const PieChart: React.FC<PieChartProps> = ({ 
  data = mockData, 
  title = 'Revenue Distribution'
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  const total = data.reduce((sum, item) => sum + item.value, 0);

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
              <span className="font-bold">{data.value}%</span>
            </div>
            <div className="flex justify-between">
              <span>Category:</span>
              <span className="font-medium">{data.payload.category}</span>
            </div>
            <div className="flex justify-between">
              <span>Share:</span>
              <span className="font-bold">{percentage}% of total</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
    setSelectedSegment(data[index].name);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
    setSelectedSegment(null);
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
        fontSize="12"
        fontWeight="bold"
        className="drop-shadow-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => {
          const isSelected = selectedSegment === entry.value;
          const percentage = ((data[index].value / total) * 100).toFixed(1);
          
          return (
            <div 
              key={entry.value}
              className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${
                isSelected ? 'bg-gray-100 scale-105 shadow-md' : 'hover:bg-gray-50'
              }`}
              onMouseEnter={() => {
                setActiveIndex(index);
                setSelectedSegment(entry.value);
              }}
              onMouseLeave={() => {
                setActiveIndex(null);
                setSelectedSegment(null);
              }}
            >
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm font-medium">{entry.value}</span>
              <span className="text-xs text-gray-600 ml-1">({percentage}%)</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={<CustomLabel />}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationDuration={1500}
              animationEasing="ease-out"
              onAnimationEnd={() => setAnimationComplete(true)}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke={activeIndex === index ? '#ffffff' : 'none'}
                  strokeWidth={activeIndex === index ? 3 : 0}
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
            <Legend content={<CustomLegend />} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Segments:</span>
              <span className="font-bold">{data.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Value:</span>
              <span className="font-bold">{total}%</span>
            </div>
            <div className="flex justify-between">
              <span>Average:</span>
              <span className="font-bold">{(total / data.length).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Largest Segment</h4>
          <div className="space-y-2 text-sm">
            {(() => {
              const largest = data.reduce((max, item) => item.value > max.value ? item : max, data[0]);
              const percentage = ((largest.value / total) * 100).toFixed(1);
              
              return (
                <>
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: largest.color }}
                    ></div>
                    <span className="font-medium">{largest.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Value:</span>
                    <span className="font-bold">{largest.value}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Share:</span>
                    <span className="font-bold">{percentage}%</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Smallest Segment</h4>
          <div className="space-y-2 text-sm">
            {(() => {
              const smallest = data.reduce((min, item) => item.value < min.value ? item : min, data[0]);
              const percentage = ((smallest.value / total) * 100).toFixed(1);
              
              return (
                <>
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: smallest.color }}
                    ></div>
                    <span className="font-medium">{smallest.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Value:</span>
                    <span className="font-bold">{smallest.value}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Share:</span>
                    <span className="font-bold">{percentage}%</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Animation status indicator */}
      {!animationComplete && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center text-xs text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            Loading animation...
          </div>
        </div>
      )}

      {/* Interactive hints */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Hover over segments or legend items for details • Larger segments show percentages
      </div>
    </div>
  );
};

export default PieChart;