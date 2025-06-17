import React, { useState } from 'react';
import { Treemap as RechartsTreemap, ResponsiveContainer, Tooltip } from 'recharts';
import { useDarkMode } from '../../hooks/useDarkMode';

interface TreemapData {
  name: string;
  size: number;
  children?: TreemapData[];
  color?: string;
  category?: string;
}

const mockData: TreemapData[] = [
  {
    name: 'Technology',
    size: 0,
    color: '#3B82F6',
    children: [
      { name: 'Frontend', size: 2500, color: '#3B82F6', category: 'Technology' },
      { name: 'Backend', size: 2200, color: '#1E40AF', category: 'Technology' },
      { name: 'DevOps', size: 1800, color: '#1E3A8A', category: 'Technology' },
      { name: 'Mobile', size: 1600, color: '#1D4ED8', category: 'Technology' },
    ],
  },
  {
    name: 'Marketing',
    size: 0,
    color: '#10B981',
    children: [
      { name: 'Digital', size: 1900, color: '#10B981', category: 'Marketing' },
      { name: 'Content', size: 1500, color: '#059669', category: 'Marketing' },
      { name: 'Social Media', size: 1200, color: '#047857', category: 'Marketing' },
      { name: 'SEO', size: 1000, color: '#065F46', category: 'Marketing' },
    ],
  },
  {
    name: 'Sales',
    size: 0,
    color: '#F59E0B',
    children: [
      { name: 'Enterprise', size: 2100, color: '#F59E0B', category: 'Sales' },
      { name: 'SMB', size: 1700, color: '#D97706', category: 'Sales' },
      { name: 'Partnerships', size: 1300, color: '#B45309', category: 'Sales' },
    ],
  },
  {
    name: 'Operations',
    size: 0,
    color: '#EF4444',
    children: [
      { name: 'HR', size: 1400, color: '#EF4444', category: 'Operations' },
      { name: 'Finance', size: 1600, color: '#DC2626', category: 'Operations' },
      { name: 'Legal', size: 800, color: '#B91C1C', category: 'Operations' },
      { name: 'Admin', size: 900, color: '#991B1B', category: 'Operations' },
    ],
  },
];

interface TreemapProps {
  data?: TreemapData[];
  title?: string;
  height?: number | string;
  className?: string;
}

const TreemapComponent: React.FC<TreemapProps> = ({
  data = mockData,
  title = 'Market Share Analysis',
  height = 600,
  className = '',
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const { isDarkMode } = useDarkMode();

  const colors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#6366F1',
    '#84CC16',
  ];

  // Flatten the hierarchical data for the treemap
  const flattenedData = React.useMemo(() => {
    const flattened = data.flatMap(category => 
      category.children || [{ ...category, children: undefined }]
    ).filter(item => item.size > 0);
    
    // Add better color mapping to each item
    const enhancedData = flattened.map((item, index) => ({
      ...item,
      fill: item.color || colors[index % colors.length],
      stroke: isDarkMode ? '#374151' : '#fff',
    }));
    
    console.log('Treemap: Original data:', data);
    console.log('Treemap: Enhanced flattened data:', enhancedData);
    
    return enhancedData;
  }, [data, colors, isDarkMode]);

  // Add error handling for empty data
  if (!flattenedData || flattenedData.length === 0) {
    console.log('Treemap: No data available, showing empty state');
    return (
      <div 
        className={`
          p-4 rounded-lg shadow-lg flex items-center justify-center
          ${isDarkMode 
            ? 'bg-gray-800 text-white' 
            : 'bg-white text-gray-900'
          }
          ${className}
        `}
        style={{ height: typeof height === 'number' ? `${height}px` : height, minHeight: '400px' }}
      >
        <div className="text-center">
          <div className={`text-6xl mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
            📊
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No data available to display
          </p>
        </div>
      </div>
    );
  }

  console.log('Treemap: Rendering with data:', flattenedData);

    const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const totalSize = flattenedData.reduce((sum, item) => sum + item.size, 0);
      const percentage = ((data.size / totalSize) * 100).toFixed(1);

      return (
        <div className={`
          p-4 border rounded-lg shadow-lg font-sans
          ${isDarkMode 
            ? 'bg-gray-800 border-gray-600 text-white' 
            : 'bg-white border-gray-200 text-gray-800'
          }
        `}>
          <p className="font-semibold mb-2 text-sm">{data.name}</p>
          <div className="space-y-1 text-xs">
            {data.category && (
              <div className="flex justify-between">
                <span>Department:</span>
                <span className="font-medium">{data.category}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-medium">{data.size.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Percentage:</span>
              <span className="font-medium">{percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
        return null;
  };



  return (
    <div 
      className={`
        p-4 rounded-lg shadow-lg flex flex-col font-sans
        ${isDarkMode 
          ? 'bg-gray-800 text-white' 
          : 'bg-white text-gray-900'
        }
        ${className}
      `}
      style={{ height: typeof height === 'number' ? `${height}px` : height, minHeight: '500px' }}
    >
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center space-x-2">
          {selectedNode && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
            }`}>
              Selected: {selectedNode}
            </span>
          )}
          <button
            onClick={() => setSelectedNode(null)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Treemap Chart */}
      <div className="flex-1 mb-3 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsTreemap
            data={flattenedData}
            dataKey="size"
            aspectRatio={4/3}
            stroke={isDarkMode ? "#374151" : "#fff"}
            animationDuration={500}
          >
            <Tooltip content={<CustomTooltip />} />
          </RechartsTreemap>
        </ResponsiveContainer>
      </div>

      {/* Department breakdown */}
      <div className="flex-shrink-0">
        <h4 className={`text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>Department Breakdown</h4>
        <div className="grid grid-cols-2 gap-2">
          {data.map(category => {
            const total = category.children
              ? category.children.reduce((sum: number, child: TreemapData) => sum + child.size, 0)
              : category.size;
            const allDataTotal = flattenedData.reduce((sum, item) => sum + item.size, 0);
            const percentage = ((total / allDataTotal) * 100).toFixed(1);
            const isSelected = selectedNode === category.name;

            return (
              <div
                key={category.name}
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? (isDarkMode 
                      ? 'bg-blue-900 border-2 border-blue-400' 
                      : 'bg-blue-50 border-2 border-blue-200')
                    : (isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-50 hover:bg-gray-100')
                }`}
                onClick={() => setSelectedNode(isSelected ? null : category.name)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-xs">{category.name}</span>
                  <span className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>{percentage}%</span>
                </div>
                <div className={`flex justify-between text-xs ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <span>Size: {total.toLocaleString()}</span>
                  <span>Items: {category.children ? category.children.length : 1}</span>
                </div>
                <div className={`mt-1 w-full rounded-full h-1 ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: category.color || '#3B82F6',
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <div className={`mt-3 p-3 rounded-lg flex-shrink-0 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="font-bold text-base">
              {flattenedData.reduce((sum, item) => sum + item.size, 0).toLocaleString()}
            </p>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Total Size</p>
          </div>
          <div>
            {(() => {
              const categoryTotals = data.map(cat => ({
                name: cat.name,
                total: cat.children
                  ? cat.children.reduce((sum, child) => sum + child.size, 0)
                  : cat.size,
              }));
              const largest = categoryTotals.reduce((max, cat) =>
                cat.total > max.total ? cat : max
              );
              return (
                <>
                  <p className="font-bold text-base">{largest.name}</p>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Largest Dept</p>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>({largest.total.toLocaleString()})</p>
                </>
              );
            })()}
          </div>
          <div>
            {(() => {
              const categoryTotals = data.map(cat => ({
                name: cat.name,
                total: cat.children
                  ? cat.children.reduce((sum, child) => sum + child.size, 0)
                  : cat.size,
              }));
              const smallest = categoryTotals.reduce((min, cat) =>
                cat.total < min.total ? cat : min
              );
              return (
                <>
                  <p className="font-bold text-base">{smallest.name}</p>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Smallest Dept</p>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>({smallest.total.toLocaleString()})</p>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className={`text-xs text-center mt-2 flex-shrink-0 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        Click on rectangles to select • Click department cards to highlight • Hover for details
      </div>
    </div>
  );
};

export default TreemapComponent;
