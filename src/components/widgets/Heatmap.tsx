import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Filter, RotateCcw } from 'lucide-react';

interface HeatmapData {
  date: string;
  value: number;
  category?: string;
  label?: string;
}

interface ProcessedHeatmapData {
  date: Date;
  value: number;
  category?: string;
  label?: string;
  dayOfWeek: number;
  weekOfYear: number;
  month: number;
  intensity: number;
}

const generateMockData = (): HeatmapData[] => {
  const data: HeatmapData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365); // 1 year of data

  for (let i = 0; i < 365; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // Generate realistic activity patterns
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseValue = isWeekend ? 20 : 80;
    const seasonalFactor = Math.sin((i / 365) * 2 * Math.PI) * 30 + 50;
    const randomFactor = Math.random() * 40;
    
    const value = Math.max(0, Math.round(baseValue + seasonalFactor + randomFactor - 50));
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      value,
      category: value > 80 ? 'high' : value > 40 ? 'medium' : 'low',
      label: `${value} activities on ${currentDate.toLocaleDateString()}`
    });
  }
  
  return data;
};

interface HeatmapProps {
  data?: HeatmapData[];
  title?: string;
  colorScheme?: 'blue' | 'green' | 'red' | 'purple' | 'gradient';
  showTooltip?: boolean;
  showStats?: boolean;
  cellSize?: number;
}

const Heatmap: React.FC<HeatmapProps> = ({
  data = generateMockData(),
  title = 'Activity Heatmap',
  colorScheme = 'blue',
  showTooltip = true,
  showStats = true,
  cellSize = 12
}) => {
  const [hoveredCell, setHoveredCell] = useState<ProcessedHeatmapData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const colorSchemes = {
    blue: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7'],
    green: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a'],
    red: ['#fef2f2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c'],
    purple: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea'],
    gradient: ['#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6']
  };

  const processedData = useMemo(() => {
    const processed = data.map(item => {
      const date = new Date(item.date);
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const weekOfYear = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
      
      return {
        ...item,
        date,
        dayOfWeek: date.getDay(),
        weekOfYear,
        month: date.getMonth(),
        intensity: item.value
      };
    });

    // Calculate intensity based on value distribution
    const values = processed.map(d => d.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    return processed.map(item => ({
      ...item,
      intensity: maxValue > minValue ? (item.value - minValue) / (maxValue - minValue) : 0
    }));
  }, [data]);

  const filteredData = useMemo(() => {
    return processedData.filter(item => {
      const matchesMonth = selectedMonth === null || item.month === selectedMonth;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesMonth && matchesCategory;
    });
  }, [processedData, selectedMonth, selectedCategory]);

  const getCellColor = (intensity: number) => {
    const colors = colorSchemes[colorScheme];
    const index = Math.min(Math.floor(intensity * colors.length), colors.length - 1);
    return colors[index];
  };

  const weeks = Array.from({ length: 53 }, (_, i) => i);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getStats = () => {
    const values = filteredData.map(d => d.value);
    if (values.length === 0) return { total: 0, average: 0, max: 0, min: 0, streak: 0 };

    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    // Calculate current streak
    let streak = 0;
    const sortedData = [...filteredData].sort((a, b) => b.date.getTime() - a.date.getTime());
    for (const item of sortedData) {
      if (item.value > 0) {
        streak++;
      } else {
        break;
      }
    }

    return { total, average, max, min, streak };
  };

  const stats = getStats();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedMonth !== null ? selectedMonth : 'all'}
            onChange={(e) => setSelectedMonth(e.target.value === 'all' ? null : parseInt(e.target.value))}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Months</option>
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="high">High Activity</option>
            <option value="medium">Medium Activity</option>
            <option value="low">Low Activity</option>
          </select>
          
          <button
            onClick={() => {
              setSelectedMonth(null);
              setSelectedCategory('all');
            }}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="relative overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-2">
            <div className="w-8"></div>
            {weeks.map(week => {
              const firstDayOfWeek = new Date(2024, 0, 1 + week * 7);
              const isFirstWeekOfMonth = firstDayOfWeek.getDate() <= 7;
              return (
                <div
                  key={week}
                  className="text-xs text-gray-500 text-center"
                  style={{ width: cellSize + 2 }}
                >
                  {isFirstWeekOfMonth ? months[firstDayOfWeek.getMonth()].substring(0, 3) : ''}
                </div>
              );
            })}
          </div>

          {/* Day labels and heatmap cells */}
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-8 text-xs text-gray-500 text-right pr-2">
                {dayIndex % 2 === 1 ? day : ''}
              </div>
              
              {weeks.map(week => {
                const cellData = filteredData.find(d => 
                  d.weekOfYear === week + 1 && d.dayOfWeek === dayIndex
                );
                
                return (
                  <div
                    key={`${week}-${dayIndex}`}
                    className="relative cursor-pointer transition-all duration-200 hover:scale-110 border border-gray-200"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: cellData ? getCellColor(cellData.intensity) : '#f9fafb',
                      margin: '1px'
                    }}
                    onMouseEnter={() => cellData && setHoveredCell(cellData)}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                );
              })}
            </div>
          ))}

          {/* Intensity Legend */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            <span className="text-xs text-gray-500">Less</span>
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="border border-gray-200"
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: getCellColor(i / 5)
                }}
              />
            ))}
            <span className="text-xs text-gray-500">More</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && hoveredCell && (
        <div className="absolute z-10 bg-gray-900 text-white p-3 rounded-lg shadow-lg text-sm pointer-events-none">
          <div className="font-medium">{hoveredCell.label}</div>
          <div className="text-gray-300">
            {hoveredCell.date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-gray-300">
            Level: {hoveredCell.category?.toUpperCase()}
          </div>
        </div>
      )}

      {/* Statistics */}
      {showStats && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Activity Statistics</h4>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="text-center">
              <p className="font-bold text-lg text-blue-600">{stats.total.toLocaleString()}</p>
              <p className="text-gray-600">Total</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-green-600">{Math.round(stats.average)}</p>
              <p className="text-gray-600">Daily Avg</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-orange-600">{stats.max}</p>
              <p className="text-gray-600">Best Day</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-purple-600">{stats.streak}</p>
              <p className="text-gray-600">Current Streak</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-gray-900">{filteredData.length}</p>
              <p className="text-gray-600">Days Tracked</p>
            </div>
          </div>

          {/* Activity distribution */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Activity Distribution</h5>
            <div className="grid grid-cols-3 gap-4 text-xs">
              {['high', 'medium', 'low'].map(category => {
                const count = filteredData.filter(d => d.category === category).length;
                const percentage = filteredData.length > 0 ? (count / filteredData.length) * 100 : 0;
                
                return (
                  <div key={category} className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: category === 'high' ? '#10b981' : 
                                          category === 'medium' ? '#f59e0b' : '#ef4444'
                        }}
                      ></div>
                      <span className="capitalize font-medium">{category}</span>
                    </div>
                    <div className="mt-1">
                      <span className="font-bold">{count}</span>
                      <span className="text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Usage instructions */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Hover over cells for details • Use filters to focus on specific periods • Darker colors indicate higher activity
      </div>
    </div>
  );
};

export default Heatmap;