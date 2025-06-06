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
  size?: 'small' | 'medium' | 'large' | 'auto';
  compact?: boolean;
  height?: number;
  maxWeeks?: number; // Limit visible weeks for compact layouts
  showFilters?: boolean;
  showLegend?: boolean;
}

const Heatmap: React.FC<HeatmapProps> = ({
  data = generateMockData(),
  title = 'Activity Heatmap',
  colorScheme = 'blue',
  showTooltip = true,
  showStats = true,
  cellSize = 12,
  size = 'auto',
  compact = false,
  height,
  maxWeeks,
  showFilters = true,
  showLegend = true,
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

  // Calculate adaptive dimensions based on content complexity
  const getAdaptiveDimensions = () => {
    const dataComplexity = Math.min(data.length / 365, 1); // Normalize data density
    const hasMultipleSections = showStats || showFilters;
    
    let adaptiveCellSize: number;
    let containerMinHeight: number;
    let maxVisibleWeeks: number;
    let gridSpacing: number;
    
    if (height) {
      // Use provided height and calculate cell size accordingly
      const availableHeight = height - (hasMultipleSections ? 300 : 150);
      adaptiveCellSize = Math.max(Math.min(Math.floor(availableHeight / 10), 16), 6);
      containerMinHeight = height;
      maxVisibleWeeks = 53;
      gridSpacing = 1;
    } else if (size === 'small' || compact) {
      adaptiveCellSize = Math.max(6, Math.min(8, cellSize || 8));
      containerMinHeight = 300 + (hasMultipleSections ? 200 : 0);
      maxVisibleWeeks = maxWeeks || 26; // Show 6 months
      gridSpacing = 0.5;
    } else if (size === 'large') {
      adaptiveCellSize = Math.max(16, Math.min(20, (cellSize || 16) + Math.floor(dataComplexity * 4)));
      containerMinHeight = 500 + (hasMultipleSections ? 300 : 0);
      maxVisibleWeeks = 53;
      gridSpacing = 2;
    } else if (size === 'medium') {
      adaptiveCellSize = Math.max(10, Math.min(14, (cellSize || 12) + Math.floor(dataComplexity * 2)));
      containerMinHeight = 400 + (hasMultipleSections ? 250 : 0);
      maxVisibleWeeks = 53;
      gridSpacing = 1;
    } else {
      // Auto sizing based on data complexity and available space
      const baseCellSize = cellSize || 12;
      const complexityBonus = Math.floor(dataComplexity * 3);
      const densityPenalty = data.length > 500 ? -1 : 0;
      
      adaptiveCellSize = Math.max(8, Math.min(16, baseCellSize + complexityBonus + densityPenalty));
      containerMinHeight = 350 + (hasMultipleSections ? 280 : 0);
      maxVisibleWeeks = maxWeeks || 53;
      gridSpacing = adaptiveCellSize >= 12 ? 1 : 0.5;
    }
    
    return {
      cellSize: adaptiveCellSize,
      containerMinHeight: Math.max(containerMinHeight, compact ? 250 : 350),
      maxVisibleWeeks: Math.max(maxVisibleWeeks, compact ? 20 : 40),
      gridSpacing: Math.max(gridSpacing, 0.5),
      labelFontSize: compact ? 'text-xs' : adaptiveCellSize >= 14 ? 'text-sm' : 'text-xs',
      titleSize: compact ? 'text-base' : 'text-lg',
      showDayLabels: !compact && adaptiveCellSize >= 10,
      showMonthLabels: adaptiveCellSize >= 8,
    };
  };

  const dimensions = getAdaptiveDimensions();
  const actualCellSize = dimensions.cellSize;
  const visibleWeeks = weeks.slice(0, dimensions.maxVisibleWeeks);

  return (
    <div 
      className={`bg-white ${compact ? 'p-3' : 'p-6'} rounded-lg shadow-lg`}
      style={{ 
        minHeight: `${dimensions.containerMinHeight}px`,
        height: size === 'large' ? `${dimensions.containerMinHeight}px` : 'auto'
      }}
    >
      <div className={`flex justify-between items-center ${compact ? 'mb-3' : 'mb-6'}`}>
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className={`${dimensions.titleSize} font-semibold`}>{title}</h3>
        </div>
        
        {showFilters && !compact && (
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedMonth !== null ? selectedMonth : 'all'}
              onChange={(e) => setSelectedMonth(e.target.value === 'all' ? null : parseInt(e.target.value))}
              className={`px-3 py-1 ${dimensions.labelFontSize} border border-gray-300 rounded focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Months</option>
              {months.map((month, index) => (
                <option key={month} value={index}>{compact ? month.slice(0, 3) : month}</option>
              ))}
            </select>
            
            {!compact && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-3 py-1 ${dimensions.labelFontSize} border border-gray-300 rounded focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Levels</option>
                <option value="high">High Activity</option>
                <option value="medium">Medium Activity</option>
                <option value="low">Low Activity</option>
              </select>
            )}
            
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
        )}
      </div>

      {/* Heatmap Grid - Enhanced responsive design */}
      <div className="relative" style={{ overflowX: compact ? 'auto' : 'visible' }}>
        <div className="inline-block min-w-full">
          {/* Month labels - Only show if enabled */}
          {dimensions.showMonthLabels && (
            <div className="flex mb-2">
              <div className={compact ? 'w-4' : 'w-8'}></div>
              {visibleWeeks.map(week => {
                const firstDayOfWeek = new Date(2024, 0, 1 + week * 7);
                const isFirstWeekOfMonth = firstDayOfWeek.getDate() <= 7;
                return (
                  <div
                    key={week}
                    className={`${dimensions.labelFontSize} text-gray-500 text-center`}
                    style={{ width: actualCellSize + dimensions.gridSpacing * 2 }}
                  >
                    {isFirstWeekOfMonth ? months[firstDayOfWeek.getMonth()].substring(0, compact ? 1 : 3) : ''}
                  </div>
                );
              })}
            </div>
          )}

          {/* Day labels and heatmap cells */}
          {days.map((day, dayIndex) => (
            <div key={day} className={`flex items-center ${compact ? 'mb-0.5' : 'mb-1'}`}>
              {dimensions.showDayLabels && (
                <div className={`${compact ? 'w-4' : 'w-8'} ${dimensions.labelFontSize} text-gray-500 text-right ${compact ? 'pr-1' : 'pr-2'}`}>
                  {(compact ? dayIndex % 2 === 1 : dayIndex % 2 === 1) ? (compact ? day[0] : day) : ''}
                </div>
              )}
              
              {visibleWeeks.map(week => {
                const cellData = filteredData.find(d => 
                  d.weekOfYear === week + 1 && d.dayOfWeek === dayIndex
                );
                
                return (
                  <div
                    key={`${week}-${dayIndex}`}
                    className={`relative cursor-pointer transition-all duration-200 hover:scale-110 ${
                      compact ? 'border border-gray-100' : 'border border-gray-200'
                    }`}
                    style={{
                      width: actualCellSize,
                      height: actualCellSize,
                      backgroundColor: cellData ? getCellColor(cellData.intensity) : '#f9fafb',
                      margin: `${dimensions.gridSpacing}px`
                    }}
                    onMouseEnter={() => cellData && setHoveredCell(cellData)}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                );
              })}
            </div>
          ))}

          {/* Intensity Legend */}
          {showLegend && !compact && (
            <div className={`flex items-center justify-center ${compact ? 'mt-2' : 'mt-4'} space-x-2`}>
              <span className={`${dimensions.labelFontSize} text-gray-500`}>Less</span>
              {Array.from({ length: compact ? 4 : 6 }, (_, i) => (
                <div
                  key={i}
                  className="border border-gray-200"
                  style={{
                    width: actualCellSize,
                    height: actualCellSize,
                    backgroundColor: getCellColor(i / (compact ? 3 : 5))
                  }}
                />
              ))}
              <span className={`${dimensions.labelFontSize} text-gray-500`}>More</span>
            </div>
          )}
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

      {/* Statistics - Enhanced responsive layout */}
      {showStats && !compact && (
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

      {/* Usage instructions - Only show in non-compact mode */}
      {!compact && (
        <div className={`${compact ? 'mt-2' : 'mt-4'} ${dimensions.labelFontSize} text-gray-500 text-center`}>
          Hover over cells for details • Use filters to focus on specific periods • Darker colors indicate higher activity
        </div>
      )}
    </div>
  );
};

export default Heatmap;