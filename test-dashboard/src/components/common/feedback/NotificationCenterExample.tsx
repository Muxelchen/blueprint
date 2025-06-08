import React, { useState } from 'react';
import { Bell, Plus, Settings, Download, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { useNotificationCenter } from '../../../hooks/useNotificationCenter';
import { useNotifications } from '../../../hooks/useNotifications';
import { useToast } from './ToastNotification';
import { useAlertManager } from './AlertBanner';
import { useProgressNotification } from './ProgressNotification';
import { usePushNotification } from './PushNotification';

const NotificationCenterExample: React.FC = () => {
  const notificationCenter = useNotificationCenter();
  const notifications = useNotifications();
  const toast = useToast();
  const alerts = useAlertManager();
  const progress = useProgressNotification();
  const push = usePushNotification();

  const [demoSettings, setDemoSettings] = useState({
    autoGenerate: false,
    interval: 5000,
  });

  // Demo notification generators
  const generateRandomNotification = () => {
    const types = ['success', 'error', 'warning', 'info'] as const;
    const sources = ['main', 'toast', 'alert', 'progress'] as const;

    const type = types[Math.floor(Math.random() * types.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];

    const notificationData = {
      success: {
        title: 'Operation Successful',
        message: 'Your action was completed successfully.',
      },
      error: {
        title: 'Error Occurred',
        message: 'Something went wrong. Please try again.',
      },
      warning: {
        title: 'Warning',
        message: 'Please review your settings before proceeding.',
      },
      info: {
        title: 'Information',
        message: 'Here is some important information for you.',
      },
    };

    const data = notificationData[type];

    switch (source) {
      case 'main':
        notifications.addNotification({
          type,
          title: data.title,
          message: data.message,
          duration: 5000,
        });
        break;
      case 'toast':
        toast.addToast({
          type,
          title: data.title,
          message: data.message,
          duration: 4000,
        });
        break;
      case 'alert':
        alerts.addAlert({
          type: type === 'info' ? 'announcement' : type,
          title: data.title,
          message: data.message,
          dismissible: true,
        });
        break;
      case 'progress':
        const progressId = progress.addProgressNotification({
          title: `${data.title} - Progress`,
          description: data.message,
          progress: 0,
          status: 'running',
          type: 'linear',
          variant: 'primary',
          showPercentage: true,
          autoClose: true,
        });

        // Simulate progress
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
          currentProgress += Math.random() * 20;
          if (currentProgress >= 100) {
            progress.updateProgress(progressId, 100, 'completed');
            clearInterval(progressInterval);
          } else {
            progress.updateProgress(progressId, currentProgress);
          }
        }, 500);
        break;
    }
  };

  const generateBulkNotifications = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => generateRandomNotification(), i * 200);
    }
  };

  const simulateFileUpload = () => {
    const uploadId = progress.addProgressNotification({
      title: 'Uploading Files',
      description: 'Uploading documents to server...',
      progress: 0,
      status: 'running',
      type: 'linear',
      variant: 'primary',
      showPercentage: true,
      showETA: true,
      showSpeed: true,
      dismissible: false,
    });

    let uploadProgress = 0;
    const uploadInterval = setInterval(() => {
      uploadProgress += Math.random() * 15;
      if (uploadProgress >= 100) {
        progress.updateProgress(uploadId, 100, 'completed');
        notifications.success('Upload Complete', 'All files have been uploaded successfully.');
        clearInterval(uploadInterval);
      } else {
        progress.updateProgress(uploadId, uploadProgress);
      }
    }, 300);
  };

  const simulateSystemAlert = () => {
    alerts.addAlert({
      type: 'error',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will begin in 10 minutes. Please save your work.',
      persistent: true,
      actions: [
        {
          label: 'Remind me later',
          onClick: () => {
            setTimeout(() => {
              notifications.warning(
                'Maintenance Reminder',
                'System maintenance starts in 5 minutes.'
              );
            }, 30000);
          },
          variant: 'secondary',
        },
        {
          label: 'Acknowledge',
          onClick: () => {
            notifications.info('Acknowledged', 'You will be notified when maintenance begins.');
          },
          variant: 'primary',
        },
      ],
    });
  };

  const testPushNotifications = async () => {
    if (push.isSupported && !push.permission.granted) {
      const granted = await push.requestPermission();
      if (!granted) {
        toast.addToast({
          type: 'error',
          title: 'Permission Denied',
          message: 'Push notifications are not enabled.',
          duration: 4000,
        });
        return;
      }
    }

    push.sendNotification({
      title: 'Test Push Notification',
      body: 'This is a test push notification from your notification center.',
      icon: '/favicon.ico',
      onClick: () => {
        notificationCenter.open();
      },
    });
  };

  const clearAllNotifications = () => {
    notifications.clearAllNotifications();
    toast.clearAll();
    alerts.clearAllAlerts();
    progress.clearAll();

    toast.addToast({
      type: 'success',
      title: 'Cleared',
      message: 'All notifications have been cleared.',
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
            <p className="text-gray-600 mt-1">
              Unified notification management system with multiple sources and types
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={notificationCenter.toggle}
              className="relative p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Bell className="w-6 h-6" />
              {notificationCenter.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {notificationCenter.unreadCount > 99 ? '99+' : notificationCenter.unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">Main System</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              {notifications.notifications.length}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Toasts</span>
            </div>
            <div className="text-2xl font-bold text-green-900 mt-1">{toast.toasts.length}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-yellow-600 font-medium">Alerts</span>
            </div>
            <div className="text-2xl font-bold text-yellow-900 mt-1">{alerts.alerts.length}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">Progress</span>
            </div>
            <div className="text-2xl font-bold text-purple-900 mt-1">
              {progress.notifications.length}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Controls</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <button
            onClick={generateRandomNotification}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Random Notification</span>
          </button>

          <button
            onClick={generateBulkNotifications}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Bulk Generate</span>
          </button>

          <button
            onClick={simulateFileUpload}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>File Upload</span>
          </button>

          <button
            onClick={simulateSystemAlert}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>System Alert</span>
          </button>

          <button
            onClick={testPushNotifications}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span>Push Test</span>
          </button>

          <button
            onClick={() => {
              notifications.success('Success!', 'Operation completed successfully.');
            }}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Success</span>
          </button>

          <button
            onClick={() => {
              notifications.error('Error!', 'Something went wrong.');
            }}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Error</span>
          </button>

          <button
            onClick={clearAllNotifications}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Auto-generate notifications</span>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={demoSettings.autoGenerate}
                onChange={e =>
                  setDemoSettings(prev => ({ ...prev, autoGenerate: e.target.checked }))
                }
                className="rounded"
              />
              <span className="text-sm text-gray-600">Enable</span>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Generation interval</span>
            <select
              value={demoSettings.interval}
              onChange={e =>
                setDemoSettings(prev => ({ ...prev, interval: Number(e.target.value) }))
              }
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value={3000}>3 seconds</option>
              <option value={5000}>5 seconds</option>
              <option value={10000}>10 seconds</option>
              <option value={30000}>30 seconds</option>
            </select>
          </div>

          <div className="pt-3 border-t">
            <p className="text-sm text-gray-600">
              Click the bell icon in the top right to open the notification center and see all
              notifications in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Center Component */}
      <NotificationCenter
        isOpen={notificationCenter.isOpen}
        onClose={notificationCenter.close}
        position="right"
        width={420}
        height={650}
        showSearch={true}
        showFilters={true}
        showSettings={true}
        maxItems={100}
        autoRefresh={true}
        refreshInterval={5000}
      />
    </div>
  );
};

export default NotificationCenterExample;
