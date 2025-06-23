import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Thermometer, Filter, Download, RotateCcw, Layers } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const MapHeatPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [heatmapType, setHeatmapType] = useState('activity');

  const heatmapMetrics = [
    { label: 'Total Data Points', value: '45,832', change: '+12.3%', icon: Map },
    { label: 'Hot Zones', value: '23', change: '+8.7%', icon: Thermometer },
    { label: 'Coverage Area', value: '89.2%', change: '+2.1%', icon: Layers },
    { label: 'Avg Intensity', value: '67.4%', change: '+5.3%', icon: RotateCcw },
  ];

  const hotZones = [
    { name: 'Downtown Core', intensity: 95, count: 12567, coordinates: { lat: 40.7589, lng: -73.9851 } },
    { name: 'Business District', intensity: 87, count: 9834, coordinates: { lat: 40.7614, lng: -73.9776 } },
    { name: 'Shopping Center', intensity: 78, count: 7456, coordinates: { lat: 40.7505, lng: -73.9934 } },
    { name: 'University Area', intensity: 65, count: 5234, coordinates: { lat: 40.7282, lng: -73.9942 } },
    { name: 'Airport Zone', intensity: 52, count: 3678, coordinates: { lat: 40.6413, lng: -73.7781 } },
  ];

  const timeframes = [
    { period: 'Last Hour', activity: 89, trend: '+5%' },
    { period: 'Last 6 Hours', activity: 76, trend: '+12%' },
    { period: 'Last 24 Hours', activity: 92, trend: '+8%' },
    { period: 'Last Week', activity: 68, trend: '-3%' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Heat Map Analytics
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Visualize activity patterns and intensity zones
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={heatmapType}
              onChange={(e) => setHeatmapType(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="activity">Activity Heatmap</option>
              <option value="traffic">Traffic Density</option>
              <option value="sales">Sales Volume</option>
              <option value="events">Event Frequency</option>
            </select>
            <button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button className="btn-primary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Heatmap Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {heatmapMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {metric.label}
                </p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metric.value}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`text-sm ${
                    metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <metric.icon className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Interactive Heatmap */}
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Interactive Heat Map
          </h3>
          <div className={`h-96 rounded-lg ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
          } relative overflow-hidden`}>
            {/* Simulated heatmap visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Map className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={`text-lg font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {heatmapType.charAt(0).toUpperCase() + heatmapType.slice(1)} Heatmap
                </p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Interactive map visualization would appear here
                </p>
              </div>
            </div>
            
            {/* Intensity legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg backdrop-blur-sm">
              <h4 className="text-sm font-medium mb-2">Intensity Scale</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs">Low</span>
                <div className="w-20 h-3 bg-gradient-to-r from-blue-300 via-yellow-400 to-red-500 rounded"></div>
                <span className="text-xs">High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hot Zones Ranking */}
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Top Hot Zones
          </h3>
          <div className="space-y-4">
            {hotZones.map((zone, index) => (
              <div key={zone.name} className={`p-4 rounded-lg border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {zone.name}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {zone.count.toLocaleString()} data points
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      zone.intensity > 80 ? 'text-red-500' : 
                      zone.intensity > 60 ? 'text-orange-500' : 'text-yellow-500'
                    }`}>
                      {zone.intensity}%
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      intensity
                    </div>
                  </div>
                </div>
                <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      zone.intensity > 80 ? 'bg-red-500' : 
                      zone.intensity > 60 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${zone.intensity}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time-based Analysis */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Activity Over Time
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {timeframes.map((timeframe) => (
            <div key={timeframe.period} className={`p-4 rounded-lg border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {timeframe.period}
              </h4>
              <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {timeframe.activity}%
              </div>
              <div className={`text-sm ${
                timeframe.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {timeframe.trend} vs previous
              </div>
              <div className="mt-3">
                <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${timeframe.activity}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MapHeatPage; 