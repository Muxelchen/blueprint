import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Lock, Eye, EyeOff, Users, Activity, Key, Settings } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const securityAlerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Multiple Failed Login Attempts',
    description: 'User admin@company.com has 5 failed login attempts in the last 10 minutes',
    timestamp: new Date('2024-03-10T14:30:00'),
    resolved: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Unusual Access Pattern',
    description: 'Login from unusual location: Moscow, Russia for user john.doe@company.com',
    timestamp: new Date('2024-03-10T13:45:00'),
    resolved: false,
  },
  {
    id: 3,
    type: 'info',
    title: 'Password Policy Update',
    description: 'Password policy has been updated to require 12 character minimum',
    timestamp: new Date('2024-03-10T12:00:00'),
    resolved: true,
  },
];

const userActivities = [
  {
    id: 1,
    user: 'John Doe',
    email: 'john.doe@company.com',
    action: 'Login',
    location: 'New York, USA',
    device: 'MacBook Pro',
    timestamp: new Date('2024-03-10T14:25:00'),
    status: 'success',
  },
  {
    id: 2,
    user: 'Sarah Smith',
    email: 'sarah.smith@company.com',
    action: 'Data Export',
    location: 'London, UK',
    device: 'Windows PC',
    timestamp: new Date('2024-03-10T14:20:00'),
    status: 'success',
  },
  {
    id: 3,
    user: 'Admin User',
    email: 'admin@company.com',
    action: 'Failed Login',
    location: 'Unknown',
    device: 'Unknown',
    timestamp: new Date('2024-03-10T14:15:00'),
    status: 'failed',
  },
];

const securityMetrics = [
  { label: 'Active Sessions', value: 143, change: '+12%', trend: 'up' },
  { label: 'Failed Logins (24h)', value: 23, change: '-8%', trend: 'down' },
  { label: 'Security Alerts', value: 7, change: '+3', trend: 'up' },
  { label: 'Compliance Score', value: 94, change: '+2%', trend: 'up' },
];

const SecurityPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showAPIKey, setShowAPIKey] = useState(false);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
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
              Security Center
            </h1>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Monitor security events and manage access controls
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
              <Shield className="w-4 h-4 mr-2" />
              Run Security Scan
            </button>
          </div>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {securityMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
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
                  {metric.label}
                </p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {metric.value}
                </p>
              </div>
              <div className={`text-sm ${
                metric.trend === 'up' 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {metric.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className={`flex space-x-1 rounded-lg p-1 ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          {[
            { id: 'overview', name: 'Overview', icon: Shield },
            { id: 'alerts', name: 'Security Alerts', icon: AlertTriangle },
            { id: 'activity', name: 'User Activity', icon: Users },
            { id: 'settings', name: 'Settings', icon: Settings },
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

      {selectedTab === 'alerts' && (
        <div className={`rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-sm overflow-hidden`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Security Alerts
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {alert.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {alert.description}
                      </p>
                      <p className={`text-xs mt-2 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getAlertColor(alert.type)}`}>
                      {alert.type}
                    </span>
                    {!alert.resolved && (
                      <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'activity' && (
        <div className={`rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-sm overflow-hidden`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Recent User Activity
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {userActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.status === 'success' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                    }`}>
                      {activity.status === 'success' ? 
                        <Users className="w-5 h-5" /> : 
                        <AlertTriangle className="w-5 h-5" />
                      }
                    </div>
                    <div>
                      <h4 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {activity.user}
                      </h4>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {activity.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {activity.action}
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {activity.location} • {activity.device}
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {activity.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'settings' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-sm`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Authentication Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Two-Factor Authentication
                  </h4>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button className="btn-primary">
                  Enable 2FA
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Session Timeout
                  </h4>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Automatically log out inactive users
                  </p>
                </div>
                <select className={`px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}>
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                </select>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-sm`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              API Security
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  API Key
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type={showAPIKey ? 'text' : 'password'}
                    value="sk-1234567890abcdef"
                    readOnly
                    className={`flex-1 px-3 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                  <button
                    onClick={() => setShowAPIKey(!showAPIKey)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {showAPIKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button className="btn-secondary">
                    <Key className="w-4 h-4 mr-2" />
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Alerts */}
          <div className={`p-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-sm`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Recent Security Alerts
            </h3>
            <div className="space-y-3">
              {securityAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {alert.title}
                    </h4>
                    <p className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className={`p-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-sm`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Security Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Firewall Status
                </span>
                <span className="text-green-500 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  SSL Certificate
                </span>
                <span className="text-green-500 font-medium">Valid</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Last Security Scan
                </span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  2 hours ago
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Vulnerability Score
                </span>
                <span className="text-green-500 font-medium">Low Risk</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SecurityPage; 