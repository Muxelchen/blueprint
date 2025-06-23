import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Shield, Bell, Palette, Globe, Monitor } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [selectedTab, setSelectedTab] = useState('general');

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      desktop: false,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      analyticsEnabled: true,
    },
    appearance: {
      theme: isDarkMode ? 'dark' : 'light',
      language: 'en',
      timezone: 'America/New_York',
    }
  });

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'account', name: 'Account', icon: User },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
  ];

  const handleToggle = (category: string, setting: string) => {
    setSettings(prev => {
      const categoryData = prev[category as keyof typeof prev] as Record<string, boolean>;
      return {
        ...prev,
        [category]: {
          ...categoryData,
          [setting]: !categoryData[setting]
        }
      };
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
    >
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>
        <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } shadow-sm`}>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className={`p-6 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } shadow-sm`}>
            
            {selectedTab === 'notifications' && (
              <div>
                <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Notification Preferences
                </h3>
                <div className="space-y-6">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Receive notifications via {key}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleToggle('notifications', key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'privacy' && (
              <div>
                <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Privacy Settings
                </h3>
                <div className="space-y-6">
                  {Object.entries(settings.privacy).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Control your privacy preferences
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleToggle('privacy', key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'appearance' && (
              <div>
                <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Appearance Settings
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Theme
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'light', name: 'Light', icon: '☀️' },
                        { id: 'dark', name: 'Dark', icon: '🌙' },
                        { id: 'system', name: 'System', icon: '🖥️' },
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            if (theme.id === 'dark' && !isDarkMode) toggleDarkMode();
                            if (theme.id === 'light' && isDarkMode) toggleDarkMode();
                          }}
                          className={`p-4 rounded-lg border-2 text-center transition-colors ${
                            (theme.id === 'dark' && isDarkMode) || (theme.id === 'light' && !isDarkMode)
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{theme.icon}</div>
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {theme.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Language
                    </h4>
                    <select className={`w-full p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Timezone
                    </h4>
                    <select className={`w-full p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'general' && (
              <div>
                <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  General Settings
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Application Name
                    </h4>
                    <input
                      type="text"
                      defaultValue="Blueprint Dashboard"
                      className={`w-full p-3 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Default Page
                    </h4>
                    <select className={`w-full p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <option value="/dashboard">Dashboard</option>
                      <option value="/analytics">Analytics</option>
                      <option value="/projects">Projects</option>
                      <option value="/calendar">Calendar</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'account' && (
              <div>
                <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Account Settings
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Email Address
                    </h4>
                    <input
                      type="email"
                      defaultValue="user@example.com"
                      className={`w-full p-3 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Change Password
                    </h4>
                    <button className="btn-primary">
                      Update Password
                    </button>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className={`font-medium mb-3 text-red-600`}>
                      Danger Zone
                    </h4>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage; 