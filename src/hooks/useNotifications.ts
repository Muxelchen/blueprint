import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useWebSocket from './useWebSocket';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
  createdAt: number;
  actions?: NotificationAction[];
  read?: boolean;
  data?: any;
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface NotificationsState {
  notifications: Notification[];
  notificationCount: {
    total: number;
    unread: number;
  };
  notificationHistory: Notification[];
  showUnreadBadge: boolean;
}

export interface NotificationsContextValue extends NotificationsState {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setShowUnreadBadge: (show: boolean) => void;
  getNotificationsByType: (type: NotificationType) => Notification[];
  success: (title: string, message: string, options?: Partial<Notification>) => string;
  error: (title: string, message: string, options?: Partial<Notification>) => string;
  warning: (title: string, message: string, options?: Partial<Notification>) => string;
  info: (title: string, message: string, options?: Partial<Notification>) => string;
}

// Create context
const NotificationsContext = createContext<NotificationsContextValue | undefined>(
  undefined
);

const STORAGE_KEY = 'blueprint_notification_settings';
const HISTORY_KEY = 'blueprint_notification_history';
const MAX_HISTORY = 100;
const DEFAULT_DURATION = 5000;

// Provider component
export const NotificationsProvider: React.FC<{ 
  children: React.ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
  disableHistory?: boolean;
}> = ({ 
  children, 
  maxNotifications = 5, 
  defaultDuration = DEFAULT_DURATION,
  disableHistory = false
}) => {
  const notificationsValue = useProvideNotifications(maxNotifications, defaultDuration, disableHistory);

  return React.createElement(NotificationsContext.Provider, { value: notificationsValue }, children);
};

// Implementation hook
function useProvideNotifications(
  maxNotifications: number, 
  defaultDuration: number,
  disableHistory: boolean
): NotificationsContextValue {
  const [state, setState] = useState<NotificationsState>(() => {
    // Load notification preferences from localStorage
    const storedPreferences = typeof window !== 'undefined' 
      ? localStorage.getItem(STORAGE_KEY) 
      : null;

    // Load notification history from localStorage
    const storedHistory = !disableHistory && typeof window !== 'undefined'
      ? localStorage.getItem(HISTORY_KEY) 
      : null;

    const parsedPreferences = storedPreferences 
      ? JSON.parse(storedPreferences) 
      : { showUnreadBadge: true };

    const parsedHistory = storedHistory
      ? JSON.parse(storedHistory)
      : [];

    return {
      notifications: [],
      notificationCount: {
        total: 0,
        unread: 0
      },
      notificationHistory: parsedHistory,
      showUnreadBadge: parsedPreferences.showUnreadBadge
    };
  });

  // Save notification preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        showUnreadBadge: state.showUnreadBadge
      }));
    }
  }, [state.showUnreadBadge]);

  // Save notification history to localStorage
  useEffect(() => {
    if (!disableHistory && typeof window !== 'undefined') {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(state.notificationHistory));
    }
  }, [state.notificationHistory, disableHistory]);

  // Connect to WebSocket
  const { 
    connected, 
    lastMessage, 
    send, 
    subscribe, 
    unsubscribe 
  } = useWebSocket({
    url: 'wss://api.example.com/ws',
    autoConnect: true,
    debug: process.env.NODE_ENV === 'development'
  });

  // Subscribe to notifications channel when connected
  useEffect(() => {
    if (connected) {
      subscribe('notifications');
      // Request initial notifications
      send('REQUEST_DATA', { dataType: 'notifications' });
    }
    return () => {
      if (connected) {
        unsubscribe('notifications');
      }
    };
  }, [connected, subscribe, unsubscribe, send]);

  // Process incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    try {
      // Handle new notification
      if (lastMessage.type === 'NOTIFICATION') {
        const notification = lastMessage.payload as Notification;
        addNotificationToState(notification);
      }
      
      // Handle notification history
      else if (lastMessage.type === 'NOTIFICATION_HISTORY') {
        const history = lastMessage.payload;
        if (history && Array.isArray(history.notifications)) {
          setState(prev => {
            // Combine existing notifications with new ones, remove duplicates
            const combined = [...prev.notifications, ...history.notifications];
            const unique = combined.filter((notification, index, self) => 
              self.findIndex(n => n.id === notification.id) === index
            );
            // Sort by date (newest first) and limit to max
            return {
              ...prev,
              notifications: unique
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, maxNotifications),
              notificationCount: {
                total: unique.length,
                unread: unique.filter(n => !n.read).length
              }
            };
          });
        }
      }
    } catch (error) {
      console.error('Error processing notification message:', error);
    }
  }, [lastMessage, maxNotifications]);

  // Calculate unread count
  const unreadCount = state.notifications.filter(notification => !notification.read).length;

  // Add a new notification
  const addNotificationToState = useCallback((notification: Notification) => {
    setState(prev => {
      // Check if notification already exists
      const exists = prev.notifications.some(item => item.id === notification.id);
      if (exists) return prev;
      
      // Add new notification at the beginning (newest first)
      const updated = {
        ...prev,
        notifications: [notification, ...prev.notifications].slice(0, maxNotifications)
      };
      return updated;
    });
  }, [maxNotifications]);

  // Add a local notification (not from WebSocket)
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      createdAt: Date.now(),
      read: notification.read ?? false
    };
    
    addNotificationToState(newNotification);
    
    // Optional: Send notification to server via WebSocket
    if (connected) {
      send('BROADCAST_NOTIFICATION', newNotification);
    }
    return newNotification.id;
  }, [connected, send, addNotificationToState]);

  // Remove a notification
  const removeNotification = useCallback((id: string): void => {
    setState((prev) => {
      const notifications = prev.notifications.filter(
        (notification) => notification.id !== id
      );

      return {
        ...prev,
        notifications,
        notificationCount: {
          total: notifications.length,
          unread: notifications.filter(n => !n.read).length
        }
      };
    });
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      notifications: [],
      notificationCount: {
        total: 0,
        unread: 0
      }
    }));
  }, []);

  // Mark a notification as read
  const markAsRead = useCallback((id: string): void => {
    setState((prev) => {
      const notifications = prev.notifications.map((notification) => {
        if (notification.id === id) {
          return { ...notification, read: true };
        }
        return notification;
      });

      const notificationHistory = prev.notificationHistory.map((notification) => {
        if (notification.id === id) {
          return { ...notification, read: true };
        }
        return notification;
      });

      return {
        ...prev,
        notifications,
        notificationHistory,
        notificationCount: {
          total: notifications.length,
          unread: notifications.filter(n => !n.read).length
        }
      };
    });
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback((): void => {
    setState((prev) => {
      const notifications = prev.notifications.map((notification) => ({
        ...notification,
        read: true
      }));

      const notificationHistory = prev.notificationHistory.map((notification) => ({
        ...notification,
        read: true
      }));

      return {
        ...prev,
        notifications,
        notificationHistory,
        notificationCount: {
          total: notifications.length,
          unread: 0
        }
      };
    });
  }, []);

  // Set whether to show unread badge
  const setShowUnreadBadge = useCallback((show: boolean): void => {
    setState((prev) => ({
      ...prev,
      showUnreadBadge: show
    }));
  }, []);

  // Get notifications by type
  const getNotificationsByType = useCallback((type: NotificationType): Notification[] => {
    return state.notifications.filter((notification) => notification.type === type);
  }, [state.notifications]);

  // Helper methods for common notification types
  const success = useCallback((title: string, message: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    });
  }, [addNotification]);

  const error = useCallback((title: string, message: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'error',
      title,
      message,
      autoClose: false, // Errors don't auto-close by default
      ...options
    });
  }, [addNotification]);

  const warning = useCallback((title: string, message: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options
    });
  }, [addNotification]);

  const info = useCallback((title: string, message: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    });
  }, [addNotification]);

  return {
    ...state,
    addNotification,
    removeNotification,
    clearAllNotifications,
    markAsRead,
    markAllAsRead,
    setShowUnreadBadge,
    getNotificationsByType,
    success,
    error,
    warning,
    info
  };
}

// Hook for consuming the notifications context
export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}