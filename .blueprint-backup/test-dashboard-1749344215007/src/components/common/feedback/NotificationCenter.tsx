import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Search,
  Filter,
  Settings,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Archive,
  Star,
  Clock,
  Users,
  Tag,
} from 'lucide-react';
import { useNotifications } from '../../../hooks/useNotifications';
import { usePushNotification } from './PushNotification';
import { useToast } from './ToastNotification';
import { useAlertManager } from './AlertBanner';
import { useProgressNotification } from './ProgressNotification';
import type { NotificationType } from '../../../types/notifications';

export interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'center';
  width?: number;
  height?: number;
  showSearch?: boolean;
  showFilters?: boolean;
  showSettings?: boolean;
  maxItems?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
}

interface NotificationFilter {
  type?: NotificationType | 'all';
  read?: boolean | 'all';
  source?: 'push' | 'toast' | 'alert' | 'progress' | 'all';
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: 'low' | 'normal' | 'high' | 'urgent' | 'all';
}

interface NotificationSettings {
  autoMarkAsRead: boolean;
  groupSimilar: boolean;
  showTimestamps: boolean;
  soundEnabled: boolean;
  compactView: boolean;
  maxVisible: number;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  position = 'right',
  width = 400,
  height = 600,
  showSearch = true,
  showFilters = true,
  showSettings = true,
  maxItems = 50,
  autoRefresh = true,
  refreshInterval = 30000,
  className = '',
}) => {
  // Hooks for different notification systems
  const notificationSystem = useNotifications();
  const { isSupported: pushSupported, permission: pushPermission } = usePushNotification();
  const toastSystem = useToast();
  const alertSystem = useAlertManager();
  const progressSystem = useProgressNotification();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<NotificationFilter>({
    type: 'all',
    read: 'all',
    source: 'all',
    priority: 'all',
  });
  const [settings, setSettings] = useState<NotificationSettings>({
    autoMarkAsRead: false,
    groupSimilar: true,
    showTimestamps: true,
    soundEnabled: true,
    compactView: false,
    maxVisible: 20,
  });
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Combine all notifications into a unified list
  const allNotifications = useMemo(() => {
    const notifications: Array<{
      id: string;
      type: NotificationType;
      title: string;
      message: string;
      source: 'main' | 'toast' | 'alert' | 'progress';
      timestamp: number;
      priority: 'low' | 'normal' | 'high' | 'urgent';
      read: boolean;
      progress?: number;
    }> = [];

    // Add notifications from the main system
    notificationSystem.notifications.forEach(notif => {
      notifications.push({
        id: notif.id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        source: 'main' as const,
        timestamp: notif.createdAt,
        priority: 'normal' as const,
        read: notif.read || false,
      });
    });

    // Add toast notifications
    toastSystem.toasts.forEach(toast => {
      notifications.push({
        id: toast.id,
        type: toast.type === 'notification' ? 'info' : toast.type,
        title: toast.title,
        message: toast.message || '',
        source: 'toast' as const,
        timestamp: Date.now(),
        priority: toast.type === 'error' ? 'high' : ('normal' as const),
        read: false,
      });
    });

    // Add alert notifications
    alertSystem.alerts.forEach(alert => {
      notifications.push({
        id: alert.id,
        type: alert.type === 'announcement' ? 'info' : alert.type,
        title: alert.title,
        message: alert.message || '',
        source: 'alert' as const,
        timestamp: Date.now(),
        priority: alert.type === 'error' ? 'high' : ('normal' as const),
        read: false,
      });
    });

    // Add progress notifications
    progressSystem.notifications.forEach(progress => {
      notifications.push({
        id: progress.id,
        type:
          progress.status === 'error'
            ? 'error'
            : progress.status === 'completed'
              ? 'success'
              : 'info',
        title: progress.title,
        message: progress.description || `${Math.round(progress.progress)}% complete`,
        source: 'progress' as const,
        timestamp: progress.state.startTime,
        priority: progress.status === 'error' ? 'high' : ('normal' as const),
        read: false,
        progress: progress.progress,
      });
    });

    return notifications;
  }, [
    notificationSystem.notifications,
    toastSystem.toasts,
    alertSystem.alerts,
    progressSystem.notifications,
  ]);

  // Filter and search notifications
  const filteredNotifications = useMemo(() => {
    let filtered = allNotifications;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        notif =>
          notif.title?.toLowerCase().includes(query) || notif.message?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(notif => notif.type === filters.type);
    }

    if (filters.read !== 'all') {
      filtered = filtered.filter(notif => notif.read === filters.read);
    }

    if (filters.source && filters.source !== 'all') {
      filtered = filtered.filter(notif => notif.source === filters.source);
    }

    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(notif => notif.priority === filters.priority);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = a.timestamp - b.timestamp;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered.slice(0, maxItems);
  }, [allNotifications, searchQuery, filters, sortBy, sortOrder, maxItems]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // This will trigger re-computation of allNotifications
      // through the hooks' state updates
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Handle bulk actions
  const handleSelectAll = useCallback(() => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  }, [selectedNotifications.size, filteredNotifications]);

  const handleBulkMarkAsRead = useCallback(() => {
    selectedNotifications.forEach(id => {
      const notification = filteredNotifications.find(n => n.id === id);
      if (notification && notification.source === 'main') {
        notificationSystem.markAsRead(id);
      }
    });
    setSelectedNotifications(new Set());
  }, [selectedNotifications, filteredNotifications, notificationSystem]);

  const handleBulkDelete = useCallback(() => {
    selectedNotifications.forEach(id => {
      const notification = filteredNotifications.find(n => n.id === id);
      if (notification) {
        switch (notification.source) {
          case 'main':
            notificationSystem.removeNotification(id);
            break;
          case 'toast':
            toastSystem.removeToast(id);
            break;
          case 'alert':
            alertSystem.removeAlert(id);
            break;
          case 'progress':
            progressSystem.removeProgressNotification(id);
            break;
        }
      }
    });
    setSelectedNotifications(new Set());
  }, [
    selectedNotifications,
    filteredNotifications,
    notificationSystem,
    toastSystem,
    alertSystem,
    progressSystem,
  ]);

  // Get notification icon
  const getNotificationIcon = (type: string, source: string) => {
    if (source === 'progress') {
      return <RefreshCw className="w-4 h-4" />;
    }

    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'left-4';
      case 'center':
        return 'left-1/2 transform -translate-x-1/2';
      case 'right':
      default:
        return 'right-4';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
        className={`fixed top-16 ${getPositionClasses()} z-50 bg-white rounded-lg shadow-2xl border border-gray-200 ${className}`}
        style={{ width, maxHeight: height }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {filteredNotifications.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {showFilters && (
                <button
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  className={`p-1 rounded-md hover:bg-gray-200 transition-colors ${
                    showFiltersPanel ? 'bg-gray-200' : ''
                  }`}
                >
                  <Filter className="w-4 h-4" />
                </button>
              )}
              {showSettings && (
                <button
                  onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                  className={`p-1 rounded-md hover:bg-gray-200 transition-colors ${
                    showSettingsPanel ? 'bg-gray-200' : ''
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          {showSearch && (
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Quick Actions */}
          {selectedNotifications.size > 0 && (
            <div className="mt-3 flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedNotifications.size} selected</span>
              <button
                onClick={handleBulkMarkAsRead}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Mark as Read
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedNotifications(new Set())}
                className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFiltersPanel && (
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={e => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">All Types</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={filters.source}
                  onChange={e => setFilters(prev => ({ ...prev, source: e.target.value as any }))}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">All Sources</option>
                  <option value="main">Main</option>
                  <option value="toast">Toast</option>
                  <option value="alert">Alert</option>
                  <option value="progress">Progress</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettingsPanel && (
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.autoMarkAsRead}
                  onChange={e =>
                    setSettings(prev => ({ ...prev, autoMarkAsRead: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Auto-mark as read</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.compactView}
                  onChange={e => setSettings(prev => ({ ...prev, compactView: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Compact view</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.showTimestamps}
                  onChange={e =>
                    setSettings(prev => ({ ...prev, showTimestamps: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Show timestamps</span>
              </label>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: height - 200 }}>
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  isSelected={selectedNotifications.has(notification.id)}
                  isCompact={settings.compactView}
                  showTimestamp={settings.showTimestamps}
                  onSelect={(id, selected) => {
                    const newSelection = new Set(selectedNotifications);
                    if (selected) {
                      newSelection.add(id);
                    } else {
                      newSelection.delete(id);
                    }
                    setSelectedNotifications(newSelection);
                  }}
                  onMarkAsRead={id => {
                    if (notification.source === 'main') {
                      notificationSystem.markAsRead(id);
                    }
                  }}
                  onDelete={id => {
                    switch (notification.source) {
                      case 'main':
                        notificationSystem.removeNotification(id);
                        break;
                      case 'toast':
                        toastSystem.removeToast(id);
                        break;
                      case 'alert':
                        alertSystem.removeAlert(id);
                        break;
                      case 'progress':
                        progressSystem.removeProgressNotification(id);
                        break;
                    }
                  }}
                  getIcon={getNotificationIcon}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {selectedNotifications.size === filteredNotifications.length
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
              <button
                onClick={() => {
                  notificationSystem.clearAllNotifications();
                  toastSystem.clearAll();
                  alertSystem.clearAllAlerts();
                  progressSystem.clearAll();
                }}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear All
              </button>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Individual notification item component
interface NotificationItemProps {
  notification: any;
  isSelected: boolean;
  isCompact: boolean;
  showTimestamp: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getIcon: (type: string, source: string) => React.ReactNode;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  isSelected,
  isCompact,
  showTimestamp,
  onSelect,
  onMarkAsRead,
  onDelete,
  getIcon,
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div
      className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      } ${!notification.read ? 'bg-blue-50/30' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start space-x-3">
        {/* Selection checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={e => onSelect(notification.id, e.target.checked)}
          className="mt-1 rounded"
        />

        {/* Icon */}
        <div className="flex-shrink-0 mt-1">{getIcon(notification.type, notification.source)}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`font-medium text-gray-900 ${isCompact ? 'text-sm' : ''}`}>
                {notification.title}
              </h4>
              {!isCompact && notification.message && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
              )}
              {notification.progress !== undefined && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${notification.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {Math.round(notification.progress)}% complete
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-3 mt-2">
                {showTimestamp && (
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                )}
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {notification.source}
                </span>
                {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center space-x-1 ml-2">
                {!notification.read && (
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                    title="Mark as read"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(notification.id)}
                  className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
