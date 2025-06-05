import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { TrendingUp, Eye, Download, RotateCcw } from 'lucide-react';

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
  showLegend?: boolean;
  showTooltip?: boolean;
  centerText?: string;
}

const PieChart: React.FC<PieChartProps> = ({ 
  data = mockData, 
  title = 'Data Distribution',
  showLegend = true,
  showTooltip = true,
  centerText = ''
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [isChartHovered, setIsChartHovered] = useState(false);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl transform transition-all duration-200 scale-105">
          <div className="flex items-center mb-2">
            <div 
              className="w-4 h-4 rounded-full mr-2 animate-pulse"
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
              <span className="font-bold text-blue-600">{percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span>of Total:</span>
              <span className="font-bold text-gray-600">{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
    setHoveredSegment(data[index]?.name || null);
    setIsChartHovered(true);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
    setHoveredSegment(null);
    setIsChartHovered(false);
  };

  const handleSegmentClick = (entry: any, index: number) => {
    setSelectedSegment(selectedSegment === entry.name ? null : entry.name);
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg border border-gray-200 transition-all duration-300 ${
      isChartHovered ? 'shadow-2xl scale-[1.02] border-blue-300' : 'hover:shadow-xl'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-lg font-semibold transition-colors duration-300 ${
          isChartHovered ? 'text-blue-600' : 'text-gray-900'
        }`}>{title}</h3>
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
            title="Toggle view"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
            title="Download chart"
          >
            <Download className="w-4 h-4" />
          </button>
          <button 
            className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 hover:scale-110"
            title="Reset view"
            onClick={() => {
              setSelectedSegment(null);
              setActiveIndex(null);
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className={`h-80 transition-all duration-500 ${isChartHovered ? 'scale-105' : ''}`}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={centerText ? 60 : 0}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              onClick={handleSegmentClick}
              animationBegin={0}
              animationDuration={1500}
              onAnimationEnd={() => setAnimationComplete(true)}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke={activeIndex === index ? '#ffffff' : 'none'}
                  strokeWidth={activeIndex === index ? 3 : 0}
                  style={{
                    filter: activeIndex === index ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none',
                    cursor: 'pointer',
                    transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {centerText && (
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-current text-lg font-bold">
                {centerText}
              </text>
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Legend with interaction */}
      {showLegend && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            const isHovered = hoveredSegment === item.name;
            const isSelected = selectedSegment === item.name;
            
            return (
              <div 
                key={item.name}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 transform ${
                  isHovered ? 'bg-blue-50 scale-105 shadow-md border-2 border-blue-200' : 
                  isSelected ? 'bg-gray-100 scale-102 shadow-sm border-2 border-gray-300' :
                  'bg-gray-50 hover:bg-gray-100 hover:scale-102'
                }`}
                onMouseEnter={() => {
                  setActiveIndex(index);
                  setHoveredSegment(item.name);
                }}
                onMouseLeave={() => {
                  setActiveIndex(null);
                  setHoveredSegment(null);
                }}
                onClick={() => handleSegmentClick(item, index)}
                style={{
                  boxShadow: isHovered ? `0 4px 20px ${item.color}30` : undefined
                }}
              >
                <div 
                  className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 transition-all duration-300 ${
                    isHovered ? 'w-5 h-5 shadow-lg animate-pulse' : ''
                  }`}
                  style={{ 
                    backgroundColor: item.color,
                    boxShadow: isHovered ? `0 0 15px ${item.color}60` : undefined
                  }}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className={`flex items-center justify-between ${isHovered ? 'text-blue-900' : ''}`}>
                    <span className={`font-medium text-sm truncate transition-colors duration-300 ${
                      isHovered ? 'text-blue-900 font-semibold' : 'text-gray-700'
                    }`}>
                      {item.name}
                    </span>
                    <span className={`text-xs font-bold ml-2 transition-all duration-300 ${
                      isHovered ? 'text-blue-600 scale-110' : 'text-gray-500'
                    }`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className={`text-xs text-gray-500 transition-all duration-300 ${
                    isHovered ? 'text-gray-700 font-medium' : ''
                  }`}>
                    {item.value.toLocaleString()} units
                  </div>
                  {isHovered && (
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="h-1 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enhanced Statistics */}
      <div className={`mt-6 p-4 rounded-lg transition-all duration-300 ${
        isChartHovered ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={`text-sm font-medium transition-colors duration-300 ${
            isChartHovered ? 'text-blue-800' : 'text-gray-700'
          }`}>Summary Statistics</h4>
          <TrendingUp className={`w-4 h-4 transition-colors duration-300 ${
            isChartHovered ? 'text-blue-500' : 'text-gray-500'
          }`} />
        </div>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className={`transition-all duration-300 ${isChartHovered ? 'transform scale-105' : ''}`}>
            <p className={`font-bold text-lg transition-colors duration-300 ${
              isChartHovered ? 'text-blue-600' : 'text-gray-800'
            }`}>
              {data.length}
            </p>
            <p className={`transition-colors duration-300 ${
              isChartHovered ? 'text-blue-700' : 'text-gray-600'
            }`}>Categories</p>
          </div>
          <div className={`transition-all duration-300 ${isChartHovered ? 'transform scale-105' : ''}`}>
            <p className={`font-bold text-lg transition-colors duration-300 ${
              isChartHovered ? 'text-blue-600' : 'text-gray-800'
            }`}>
              {total.toLocaleString()}
            </p>
            <p className={`transition-colors duration-300 ${
              isChartHovered ? 'text-blue-700' : 'text-gray-600'
            }`}>Total</p>
          </div>
          <div className={`transition-all duration-300 ${isChartHovered ? 'transform scale-105' : ''}`}>
            <p className={`font-bold text-lg transition-colors duration-300 ${
              isChartHovered ? 'text-blue-600' : 'text-gray-800'
            }`}>
              {Math.round(total / data.length).toLocaleString()}
            </p>
            <p className={`transition-colors duration-300 ${
              isChartHovered ? 'text-blue-700' : 'text-gray-600'
            }`}>Average</p>
          </div>
        </div>
      </div>

      {/* Interactive hints */}
      <div className={`mt-4 text-xs text-center transition-all duration-300 ${
        isChartHovered ? 'text-blue-600 font-medium' : 'text-gray-500'
      }`}>
        {hoveredSegment 
          ? `Hovering: ${hoveredSegment} • Click to select/deselect` 
          : "Hover over segments or legend items for details • Click to select"}
      </div>

      {/* Loading animation indicator */}
      {!animationComplete && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center text-xs text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            Loading animation...
          </div>
        </div>
      )}
    </div>
  );
};

export default PieChart;