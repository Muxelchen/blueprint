import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Clock, MapPin, Smartphone } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const ActivityUsersPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');

  const userActivities = [
    {
      id: 1,
      user: 'john.doe@example.com',
      name: 'John Doe',
      action: 'Logged in',
      timestamp: '2024-01-15T10:30:00Z',
      location: 'New York, NY',
      device: 'Desktop',
      ip: '192.168.1.1',
      status: 'success'
    },
    {
      id: 2,
      user: 'alice.smith@example.com',
      name: 'Alice Smith',
      action: 'Updated profile',
      timestamp: '2024-01-15T10:25:00Z',
      location: 'San Francisco, CA',
      device: 'Mobile',
      ip: '192.168.1.2',
      status: 'success'
    },
    {
      id: 3,
      user: 'bob.wilson@example.com',
      name: 'Bob Wilson',
      action: 'Failed login attempt',
      timestamp: '2024-01-15T10:20:00Z',
      location: 'Unknown',
      device: 'Desktop',
      ip: '203.0.113.1',
      status: 'warning'
    },
    {
      id: 4,
      user: 'carol.brown@example.com',
      name: 'Carol Brown',
      action: 'Downloaded report',
      timestamp: '2024-01-15T10:15:00Z',
      location: 'Chicago, IL',
      device: 'Tablet',
      ip: '192.168.1.3',
      status: 'success'
    },
    {
      id: 5,
      user: 'david.jones@example.com',
      name: 'David Jones',
      action: 'Account locked',
      timestamp: '2024-01-15T10:10:00Z',
      location: 'Miami, FL',
      device: 'Mobile',
      ip: '198.51.100.1',
      status: 'error'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop': return '🖥️';
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      default: return '💻';
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
              User Activity
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor user actions and behavior patterns
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
            placeholder="Search user activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Activity Feed */}
      <div className={`rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`text-left py-3 px-6 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  User
                </th>
                <th className={`text-left py-3 px-6 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Action
                </th>
                <th className={`text-left py-3 px-6 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Time
                </th>
                <th className={`text-left py-3 px-6 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Location
                </th>
                <th className={`text-left py-3 px-6 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Device
                </th>
                <th className={`text-left py-3 px-6 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {userActivities.map((activity, index) => (
                <motion.tr
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-b ${
                    isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {activity.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {activity.name}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {activity.user}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`py-4 px-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {activity.action}
                  </td>
                  <td className={`py-4 px-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className={`py-4 px-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{activity.location}</span>
                    </div>
                  </td>
                  <td className={`py-4 px-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getDeviceIcon(activity.device)}</span>
                      <span>{activity.device}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityUsersPage; 