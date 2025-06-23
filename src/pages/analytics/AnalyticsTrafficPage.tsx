import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Clock, TrendingUp, Filter, Download, Eye, MousePointer } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const AnalyticsTrafficPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [timeRange, setTimeRange] = useState('7d');

  const trafficMetrics = [
    { label: 'Total Visitors', value: '45,832', change: '+12.3%', trend: 'up', icon: Users },
    { label: 'Page Views', value: '128,543', change: '+8.7%', trend: 'up', icon: Eye },
    { label: 'Unique Visitors', value: '32,109', change: '+15.2%', trend: 'up', icon: Globe },
    { label: 'Avg. Session Duration', value: '4m 23s', change: '+6.1%', trend: 'up', icon: Clock },
  ];

  const trafficSources = [
    { name: 'Organic Search', visitors: 18543, percentage: 40.5, change: '+5.2%', color: 'bg-blue-500' },
    { name: 'Direct Traffic', visitors: 13749, percentage: 30.0, change: '+8.1%', color: 'bg-green-500' },
    { name: 'Social Media', visitors: 9166, percentage: 20.0, change: '+12.3%', color: 'bg-purple-500' },
    { name: 'Referral Links', visitors: 4374, percentage: 9.5, change: '-2.1%', color: 'bg-orange-500' },
  ];

  const topPages = [
    { page: '/dashboard', views: 12453, percentage: 15.2, bounceRate: 32.1 },
    { page: '/analytics', views: 9876, percentage: 12.1, bounceRate: 28.3 },
    { page: '/projects', views: 8234, percentage: 10.1, bounceRate: 35.7 },
    { page: '/calendar', views: 7123, percentage: 8.7, bounceRate: 42.1 },
    { page: '/reports', views: 6543, percentage: 8.0, bounceRate: 29.8 },
  ];

  const realTimeData = [
    { time: '14:30', visitors: 156 },
    { time: '14:31', visitors: 142 },
    { time: '14:32', visitors: 168 },
    { time: '14:33', visitors: 151 },
    { time: '14:34', visitors: 173 },
    { time: '14:35', visitors: 162 },
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
              Traffic Analytics
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor website traffic and visitor behavior
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
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

      {/* Traffic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {trafficMetrics.map((metric, index) => (
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
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">{metric.change}</span>
                </div>
              </div>
              <metric.icon className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Traffic Sources */}
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Traffic Sources
          </h3>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {source.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {source.visitors.toLocaleString()}
                    </div>
                    <div className={`text-sm ${
                      source.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {source.change}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`flex-1 h-2 rounded-full ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`h-2 rounded-full ${source.color} transition-all duration-500`}
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {source.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Visitors */}
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Real-time Visitors
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Live
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                162
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Active visitors right now
              </div>
            </div>

            <div className="space-y-3">
              {realTimeData.map((data, index) => (
                <div key={data.time} className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {data.time}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-20 h-2 rounded-full ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div
                        className="h-2 rounded-full bg-green-500 transition-all duration-500"
                        style={{ width: `${(data.visitors / 200) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {data.visitors}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Top Pages
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Page
                </th>
                <th className={`text-right py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Views
                </th>
                <th className={`text-right py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  % of Total
                </th>
                <th className={`text-right py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Bounce Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((page, index) => (
                <tr 
                  key={page.page}
                  className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} hover:${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } transition-colors`}
                >
                  <td className={`py-3 px-4 font-mono text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {page.page}
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {page.views.toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 text-right ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {page.percentage}%
                  </td>
                  <td className={`py-3 px-4 text-right ${
                    page.bounceRate > 40 ? 'text-red-500' : 
                    page.bounceRate > 30 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {page.bounceRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsTrafficPage; 