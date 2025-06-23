import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Search, Filter, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const ActivityLogsPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');

  const systemLogs = [
    {
      id: 1,
      level: 'error',
      message: 'Database connection failed',
      timestamp: '2024-01-15T10:30:15Z',
      service: 'auth-service',
      details: 'Connection timeout after 30 seconds'
    },
    {
      id: 2,
      level: 'warning',
      message: 'High memory usage detected',
      timestamp: '2024-01-15T10:28:42Z',
      service: 'api-gateway',
      details: 'Memory usage at 85%'
    },
    {
      id: 3,
      level: 'info',
      message: 'Scheduled backup completed',
      timestamp: '2024-01-15T10:25:30Z',
      service: 'backup-service',
      details: 'Backup size: 2.4GB'
    },
    {
      id: 4,
      level: 'success',
      message: 'Security scan completed',
      timestamp: '2024-01-15T10:20:18Z',
      service: 'security-scanner',
      details: 'No vulnerabilities found'
    },
    {
      id: 5,
      level: 'error',
      message: 'Failed to send notification',
      timestamp: '2024-01-15T10:15:05Z',
      service: 'notification-service',
      details: 'SMTP server unreachable'
    }
  ];

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'success': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

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
              System Logs
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor system events and error logs
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border font-mono ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {systemLogs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getLogColor(log.level)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getLogIcon(log.level)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`font-mono text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {log.message}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {log.service}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Terminal className={`w-4 h-4 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <span className={`font-mono ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {log.details && (
                    <div className={`mt-2 text-sm font-mono ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {log.details}
                    </div>
                  )}
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
                log.level === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                log.level === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                log.level === 'info' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              }`}>
                {log.level}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ActivityLogsPage; 