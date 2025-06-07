import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Search,
  Home,
  BarChart3,
  Map,
  Heart,
} from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    role: 'Administrator',
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'New message received',
      message: 'You have received a new message from Sarah',
      time: '2 min ago',
      read: false,
      type: 'message',
    },
    {
      id: 2,
      title: 'System update available',
      message: 'A new system update is ready to install',
      time: '1 hour ago',
      read: false,
      type: 'system',
    },
    {
      id: 3,
      title: 'Report generated',
      message: 'Your monthly analytics report is ready',
      time: '3 hours ago',
      read: true,
      type: 'report',
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Navigation items for mobile
  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Map', href: '/map', icon: Map },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-secondary-200 dark:border-gray-700 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left section - Logo and Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            <motion.div animate={{ rotate: isSidebarOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-secondary-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-secondary-600 dark:text-gray-300" />
              )}
            </motion.div>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block text-xl font-bold text-secondary-900 dark:text-white">Blueprint</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-1 ml-8">
            {navigationItems.map(item => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-secondary-600 dark:text-gray-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center - Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-secondary-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right section - Notifications and User */}
        <div className="flex items-center space-x-2">
          {/* Mobile search button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-gray-700 transition-colors">
            <Search className="w-5 h-5 text-secondary-600 dark:text-gray-300" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-secondary-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>

            {/* Notifications dropdown */}
            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-secondary-200 dark:border-gray-700 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-secondary-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-secondary-50 dark:hover:bg-gray-700 cursor-pointer border-l-4 ${
                          notification.read
                            ? 'border-transparent'
                            : 'border-primary-500 bg-primary-50/30 dark:bg-primary-900/30'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-secondary-900 dark:text-white">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-secondary-600 dark:text-gray-300 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-secondary-400 dark:text-gray-500 mt-2">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full mt-1 ml-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-secondary-200 dark:border-gray-700">
                    <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-secondary-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-secondary-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-secondary-500 dark:text-gray-400">{user.role}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-secondary-400 dark:text-gray-500 transition-transform ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* User dropdown */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-secondary-200 dark:border-gray-700 py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-secondary-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-secondary-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-secondary-500 dark:text-gray-400">{user.email}</p>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 dark:text-gray-300 hover:bg-secondary-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 dark:text-gray-300 hover:bg-secondary-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                  </div>

                  <div className="border-t border-secondary-200 dark:border-gray-700 py-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-error-600 dark:text-red-400 hover:bg-error-50 dark:hover:bg-red-900/20">
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
