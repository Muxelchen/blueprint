import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Activity, AlertTriangle, CheckCircle, Clock, Cpu, HardDrive, Zap } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const mockDatabases = [
  {
    id: 'db1',
    name: 'Production DB',
    type: 'PostgreSQL',
    status: 'healthy',
    size: '45.2 GB',
    connections: 23,
    maxConnections: 100,
    uptime: '15 days',
    lastBackup: new Date('2024-03-10T02:00:00'),
  },
  {
    id: 'db2',
    name: 'Analytics DB',
    type: 'MongoDB',
    status: 'warning',
    size: '128.7 GB',
    connections: 87,
    maxConnections: 100,
    uptime: '7 days',
    lastBackup: new Date('2024-03-09T03:00:00'),
  },
  {
    id: 'db3',
    name: 'Cache Redis',
    type: 'Redis',
    status: 'healthy',
    size: '2.1 GB',
    connections: 156,
    maxConnections: 1000,
    uptime: '45 days',
    lastBackup: new Date('2024-03-10T01:00:00'),
  },
];

const systemMetrics = [
  { label: 'CPU Usage', value: 45, max: 100, unit: '%', status: 'healthy' },
  { label: 'Memory Usage', value: 67, max: 100, unit: '%', status: 'warning' },
  { label: 'Disk Usage', value: 78, max: 100, unit: '%', status: 'warning' },
  { label: 'Network I/O', value: 23, max: 100, unit: 'MB/s', status: 'healthy' },
];

const recentQueries = [
  {
    id: 1,
    query: 'SELECT * FROM users WHERE created_at > NOW() - INTERVAL 24 HOUR',
    database: 'Production DB',
    duration: '0.045s',
    timestamp: new Date('2024-03-10T14:30:00'),
    status: 'success',
  },
  {
    id: 2,
    query: 'UPDATE products SET price = price * 1.1 WHERE category = "electronics"',
    database: 'Production DB',
    duration: '2.134s',
    timestamp: new Date('2024-03-10T14:25:00'),
    status: 'success',
  },
  {
    id: 3,
    query: 'SELECT COUNT(*) FROM analytics_events WHERE date >= "2024-03-01"',
    database: 'Analytics DB',
    duration: '15.234s',
    timestamp: new Date('2024-03-10T14:20:00'),
    status: 'slow',
  },
];

const DatabasePage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedTab, setSelectedTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

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
              Database Management
            </h1>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Monitor and manage your database systems
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}>
              <Activity className="w-5 h-5" />
            </button>
            <button className="btn-primary">
              <Server className="w-4 h-4 mr-2" />
              New Connection
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className={`flex space-x-1 rounded-lg p-1 ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          {[
            { id: 'overview', name: 'Overview', icon: Database },
            { id: 'performance', name: 'Performance', icon: Zap },
            { id: 'queries', name: 'Query Log', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {selectedTab === 'overview' && (
        <>
          {/* Database Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockDatabases.map((db, index) => (
              <motion.div
                key={db.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Database className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {db.name}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {db.type}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBg(db.status)}`}>
                    {db.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Size</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{db.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Connections</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      {db.connections}/{db.maxConnections}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Uptime</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{db.uptime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Last Backup</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      {db.lastBackup.toLocaleDateString()}
                    </span>
                  </div>

                  {/* Connection Usage Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Connection Usage</span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {Math.round((db.connections / db.maxConnections) * 100)}%
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          (db.connections / db.maxConnections) > 0.8 ? 'bg-red-500' :
                          (db.connections / db.maxConnections) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(db.connections / db.maxConnections) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* System Metrics */}
          <div className={`p-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-sm`}>
            <h3 className={`text-lg font-semibold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              System Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemMetrics.map((metric, index) => (
                <div key={metric.label} className="text-center">
                  <div className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {metric.label}
                  </div>
                  <div className={`text-2xl font-bold mb-2 ${getStatusColor(metric.status)}`}>
                    {metric.value}{metric.unit}
                  </div>
                  <div className={`w-full h-2 rounded-full mb-2 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        metric.value > 80 ? 'bg-red-500' :
                        metric.value > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    ></div>
                  </div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    of {metric.max}{metric.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {selectedTab === 'queries' && (
        <div className={`rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-sm overflow-hidden`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Recent Queries
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentQueries.map((query) => (
              <div key={query.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <code className={`text-sm font-mono p-3 rounded-lg block ${
                      isDarkMode ? 'bg-gray-900 text-green-400' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {query.query}
                    </code>
                  </div>
                  <span className={`ml-4 px-2 py-1 text-xs rounded-full ${
                    query.status === 'success' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {query.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      <strong>Database:</strong> {query.database}
                    </span>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      <strong>Duration:</strong> {query.duration}
                    </span>
                  </div>
                  <span className={`text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {query.timestamp.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DatabasePage; 