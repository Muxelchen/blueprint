import React, { useState, useEffect, useCallback } from 'react';
import { Bell, X, Settings, Volume2, VolumeX, Monitor } from 'lucide-react';

export interface PushNotificationProps {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  onClick?: () => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
}

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

interface NotificationState {
  permission: NotificationPermission;
  supported: boolean;
  notifications: Array<{
    id: string;
    notification: PushNotificationProps;
    timestamp: number;
    active: boolean;
  }>;
  settings: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    frequency: 'all' | 'important' | 'none';
  };
}

const PushNotification: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const [state, setState] = useState<NotificationState>({
    permission: {
      granted: false,
      denied: false,
      default: true,
    },
    supported: false,
    notifications: [],
    settings: {
      enabled: true,
      sound: true,
      desktop: true,
      frequency: 'all',
    },
  });

  // Check browser support and permission status
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'Notification' in window;
      setState(prev => ({ ...prev, supported }));

      if (supported) {
        const permission = Notification.permission;
        setState(prev => ({
          ...prev,
          permission: {
            granted: permission === 'granted',
            denied: permission === 'denied',
            default: permission === 'default',
          },
        }));
      }
    };

    checkSupport();

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setState(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
      } catch (error) {
        console.warn('Failed to load notification settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notification-settings', JSON.stringify(state.settings));
  }, [state.settings]);

  const requestPermission = useCallback(async () => {
    if (!state.supported) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({
        ...prev,
        permission: {
          granted: permission === 'granted',
          denied: permission === 'denied',
          default: permission === 'default',
        },
      }));

      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }, [state.supported]);

  const sendNotification = useCallback(
    (notificationData: PushNotificationProps) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Add to local notifications list
      setState(prev => ({
        ...prev,
        notifications: [
          ...prev.notifications,
          {
            id,
            notification: notificationData,
            timestamp: Date.now(),
            active: true,
          },
        ],
      }));

      // Send browser notification if supported and permitted
      if (
        state.supported &&
        state.permission.granted &&
        state.settings.enabled &&
        state.settings.desktop
      ) {
        try {
          const notification = new Notification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon || '/favicon.ico',
            badge: notificationData.badge,
            tag: notificationData.tag || id,
            requireInteraction: notificationData.requireInteraction,
            silent: notificationData.silent || !state.settings.sound,
            // Note: actions are not supported in standard browser notifications
          });

          notification.onclick = () => {
            notificationData.onClick?.();
            notification.close();
          };

          notification.onclose = () => {
            notificationData.onClose?.();
            setState(prev => ({
              ...prev,
              notifications: prev.notifications.map(n =>
                n.id === id ? { ...n, active: false } : n
              ),
            }));
          };

          notification.onerror = () => {
            const error = new Error('Notification failed to display');
            notificationData.onError?.(error);
          };

          // Auto-close after 5 seconds unless requireInteraction is true
          if (!notificationData.requireInteraction) {
            setTimeout(() => {
              notification.close();
            }, 5000);
          }
        } catch (error) {
          console.error('Failed to create notification:', error);
          notificationData.onError?.(error as Error);
        }
      }

      // Play sound if enabled
      if (state.settings.sound && !notificationData.silent) {
        playNotificationSound();
      }

      return id;
    },
    [state.supported, state.permission.granted, state.settings]
  );

  const playNotificationSound = useCallback(() => {
    try {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }, []);

  const clearNotification = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: [],
    }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<typeof state.settings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  return (
    <div className={className}>
      {children}
      <NotificationManager
        state={state}
        onRequestPermission={requestPermission}
        onSendNotification={sendNotification}
        onClearNotification={clearNotification}
        onClearAll={clearAllNotifications}
        onUpdateSettings={updateSettings}
      />
    </div>
  );
};

// Notification Manager Component
interface NotificationManagerProps {
  state: NotificationState;
  onRequestPermission: () => Promise<boolean>;
  onSendNotification: (notification: PushNotificationProps) => string;
  onClearNotification: (id: string) => void;
  onClearAll: () => void;
  onUpdateSettings: (settings: Partial<NotificationState['settings']>) => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({
  state,
  onRequestPermission,
  onSendNotification,
  onClearNotification,
  onClearAll,
  onUpdateSettings,
}) => {
  return (
    <div className="space-y-6">
      <NotificationControls
        state={state}
        onRequestPermission={onRequestPermission}
        onSendNotification={onSendNotification}
        onClearAll={onClearAll}
      />

      <NotificationSettings settings={state.settings} onUpdateSettings={onUpdateSettings} />

      <NotificationHistory
        notifications={state.notifications}
        onClearNotification={onClearNotification}
      />
    </div>
  );
};

// Notification Controls Component
const NotificationControls: React.FC<{
  state: NotificationState;
  onRequestPermission: () => Promise<boolean>;
  onSendNotification: (notification: PushNotificationProps) => string;
  onClearAll: () => void;
}> = ({ state, onRequestPermission, onSendNotification, onClearAll }) => {
  const getPermissionStatus = () => {
    if (!state.supported) {
      return { text: 'Not supported', color: 'text-red-600', bgColor: 'bg-red-50' };
    }
    if (state.permission.granted) {
      return { text: 'Granted', color: 'text-green-600', bgColor: 'bg-green-50' };
    }
    if (state.permission.denied) {
      return { text: 'Denied', color: 'text-red-600', bgColor: 'bg-red-50' };
    }
    return { text: 'Default', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  };

  const sendTestNotification = () => {
    onSendNotification({
      title: 'Test Notification',
      body: 'This is a test notification to verify everything is working correctly.',
      icon: '/favicon.ico',
      onClick: () => console.log('Test notification clicked'),
      onClose: () => console.log('Test notification closed'),
    });
  };

  const sendImportantNotification = () => {
    onSendNotification({
      title: 'Important Alert',
      body: 'This is an important notification that requires your attention.',
      requireInteraction: true,
      onClick: () => console.log('Important notification clicked'),
    });
  };

  const sendSilentNotification = () => {
    onSendNotification({
      title: 'Silent Update',
      body: 'This notification was sent silently without sound.',
      silent: true,
      onClick: () => console.log('Silent notification clicked'),
    });
  };

  const status = getPermissionStatus();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Bell className="w-5 h-5" />
        Push Notifications
      </h3>

      {/* Permission Status */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <div className="font-medium">Permission Status</div>
          <div className="text-sm text-gray-600">
            {state.supported
              ? 'Browser supports notifications'
              : 'Browser does not support notifications'}
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.bgColor}`}
        >
          {status.text}
        </div>
      </div>

      {/* Request Permission */}
      {state.supported && !state.permission.granted && (
        <button
          onClick={onRequestPermission}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Request Notification Permission
        </button>
      )}

      {/* Test Notifications */}
      {state.permission.granted && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button
            onClick={sendTestNotification}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Send Test
          </button>

          <button
            onClick={sendImportantNotification}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Send Important
          </button>

          <button
            onClick={sendSilentNotification}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Send Silent
          </button>
        </div>
      )}

      {/* Clear All */}
      {state.notifications.length > 0 && (
        <button
          onClick={onClearAll}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Clear All Notifications ({state.notifications.length})
        </button>
      )}
    </div>
  );
};

// Notification Settings Component
const NotificationSettings: React.FC<{
  settings: NotificationState['settings'];
  onUpdateSettings: (settings: Partial<NotificationState['settings']>) => void;
}> = ({ settings, onUpdateSettings }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium flex items-center gap-2">
        <Settings className="w-4 h-4" />
        Notification Settings
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enable Notifications</label>
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={e => onUpdateSettings({ enabled: e.target.checked })}
              className="rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              {settings.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Sound Notifications
            </label>
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={e => onUpdateSettings({ sound: e.target.checked })}
              className="rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Desktop Notifications
            </label>
            <input
              type="checkbox"
              checked={settings.desktop}
              onChange={e => onUpdateSettings({ desktop: e.target.checked })}
              className="rounded"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-2">Notification Frequency</label>
            <select
              value={settings.frequency}
              onChange={e => onUpdateSettings({ frequency: e.target.value as any })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All notifications</option>
              <option value="important">Important only</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification History Component
const NotificationHistory: React.FC<{
  notifications: NotificationState['notifications'];
  onClearNotification: (id: string) => void;
}> = ({ notifications, onClearNotification }) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Notification History ({notifications.length})</h4>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {notifications.map(item => (
          <div
            key={item.id}
            className={`p-3 border rounded-lg flex items-start justify-between ${
              item.active ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{item.notification.title}</div>
              <div className="text-sm text-gray-600 mt-1">{item.notification.body}</div>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(item.timestamp).toLocaleTimeString()}
                {item.active && <span className="ml-20 text-blue-600">• Active</span>}
              </div>
            </div>

            <button
              onClick={() => onClearNotification(item.id)}
              className="p-1 rounded-md hover:bg-gray-200 transition-colors"
              aria-label="Clear notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Hook for easy notification usage
export const usePushNotification = () => {
  const [isSupported] = useState(() => 'Notification' in window);
  const [permission, setPermission] = useState<NotificationPermission>(() => ({
    granted: Notification.permission === 'granted',
    denied: Notification.permission === 'denied',
    default: Notification.permission === 'default',
  }));

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      const newPermission = {
        granted: result === 'granted',
        denied: result === 'denied',
        default: result === 'default',
      };
      setPermission(newPermission);
      return newPermission.granted;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(
    (data: PushNotificationProps) => {
      if (!isSupported || !permission.granted) {
        console.warn('Notifications not supported or permission not granted');
        return null;
      }

      try {
        const notification = new Notification(data.title, {
          body: data.body,
          icon: data.icon || '/favicon.ico',
          badge: data.badge,
          tag: data.tag,
          requireInteraction: data.requireInteraction,
          silent: data.silent,
          // Note: actions are not supported in standard browser notifications
        });

        notification.onclick = () => {
          data.onClick?.();
          notification.close();
        };

        notification.onclose = () => {
          data.onClose?.();
        };

        notification.onerror = () => {
          const error = new Error('Notification failed');
          data.onError?.(error);
        };

        return notification;
      } catch (error) {
        console.error('Failed to create notification:', error);
        data.onError?.(error as Error);
        return null;
      }
    },
    [isSupported, permission.granted]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
  };
};

// Example usage component
export const ExamplePushNotifications: React.FC = () => {
  const { isSupported, permission, requestPermission, sendNotification } = usePushNotification();

  const sendRandomNotification = () => {
    const notifications = [
      { title: 'New Message', body: 'You have received a new message from John.' },
      { title: 'Task Completed', body: 'Your background task has finished successfully.' },
      { title: 'Reminder', body: "Don't forget about your meeting at 3 PM." },
      { title: 'Update Available', body: 'A new version of the app is ready to install.' },
      { title: 'Sale Alert', body: 'Your favorite item is now 50% off!' },
    ];

    const random = notifications[Math.floor(Math.random() * notifications.length)];
    sendNotification({
      ...random,
      onClick: () => console.log(`Clicked: ${random.title}`),
      onClose: () => console.log(`Closed: ${random.title}`),
    });
  };

  return (
    <div className="space-y-6">
      <PushNotification>
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Browser Push Notifications</h3>

          <div className="text-sm text-gray-600">
            Status: {!isSupported ? 'Not Supported' : permission.granted ? 'Enabled' : 'Disabled'}
          </div>

          {isSupported && !permission.granted && (
            <button
              onClick={requestPermission}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enable Notifications
            </button>
          )}

          {permission.granted && (
            <div className="space-x-2">
              <button
                onClick={sendRandomNotification}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Send Random Notification
              </button>
            </div>
          )}
        </div>
      </PushNotification>
    </div>
  );
};

export default PushNotification;
