import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, CreditCard, Receipt, Filter, Download } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const AnalyticsRevenuePage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [timeRange, setTimeRange] = useState('30d');

  const revenueMetrics = [
    { label: 'Total Revenue', value: '$156,789', change: '+18.2%', trend: 'up', icon: DollarSign },
    { label: 'Monthly Recurring Revenue', value: '$45,230', change: '+12.5%', trend: 'up', icon: Receipt },
    { label: 'Average Revenue Per User', value: '$89.45', change: '+5.7%', trend: 'up', icon: CreditCard },
    { label: 'Lifetime Value', value: '$456.78', change: '+8.9%', trend: 'up', icon: TrendingUp },
  ];

  const revenueBySource = [
    { source: 'Subscription Plans', amount: 89250, percentage: 56.9, change: '+15.2%', color: 'bg-blue-500' },
    { source: 'One-time Purchases', amount: 34567, percentage: 22.0, change: '+8.7%', color: 'bg-green-500' },
    { source: 'Premium Features', amount: 21456, percentage: 13.7, change: '+25.4%', color: 'bg-purple-500' },
    { source: 'Consulting Services', amount: 11516, percentage: 7.4, change: '+12.1%', color: 'bg-orange-500' },
  ];

  const topCustomers = [
    { name: 'Enterprise Corp', revenue: '$12,450', plan: 'Enterprise', growth: '+23%' },
    { name: 'TechStart Inc', revenue: '$8,900', plan: 'Professional', growth: '+15%' },
    { name: 'Global Solutions', revenue: '$7,650', plan: 'Enterprise', growth: '+31%' },
    { name: 'Innovation Labs', revenue: '$6,200', plan: 'Professional', growth: '+8%' },
    { name: 'Digital Agency', revenue: '$5,800', plan: 'Business', growth: '+45%' },
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
              Revenue Analytics
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track revenue performance and financial metrics
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

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {revenueMetrics.map((metric, index) => (
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
        {/* Revenue by Source */}
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Revenue by Source
          </h3>
          <div className="space-y-4">
            {revenueBySource.map((source) => (
              <div key={source.source} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {source.source}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${source.amount.toLocaleString()}
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

        {/* Top Customers */}
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Top Customers by Revenue
          </h3>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={customer.name} className={`p-4 rounded-lg border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {customer.name}
                    </h4>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      customer.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                      customer.plan === 'Professional' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {customer.plan}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {customer.revenue}
                    </div>
                    <div className="text-sm text-green-500">
                      {customer.growth} growth
                    </div>
                  </div>
                </div>
                <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                       style={{ width: `${(parseFloat(customer.revenue.replace('$', '').replace(',', '')) / 15000) * 100}%` }}>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Forecast */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Revenue Forecast
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
          }`}>
            <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
              Next Month
            </h4>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
              $192,450
            </div>
            <div className="text-sm text-green-600">
              +22.7% projected growth
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
          }`}>
            <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              Quarterly Goal
            </h4>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              $550,000
            </div>
            <div className="text-sm text-blue-600">
              68% completed
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-purple-900/30 border border-purple-700' : 'bg-purple-50 border border-purple-200'
          }`}>
            <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
              Annual Target
            </h4>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
              $2.1M
            </div>
            <div className="text-sm text-purple-600">
              On track to exceed
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsRevenuePage; 