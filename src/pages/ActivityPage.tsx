import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Settings, Clock, Filter, Search, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const mockActivities = [
  {
    id: '1',
    type: 'user_action',
    action: 'User Login',
    user: 'john.doe@example.com',
    details: 'Successful login from Chrome on Windows',
    timestamp: new Date('2024-03-10T14:30:00'),
    status: 'success',
    ip: '192.168.1.100',
  },
  {
    id: '2',
    type: 'system',
    action: 'Database Backup',
    user: 'System',
    details: 'Automated daily backup completed successfully',
    timestamp: new Date('2024-03-10T14:25:00'),
    status: 'success',
    duration: '2.3 minutes',
  },
  {
    id: '3',
    type: 'user_action',
    action: 'Report Generated',
    user: 'alice.smith@example.com',
    details: 'Monthly sales report exported to PDF',
    timestamp: new Date('2024-03-10T14:20:00'),
    status: 'success',
    file: 'sales_report_march.pdf',
  },
  {
    id: '4',
    type: 'security',
    action: 'Failed Login Attempt',
    user: 'unknown@example.com',
    details: 'Multiple failed login attempts detected',
    timestamp: new Date('2024-03-10T14:15:00'),
    status: 'warning',
    attempts: 5,
  },
  {
    id: '5',
    type: 'system',
    action: 'Service Update',
    user: 'Admin',
    details: 'Dashboard service updated to version 2.1.0',
    timestamp: new Date('2024-03-10T13:45:00'),
    status: 'info',
    version: '2.1.0',
  },
];

const activityTypes = [
  { name: 'All Activities', value: 'all', count: 156, icon: Activity },
  { name: 'User Actions', value: 'user_action', count: 89, icon: Users },
  { name: 'System Events', value: 'system', count: 43, icon: Settings },
  { name: 'Security', value: 'security', count: 24, icon: AlertCircle },
];

const ActivityPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('24h');

  const filteredActivities = mockActivities.filter(activity => {
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
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
              Activity Log
            </h1>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Monitor user actions and system events
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Range */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-4 py-2 border rounded-lg ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            <button className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}>
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Activity Type Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {activityTypes.map((type, index) => (
          <motion.button
            key={type.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedType(type.value)}
            className={`p-4 rounded-lg border transition-all ${
              selectedType === type.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : isDarkMode
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
            } shadow-sm hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <type.icon className={`w-5 h-5 ${
                  selectedType === type.value ? 'text-primary-500' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {type.name}
                  </p>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {type.count} events
                  </p>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search activities..."
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

      {/* Activity Feed */}
      <div className={`rounded-lg border ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } shadow-sm overflow-hidden`}>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start space-x-4">
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(activity.status)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {activity.action}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                      <span className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {activity.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>

                  <p className={`text-sm mb-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {activity.details}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs">
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                        <strong>User:</strong> {activity.user}
                      </span>
                      {activity.ip && (
                        <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                          <strong>IP:</strong> {activity.ip}
                        </span>
                      )}
                      {activity.duration && (
                        <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                          <strong>Duration:</strong> {activity.duration}
                        </span>
                      )}
                      {activity.attempts && (
                        <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                          <strong>Attempts:</strong> {activity.attempts}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {activity.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <Activity className={`w-12 h-12 mx-auto mb-4 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h3 className={`text-lg font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            No activities found
          </h3>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Try adjusting your search criteria or time range.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ActivityPage; 