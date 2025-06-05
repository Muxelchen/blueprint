import React, { useState } from 'react';
import { Treemap as RechartsTreemap, ResponsiveContainer, Tooltip } from 'recharts';

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
    ]
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
    ]
  },
  {
    name: 'Sales',
    size: 0,
    color: '#F59E0B',
    children: [
      { name: 'Enterprise', size: 2100, color: '#F59E0B', category: 'Sales' },
      { name: 'SMB', size: 1700, color: '#D97706', category: 'Sales' },
      { name: 'Partnerships', size: 1300, color: '#B45309', category: 'Sales' },
    ]
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
    ]
  }
];

interface TreemapProps {
  data?: TreemapData[];
  title?: string;
}

const TreemapComponent: React.FC<TreemapProps> = ({ 
  data = mockData, 
  title = 'Market Share Analysis' 
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#84CC16'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const allData = mockData.flatMap(category => category.children || []);
      const totalSize = allData.reduce((sum, item) => sum + item.size, 0);
      const percentage = ((data.size / totalSize) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
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

  const CustomContent = ({ x, y, width, height, payload }: any) => {
    if (width < 10 || height < 10 || !payload) return null;
    
    const isSelected = selectedNode === payload.name;
    const isHovered = hoveredNode === payload.name;
    const colorIndex = mockData.findIndex(item => item.name === payload.name);
    const color = payload.color || colors[colorIndex % colors.length];
    
    // Calculate font size based on area
    let fontSize = Math.min(width / 8, height / 3, 16);
    fontSize = Math.max(fontSize, 8);
    
    // Only show text if there's enough space
    const showText = width > 40 && height > 20;
    const showValue = width > 60 && height > 30;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          stroke={isSelected || isHovered ? '#ffffff' : color}
          strokeWidth={isSelected || isHovered ? 3 : 1}
          opacity={isSelected ? 1 : isHovered ? 0.9 : 0.8}
          style={{
            filter: isSelected || isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out'
          }}
          onClick={() => setSelectedNode(selectedNode === payload.name ? null : payload.name)}
          onMouseEnter={() => setHoveredNode(payload.name)}
          onMouseLeave={() => setHoveredNode(null)}
        />
        
        {showText && payload.name && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={fontSize}
            fill="white"
            fontWeight="bold"
            style={{ pointerEvents: 'none' }}
          >
            <tspan x={x + width / 2} dy="0">
              {payload.name.length > 10 ? payload.name.substring(0, 10) + '...' : payload.name}
            </tspan>
            {showValue && payload.size && (
              <tspan x={x + width / 2} dy={fontSize + 2} fontSize={fontSize * 0.8}>
                {payload.size.toLocaleString()}
              </tspan>
            )}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedNode('departments')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              selectedNode === 'departments' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Departments
          </button>
          <button
            onClick={() => setSelectedNode('all')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              selectedNode === 'all' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setSelectedNode(null)}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Clear Selection
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsTreemap
            data={data}
            dataKey="size"
            stroke="#fff"
            content={<CustomContent />}
            animationDuration={1000}
          >
            <Tooltip content={<CustomTooltip />} />
          </RechartsTreemap>
        </ResponsiveContainer>
      </div>

      {/* Department breakdown */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Department Breakdown</h4>
        <div className="grid grid-cols-2 gap-4">
          {mockData.map((category) => {
            const total = category.children ? category.children.reduce((sum: number, child: TreemapData) => sum + child.size, 0) : category.size;
            const allDataTotal = mockData.flatMap(cat => cat.children || []).reduce((sum, item) => sum + item.size, 0);
            const percentage = ((total / allDataTotal) * 100).toFixed(1);
            const isSelected = selectedNode === category.name;
            
            return (
              <div 
                key={category.name}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-blue-50 border-2 border-blue-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedNode(isSelected ? null : category.name)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{category.name}</span>
                  <span className="text-xs text-gray-500">{percentage}%</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Size: {total.toLocaleString()}</span>
                  <span>Items: {category.children ? category.children.length : 1}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: category.color || '#3B82F6'
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="font-bold text-lg">
              {mockData.flatMap(cat => cat.children || []).reduce((sum, item) => sum + item.size, 0).toLocaleString()}
            </p>
            <p className="text-gray-600">Total Size</p>
          </div>
          <div>
            {(() => {
              const categoryTotals = mockData.map(cat => ({
                name: cat.name,
                total: cat.children ? cat.children.reduce((sum, child) => sum + child.size, 0) : cat.size
              }));
              const largest = categoryTotals.reduce((max, cat) => cat.total > max.total ? cat : max);
              return (
                <>
                  <p className="font-bold text-lg">{largest.name}</p>
                  <p className="text-gray-600">Largest Dept</p>
                  <p className="text-xs text-gray-500">({largest.total.toLocaleString()})</p>
                </>
              );
            })()}
          </div>
          <div>
            {(() => {
              const categoryTotals = mockData.map(cat => ({
                name: cat.name,
                total: cat.children ? cat.children.reduce((sum, child) => sum + child.size, 0) : cat.size
              }));
              const smallest = categoryTotals.reduce((min, cat) => cat.total < min.total ? cat : min);
              return (
                <>
                  <p className="font-bold text-lg">{smallest.name}</p>
                  <p className="text-gray-600">Smallest Dept</p>
                  <p className="text-xs text-gray-500">({smallest.total.toLocaleString()})</p>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Click on rectangles to select • Switch between department and detailed view • Hover for details
      </div>
    </div>
  );
};

export default TreemapComponent;