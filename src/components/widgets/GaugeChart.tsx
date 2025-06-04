import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value?: number;
  maxValue?: number;
  title?: string;
  unit?: string;
  color?: string;
  animate?: boolean;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ 
  value = 75, 
  maxValue = 100,
  title = 'Performance Score',
  unit = '%',
  color = '#3B82F6',
  animate = true
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="90%"
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              animationDuration={animate ? 1500 : 0}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? dynamicColor : entry.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center value display */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ top: '20%' }}>
          <div className="text-center">
            <div className={`text-4xl font-bold transition-all duration-1000 ${
              animate ? 'scale-110' : ''
            }`} style={{ color: dynamicColor }}>
              {Math.round(animatedValue)}{unit}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              of {maxValue}{unit}
            </div>
          </div>
        </div>

        {/* Gauge markers */}
        <div className="absolute inset-0">
          {[0, 25, 50, 75, 100].map((mark) => {
            const angle = startAngle - (mark / 100) * (startAngle - endAngle);
            const x = 50 + 45 * Math.cos(angle * RADIAN);
            const y = 90 + 45 * Math.sin(angle * RADIAN);
            
            return (
              <div
                key={mark}
                className="absolute text-xs text-gray-400 font-medium"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {mark}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status indicators */}
      <div className="mt-6 grid grid-cols-4 gap-2 text-center text-xs">
        <div className={`p-2 rounded ${percentage >= 80 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
          <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
          Excellent
        </div>
        <div className={`p-2 rounded ${percentage >= 60 && percentage < 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>
          <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
          Good
        </div>
        <div className={`p-2 rounded ${percentage >= 40 && percentage < 60 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-500'}`}>
          <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
          Fair
        </div>
        <div className={`p-2 rounded ${percentage < 40 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-500'}`}>
          <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
          Poor
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="font-bold text-lg" style={{ color: dynamicColor }}>
              {Math.round(animatedValue)}
            </p>
            <p className="text-gray-600">Current</p>
          </div>
          <div>
            <p className="font-bold text-lg text-gray-800">
              {maxValue}
            </p>
            <p className="text-gray-600">Maximum</p>
          </div>
          <div>
            <p className="font-bold text-lg text-gray-800">
              {Math.round(percentage)}%
            </p>
            <p className="text-gray-600">Progress</p>
          </div>
        </div>
      </div>

      {/* Progress bar alternative view */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-1500 ease-out"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: dynamicColor
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;