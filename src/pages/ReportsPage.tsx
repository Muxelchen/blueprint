import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, Search, Calendar, BarChart3, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const mockReports = [
  {
    id: '1',
    title: 'Monthly Sales Report',
    description: 'Comprehensive overview of sales performance for the current month',
    type: 'Sales',
    status: 'Ready',
    lastGenerated: new Date('2024-03-10'),
    size: '2.4 MB',
    format: 'PDF',
    metrics: { totalSales: '$124,563', growth: '+12.5%' },
  },
  {
    id: '2',
    title: 'User Engagement Analytics',
    description: 'Detailed analysis of user behavior and engagement patterns',
    type: 'Analytics',
    status: 'Processing',
    lastGenerated: new Date('2024-03-09'),
    size: '1.8 MB',
    format: 'Excel',
    metrics: { activeUsers: '8,549', retention: '68%' },
  },
  {
    id: '3',
    title: 'Performance Dashboard',
    description: 'System performance metrics and optimization recommendations',
    type: 'Performance',
    status: 'Ready',
    lastGenerated: new Date('2024-03-08'),
    size: '3.1 MB',
    format: 'PDF',
    metrics: { loadTime: '1.2s', uptime: '99.9%' },
  },
];

const reportTypes = [
  { name: 'All Reports', value: 'all', count: 12 },
  { name: 'Sales', value: 'sales', count: 4 },
  { name: 'Analytics', value: 'analytics', count: 5 },
  { name: 'Performance', value: 'performance', count: 3 },
];

const ReportsPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = mockReports.filter(report => {
    const matchesType = selectedType === 'all' || report.type.toLowerCase() === selectedType;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

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
              Reports
            </h1>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Generate and manage your business reports
            </p>
          </div>
          
          <button className="btn-primary">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Reports', value: '24', icon: FileText, color: 'text-blue-500' },
          { label: 'Generated Today', value: '3', icon: Clock, color: 'text-green-500' },
          { label: 'Automated Reports', value: '8', icon: BarChart3, color: 'text-purple-500' },
          { label: 'Downloaded This Week', value: '16', icon: Download, color: 'text-orange-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            } shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        {/* Report Type Filter */}
        <div className="flex space-x-2">
          {reportTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type.value
                  ? 'bg-primary-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.name} ({type.count})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            } shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
          >
            {/* Report Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <FileText className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {report.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'Ready'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className={`text-sm mb-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {report.description}
            </p>

            {/* Metrics */}
            <div className="flex items-center space-x-4 mb-4 text-sm">
              {Object.entries(report.metrics).map(([key, value]) => (
                <div key={key} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Generated {report.lastGenerated.toLocaleDateString()}
                <span className="mx-1">•</span>
                {report.size} {report.format}
              </div>
              <button className={`p-1 rounded transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}>
                <Download className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className={`w-12 h-12 mx-auto mb-4 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h3 className={`text-lg font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            No reports found
          </h3>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Try adjusting your search criteria or generate a new report.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ReportsPage; 