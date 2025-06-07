import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ScatterData {
  x: number;
  y: number;
  z: number;
  category: string;
  name: string;
}

const mockData: ScatterData[] = [
  { x: 100, y: 200, z: 200, category: 'A', name: 'Point 1' },
  { x: 120, y: 100, z: 260, category: 'A', name: 'Point 2' },
  { x: 170, y: 300, z: 400, category: 'A', name: 'Point 3' },
  { x: 140, y: 250, z: 280, category: 'A', name: 'Point 4' },
  { x: 150, y: 400, z: 500, category: 'A', name: 'Point 5' },
  { x: 110, y: 280, z: 200, category: 'A', name: 'Point 6' },
  { x: 200, y: 300, z: 300, category: 'B', name: 'Point 7' },
  { x: 210, y: 250, z: 350, category: 'B', name: 'Point 8' },
  { x: 220, y: 180, z: 250, category: 'B', name: 'Point 9' },
  { x: 190, y: 320, z: 400, category: 'B', name: 'Point 10' },
  { x: 250, y: 290, z: 450, category: 'B', name: 'Point 11' },
  { x: 300, y: 200, z: 150, category: 'C', name: 'Point 12' },
  { x: 320, y: 180, z: 200, category: 'C', name: 'Point 13' },
  { x: 280, y: 220, z: 180, category: 'C', name: 'Point 14' },
  { x: 310, y: 240, z: 220, category: 'C', name: 'Point 15' },
];

interface ScatterPlotProps {
  data?: ScatterData[];
  title?: string;
  height?: number | string;
  className?: string;
}

interface CategoryColors {
  [key: string]: string;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data = mockData,
  title = 'Performance vs Engagement Analysis',
  height = 480,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  const categoryColors: CategoryColors = {
    A: '#3B82F6',
    B: '#10B981',
    C: '#F59E0B',
    D: '#EF4444',
    E: '#8B5CF6',
  };

  const filteredData =
    selectedCategory === null ? data : data.filter(d => d.category === selectedCategory);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Category:</span>
              <span
                className="font-medium px-2 py-1 rounded text-xs text-white"
                style={{ backgroundColor: categoryColors[data.category] }}
              >
                {data.category}
              </span>
            </div>
            <div className="flex justify-between">
              <span>X Value:</span>
              <span className="font-medium">{data.x}</span>
            </div>
            <div className="flex justify-between">
              <span>Y Value:</span>
              <span className="font-medium">{data.y}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-medium">{data.z}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const isSelected = false;
    const isHovered = hoveredPoint === payload.name;
    const baseSize = Math.sqrt(payload.z) / 3;
    const size = isSelected || isHovered ? baseSize * 1.5 : baseSize;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill={categoryColors[payload.category]}
        stroke={isSelected ? '#ffffff' : isHovered ? '#ffffff' : 'none'}
        strokeWidth={isSelected || isHovered ? 3 : 0}
        style={{
          filter: isSelected || isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
        }}
        onClick={() => {
          // setSelectedPoints(prev => {
          //   const newSet = new Set(prev);
          //   if (newSet.has(payload.name)) {
          //     newSet.delete(payload.name);
          //   } else {
          //     newSet.add(payload.name);
          //   }
          //   return newSet;
          // });
        }}
        onMouseEnter={() => setHoveredPoint(payload.name)}
        onMouseLeave={() => setHoveredPoint(null)}
      />
    );
  };

  const clearSelection = () => {
    // setSelectedPoints(new Set());
  };

  const selectAll = () => {
    // setSelectedPoints(new Set(filteredData.map(d => d.name)));
  };

  // Stats calculation function - available for future use
  // const getStatistics = () => {
  //   const dataToAnalyze = filteredData;
  //
  //   const xValues = dataToAnalyze.map(d => d.x);
  //   const yValues = dataToAnalyze.map(d => d.y);
  //   const zValues = dataToAnalyze.map(d => d.z);
  //
  //   return {
  //     count: dataToAnalyze.length,
  //     xAvg: xValues.reduce((a, b) => a + b, 0) / xValues.length,
  //     yAvg: yValues.reduce((a, b) => a + b, 0) / yValues.length,
  //     zAvg: zValues.reduce((a, b) => a + b, 0) / zValues.length,
  //     xRange: [Math.min(...xValues), Math.max(...xValues)],
  //     yRange: [Math.min(...yValues), Math.max(...yValues)]
  //   };
  // };

  // Stats are calculated but not displayed in current minimal version
  // Uncomment the statistics section below to show detailed analytics
  // const stats = getStatistics();

  const containerHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={`bg-white p-4 rounded-lg shadow-lg flex flex-col ${className}`}
      style={{ height: containerHeight, minHeight: '400px' }}
    >
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearSelection}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Clear
          </button>
          <button
            onClick={selectAll}
            className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
          >
            Select All
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-3 flex-shrink-0">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
            selectedCategory === null
              ? 'bg-blue-100 text-blue-700 border-blue-300'
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          }`}
        >
          All Categories
        </button>

        {Object.keys(categoryColors).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            className={`flex items-center px-3 py-1 text-xs rounded-lg border transition-colors ${
              selectedCategory === category
                ? 'bg-gray-200 text-gray-800 border-gray-400'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: selectedCategory === category ? categoryColors[category] : undefined,
              color: selectedCategory === category ? 'white' : undefined,
            }}
          >
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: categoryColors[category] }}
            ></div>
            Category {category}
          </button>
        ))}
      </div>

      {/* Chart - Takes remaining space */}
      <div className="flex-1 mb-3 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }} data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" dataKey="x" stroke="#666" fontSize={12} name="Performance" />
            <YAxis type="number" dataKey="y" stroke="#666" fontSize={12} name="Efficiency" />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              name="Data Points"
              data={filteredData}
              shape={<CustomDot />}
              animationDuration={1000}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics for each category */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3 flex-shrink-0">
        {Object.keys(categoryColors).map(category => {
          const categoryData = filteredData.filter((d: any) => d.category === category);
          if (categoryData.length === 0) return null;

          const avgX =
            categoryData.reduce((sum: number, d: any) => sum + d.x, 0) / categoryData.length;
          const avgY =
            categoryData.reduce((sum: number, d: any) => sum + d.y, 0) / categoryData.length;

          return (
            <div key={category} className="bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center mb-1">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: categoryColors[category] }}
                ></div>
                <span className="font-medium text-xs">Category {category}</span>
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  Count: <span className="font-bold">{categoryData.length}</span>
                </div>
                <div>
                  Avg X: <span className="font-bold">{avgX.toFixed(1)}</span>
                </div>
                <div>
                  Avg Y: <span className="font-bold">{avgY.toFixed(1)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-500 text-center flex-shrink-0">
        Click on points to select them • Hover for details • Filter by category above
      </div>
    </div>
  );
};

export default ScatterPlot;
