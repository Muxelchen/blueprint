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
      label: `${value} activities on ${currentDate.toLocaleDateString()}`,
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
  size?: 'small' | 'medium' | 'large';
  showFilters?: boolean;
  showLegend?: boolean;
}

const Heatmap: React.FC<HeatmapProps> = ({
  data = generateMockData(),
  title = 'Activity Heatmap',
  colorScheme = 'blue',
  showTooltip = true,
  showStats = true,
  size = 'medium',
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
    gradient: ['#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'],
  };

  const processedData = useMemo(() => {
    const processed = data.map(item => {
      const date = new Date(item.date);
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const weekOfYear = Math.ceil(
        ((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
      );

      return {
        ...item,
        date,
        dayOfWeek: date.getDay(),
        weekOfYear,
        month: date.getMonth(),
        intensity: item.value,
      };
    });

    // Calculate intensity based on value distribution
    const values = processed.map(d => d.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    return processed.map(item => ({
      ...item,
      intensity: maxValue > minValue ? (item.value - minValue) / (maxValue - minValue) : 0,
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
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

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

  // Simplified size configuration
  const sizeConfig = {
    small: {
      cellSize: 8,
      containerWidth: '100%',
      containerHeight: '400px',
      maxWeeks: 26, // 6 months
      gridSpacing: 1,
      showDayLabels: false,
      showMonthLabels: true,
      titleSize: 'text-base',
      labelSize: 'text-xs',
      padding: 'p-4',
      showStats: false,
      showFilters: false,
    },
    medium: {
      cellSize: 12,
      containerWidth: '100%',
      containerHeight: '500px',
      maxWeeks: 52, // Full year
      gridSpacing: 1,
      showDayLabels: true,
      showMonthLabels: true,
      titleSize: 'text-lg',
      labelSize: 'text-sm',
      padding: 'p-6',
      showStats: showStats,
      showFilters: showFilters,
    },
    large: {
      cellSize: 16,
      containerWidth: '100%',
      containerHeight: '600px',
      maxWeeks: 52, // Full year
      gridSpacing: 2,
      showDayLabels: true,
      showMonthLabels: true,
      titleSize: 'text-xl',
      labelSize: 'text-base',
      padding: 'p-8',
      showStats: showStats,
      showFilters: showFilters,
    },
  };

  const config = sizeConfig[size];
  const visibleWeeks = weeks.slice(0, config.maxWeeks);

  return (
    <div
      className={`bg-white ${config.padding} rounded-lg shadow-lg w-full relative`}
      style={{
        height: config.containerHeight,
        minHeight: config.containerHeight,
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header - Fixed height */}
      <div className={`flex justify-between items-center mb-4 flex-shrink-0`}>
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className={`${config.titleSize} font-semibold`}>{title}</h3>
        </div>

        {config.showFilters && (
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedMonth !== null ? selectedMonth : 'all'}
              onChange={e =>
                setSelectedMonth(e.target.value === 'all' ? null : parseInt(e.target.value))
              }
              className={`px-2 py-1 ${config.labelSize} border border-gray-300 rounded focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Months</option>
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className={`px-2 py-1 ${config.labelSize} border border-gray-300 rounded focus:ring-2 focus:ring-blue-500`}
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
        )}
      </div>

      {/* Heatmap Grid Container - Scrollable */}
      <div className="flex-1 overflow-auto bg-gray-50 rounded-lg p-3 mb-4">
        <div className="inline-block min-w-full">
          {/* Month labels - Properly aligned */}
          {config.showMonthLabels && (
            <div className="flex mb-2">
              <div className={config.showDayLabels ? 'w-8' : 'w-0'} style={{ flexShrink: 0 }}></div>
              {visibleWeeks.map(week => {
                const firstDayOfWeek = new Date(2024, 0, 1 + week * 7);
                const isFirstWeekOfMonth = firstDayOfWeek.getDate() <= 7;
                return (
                  <div
                    key={week}
                    className={`${config.labelSize} text-gray-500 text-center flex-shrink-0`}
                    style={{
                      width: config.cellSize + config.gridSpacing * 2,
                      minWidth: config.cellSize + config.gridSpacing * 2,
                    }}
                  >
                    {isFirstWeekOfMonth ? months[firstDayOfWeek.getMonth()].substring(0, 3) : ''}
                  </div>
                );
              })}
            </div>
          )}

          {/* Day labels and heatmap cells - Improved alignment */}
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center mb-1">
              {config.showDayLabels && (
                <div
                  className={`w-8 ${config.labelSize} text-gray-500 text-right pr-2 flex-shrink-0`}
                >
                  {dayIndex % 2 === 1 ? day.substring(0, 3) : ''}
                </div>
              )}

              {visibleWeeks.map(week => {
                const cellData = filteredData.find(
                  d => d.weekOfYear === week + 1 && d.dayOfWeek === dayIndex
                );

                return (
                  <div
                    key={`${week}-${dayIndex}`}
                    className="relative cursor-pointer transition-all duration-200 hover:scale-105 border border-gray-300 rounded-sm flex-shrink-0"
                    style={{
                      width: config.cellSize,
                      height: config.cellSize,
                      minWidth: config.cellSize,
                      minHeight: config.cellSize,
                      backgroundColor: cellData ? getCellColor(cellData.intensity) : '#f3f4f6',
                      margin: `${config.gridSpacing}px`,
                    }}
                    onMouseEnter={() => cellData && setHoveredCell(cellData)}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                );
              })}
            </div>
          ))}

          {/* Intensity Legend - Better spacing */}
          {showLegend && (
            <div className="flex items-center justify-center mt-4 space-x-2">
              <span className={`${config.labelSize} text-gray-500`}>Less</span>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="border border-gray-300 rounded-sm"
                  style={{
                    width: Math.max(config.cellSize, 12),
                    height: Math.max(config.cellSize, 12),
                    backgroundColor: getCellColor(i / 4),
                  }}
                />
              ))}
              <span className={`${config.labelSize} text-gray-500`}>More</span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics - Fixed position at bottom */}
      {config.showStats && (
        <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Activity Statistics</h4>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </div>

          <div className="grid grid-cols-5 gap-3 text-sm">
            <div className="text-center">
              <p className="font-bold text-blue-600">{stats.total.toLocaleString()}</p>
              <p className="text-gray-600 text-xs">Total</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-green-600">{Math.round(stats.average)}</p>
              <p className="text-gray-600 text-xs">Daily Avg</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-orange-600">{stats.max}</p>
              <p className="text-gray-600 text-xs">Best Day</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-purple-600">{stats.streak}</p>
              <p className="text-gray-600 text-xs">Streak</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900">{filteredData.length}</p>
              <p className="text-gray-600 text-xs">Days</p>
            </div>
          </div>
        </div>
      )}

      {/* Usage instructions - Only for larger sizes */}
      {size !== 'small' && (
        <div className={`mt-2 ${config.labelSize} text-gray-500 text-center flex-shrink-0`}>
          Hover over cells for details{' '}
          {config.showFilters && '• Use filters to focus on specific periods'}
        </div>
      )}

      {/* Tooltip - Fixed positioning */}
      {showTooltip && hoveredCell && (
        <div
          className="fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-xl text-sm pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: '50%',
            top: '20%',
            maxWidth: '250px',
          }}
        >
          <div className="font-medium">{hoveredCell.label}</div>
          <div className="text-gray-300 text-xs mt-1">
            {hoveredCell.date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </div>
          <div className="text-gray-300 text-xs">Level: {hoveredCell.category?.toUpperCase()}</div>
        </div>
      )}
    </div>
  );
};

export default Heatmap;
