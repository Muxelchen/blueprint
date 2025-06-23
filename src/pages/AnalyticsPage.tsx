import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Eye, Filter, Download, RefreshCw } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

// Mock analytics data
const analyticsStats = [
  {
    title: 'Total Revenue',
    value: '$124,563',
    change: '+12.5%',
    trend: 'up' as const,
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900',
  },
  {
    title: 'Total Users',
    value: '8,549',
    change: '+8.2%',
    trend: 'up' as const,
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
  },
  {
    title: 'Total Orders',
    value: '1,234',
    change: '-3.1%',
    trend: 'down' as const,
    icon: ShoppingCart,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
  },
  {
    title: 'Page Views',
    value: '45,678',
    change: '+15.3%',
    trend: 'up' as const,
    icon: Eye,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
  },
];

const trafficSources = [
  { name: 'Organic Search', value: 45, color: 'bg-blue-500' },
  { name: 'Direct', value: 25, color: 'bg-green-500' },
  { name: 'Social Media', value: 20, color: 'bg-purple-500' },
  { name: 'Referral', value: 10, color: 'bg-orange-500' },
];

const recentActivity = [
  {
    id: 1,
    action: 'New user registration',
    user: 'john.doe@example.com',
    time: '2 minutes ago',
    type: 'user',
  },
  {
    id: 2,
    action: 'Product purchase',
    user: 'alice.smith@example.com',
    time: '5 minutes ago',
    type: 'order',
  },
  {
    id: 3,
    action: 'Feature usage spike',
    user: 'Dashboard Analytics',
    time: '10 minutes ago',
    type: 'system',
  },
];

const AnalyticsPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Analytics Dashboard
            </h1>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Track performance metrics and insights
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time range selector */}
            <div className={`flex rounded-lg border ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700' 
                : 'border-gray-300 bg-white'
            }`}>
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                    timeRange === range
                      ? 'bg-primary-500 text-white'
                      : isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {range === '7d' ? '7 Days' : 
                   range === '30d' ? '30 Days' : 
                   range === '90d' ? '90 Days' : '1 Year'}
                </button>
              ))}
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-2">
              <button className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
                <Filter className="w-5 h-5" />
              </button>
              <button className="btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            } shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Traffic Sources */}
        <div className={`p-6 rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Traffic Sources
          </h3>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {source.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-32 h-2 rounded-full ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`h-2 rounded-full ${source.color} transition-all duration-500`}
                      style={{ width: `${source.value}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {source.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'order' ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {activity.action}
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {activity.user}
                  </p>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Performance Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Page Load Time', value: '1.2s', target: '< 2s', status: 'good' },
            { label: 'Bounce Rate', value: '32%', target: '< 40%', status: 'good' },
            { label: 'Conversion Rate', value: '3.8%', target: '> 3%', status: 'excellent' },
          ].map((metric) => (
            <div key={metric.label} className="text-center">
              <h4 className={`text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {metric.label}
              </h4>
              <div className={`text-2xl font-bold mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {metric.value}
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Target: {metric.target}
              </div>
              <div className={`mt-2 px-2 py-1 rounded-full text-xs inline-block ${
                metric.status === 'excellent' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              }`}>
                {metric.status === 'excellent' ? 'Excellent' : 'Good'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage; 