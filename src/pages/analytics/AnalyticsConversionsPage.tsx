import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, DollarSign, ShoppingCart, Users, Percent, Filter, Download } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const AnalyticsConversionsPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [timeRange, setTimeRange] = useState('30d');

  const conversionMetrics = [
    { label: 'Conversion Rate', value: '3.24%', change: '+0.8%', trend: 'up', icon: Target },
    { label: 'Revenue per Visitor', value: '$12.45', change: '+15.2%', trend: 'up', icon: DollarSign },
    { label: 'Average Order Value', value: '$89.32', change: '+5.7%', trend: 'up', icon: ShoppingCart },
    { label: 'Lead Conversion', value: '12.8%', change: '+2.1%', trend: 'up', icon: Users },
  ];

  const funnelStages = [
    { stage: 'Page Views', visitors: 50000, percentage: 100, color: 'bg-blue-500' },
    { stage: 'Product Views', visitors: 15000, percentage: 30, color: 'bg-green-500' },
    { stage: 'Add to Cart', visitors: 4500, percentage: 9, color: 'bg-yellow-500' },
    { stage: 'Checkout', visitors: 2250, percentage: 4.5, color: 'bg-orange-500' },
    { stage: 'Purchase', visitors: 1620, percentage: 3.24, color: 'bg-red-500' },
  ];

  const goalCompletions = [
    { goal: 'Newsletter Signup', completions: 1245, rate: '8.3%', value: '$1,245', status: 'success' },
    { goal: 'Demo Request', completions: 342, rate: '2.3%', value: '$17,100', status: 'warning' },
    { goal: 'Product Purchase', completions: 156, rate: '1.0%', value: '$13,932', status: 'success' },
    { goal: 'Contact Form', completions: 89, rate: '0.6%', value: '$4,450', status: 'error' },
  ];

  const topConvertingPages = [
    { page: '/landing/special-offer', conversions: 89, rate: '15.6%', revenue: '$7,834' },
    { page: '/product/premium-plan', conversions: 67, rate: '12.3%', revenue: '$18,245' },
    { page: '/checkout/express', conversions: 45, rate: '8.9%', revenue: '$4,567' },
    { page: '/pricing', conversions: 34, rate: '6.7%', revenue: '$3,289' },
    { page: '/features/advanced', conversions: 23, rate: '4.2%', revenue: '$2,156' },
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
              Conversion Analytics
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track conversion funnels and sales performance
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
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
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

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {conversionMetrics.map((metric, index) => (
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
        {/* Conversion Funnel */}
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Conversion Funnel
          </h3>
          <div className="space-y-4">
            {funnelStages.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stage.stage}
                  </span>
                  <div className="text-right">
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stage.visitors.toLocaleString()}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stage.percentage}%
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className={`h-12 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`h-12 rounded-lg ${stage.color} transition-all duration-700 flex items-center justify-center`}
                      style={{ width: `${stage.percentage}%` }}
                    >
                      <span className="text-white font-medium text-sm">
                        {stage.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {index < funnelStages.length - 1 && (
                  <div className="flex justify-center mt-2">
                    <div className={`w-0.5 h-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Goal Completions */}
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Goal Completions
          </h3>
          <div className="space-y-4">
            {goalCompletions.map((goal) => (
              <div key={goal.goal} className={`p-4 rounded-lg border ${
                isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {goal.goal}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    goal.status === 'success' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : goal.status === 'warning'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {goal.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Completions
                    </div>
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {goal.completions}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Rate
                    </div>
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {goal.rate}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Value
                    </div>
                    <div className={`font-semibold text-green-600`}>
                      {goal.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Converting Pages */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Top Converting Pages
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
                  Conversions
                </th>
                <th className={`text-right py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Rate
                </th>
                <th className={`text-right py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {topConvertingPages.map((page, index) => (
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
                    {page.conversions}
                  </td>
                  <td className={`py-3 px-4 text-right ${
                    parseFloat(page.rate) > 10 ? 'text-green-500' : 
                    parseFloat(page.rate) > 5 ? 'text-yellow-500' : 'text-red-500'
                  } font-medium`}>
                    {page.rate}
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold text-green-600`}>
                    {page.revenue}
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

export default AnalyticsConversionsPage; 