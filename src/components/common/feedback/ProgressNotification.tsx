import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { X, Play, Pause, Check, AlertCircle, Clock, Download, Upload, Loader2 } from 'lucide-react';

export type ProgressType = 'linear' | 'circular' | 'step' | 'indeterminate';
export type ProgressStatus = 'idle' | 'running' | 'paused' | 'completed' | 'error' | 'cancelled';
export type ProgressVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

export interface ProgressNotificationProps {
  id?: string;
  title: string;
  description?: string;
  type?: ProgressType;
  variant?: ProgressVariant;
  progress: number;
  status: ProgressStatus;
  duration?: number;
  showPercentage?: boolean;
  showETA?: boolean;
  showSpeed?: boolean;
  dismissible?: boolean;
  persistent?: boolean;
  autoClose?: boolean;
  steps?: Array<{
    label: string;
    completed: boolean;
    active?: boolean;
  }>;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  onComplete?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
  className?: string;
}

interface ProgressState {
  startTime: number;
  pausedTime: number;
  totalPausedDuration: number;
  estimatedTimeRemaining: number;
  speed: number;
  bytesProcessed: number;
}

interface ProgressNotificationContextType {
  notifications: (ProgressNotificationProps & { id: string; state: ProgressState })[];
  addProgressNotification: (notification: Omit<ProgressNotificationProps, 'id'>) => string;
  updateProgress: (id: string, progress: number, status?: ProgressStatus) => void;
  removeProgressNotification: (id: string) => void;
  clearAll: () => void;
}

const ProgressNotificationContext = createContext<ProgressNotificationContextType | undefined>(undefined);

export const useProgressNotification = () => {
  const context = useContext(ProgressNotificationContext);
  if (!context) {
    throw new Error('useProgressNotification must be used within a ProgressNotificationProvider');
  }
  return context;
};

export const ProgressNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<(ProgressNotificationProps & { id: string; state: ProgressState })[]>([]);

  // Load notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('progress-notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.filter((n: any) => n.persistent));
      } catch (error) {
        console.warn('Failed to load progress notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    const persistentNotifications = notifications.filter(n => n.persistent);
    localStorage.setItem('progress-notifications', JSON.stringify(persistentNotifications));
  }, [notifications]);

  const addProgressNotification = useCallback((notificationData: Omit<ProgressNotificationProps, 'id'>) => {
    const id = `progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = {
      ...notificationData,
      id,
      state: {
        startTime: Date.now(),
        pausedTime: 0,
        totalPausedDuration: 0,
        estimatedTimeRemaining: 0,
        speed: 0,
        bytesProcessed: 0
      }
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const updateProgress = useCallback((id: string, progress: number, status?: ProgressStatus) => {
    setNotifications(prev => prev.map(notification => {
      if (notification.id !== id) return notification;

      const now = Date.now();
      const updatedNotification = { 
        ...notification, 
        progress: Math.max(0, Math.min(100, progress))
      };

      if (status) {
        updatedNotification.status = status;
      }

      // Update state calculations
      const elapsedTime = now - notification.state.startTime - notification.state.totalPausedDuration;
      const progressPercentage = updatedNotification.progress / 100;
      
      if (progressPercentage > 0 && elapsedTime > 0) {
        const estimatedTotalTime = elapsedTime / progressPercentage;
        const estimatedTimeRemaining = estimatedTotalTime - elapsedTime;
        const speed = (notification.state.bytesProcessed / elapsedTime) * 1000; // bytes per second

        updatedNotification.state = {
          ...notification.state,
          estimatedTimeRemaining: Math.max(0, estimatedTimeRemaining),
          speed
        };
      }

      // Handle completion
      if (updatedNotification.progress >= 100 && updatedNotification.status === 'running') {
        updatedNotification.status = 'completed';
        setTimeout(() => {
          updatedNotification.onComplete?.();
          if (updatedNotification.autoClose) {
            removeProgressNotification(id);
          }
        }, 1000);
      }

      return updatedNotification;
    }));
  }, []);

  const removeProgressNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      notification?.onDismiss?.();
      return prev.filter(n => n.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <ProgressNotificationContext.Provider 
      value={{ 
        notifications, 
        addProgressNotification, 
        updateProgress, 
        removeProgressNotification, 
        clearAll 
      }}
    >
      {children}
      <ProgressNotificationContainer />
    </ProgressNotificationContext.Provider>
  );
};

const ProgressNotificationContainer: React.FC = () => {
  const { notifications } = useProgressNotification();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map(notification => (
        <ProgressNotificationComponent key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

interface ProgressNotificationComponentProps {
  notification: ProgressNotificationProps & { id: string; state: ProgressState };
}

const ProgressNotificationComponent: React.FC<ProgressNotificationComponentProps> = ({ notification }) => {
  const { removeProgressNotification } = useProgressNotification();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => removeProgressNotification(notification.id), 150);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatSpeed = (bytesPerSecond: number) => {
    const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    let size = bytesPerSecond;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getStatusIcon = () => {
    switch (notification.status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'completed':
        return <Check className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getVariantStyles = () => {
    const baseStyles = 'bg-white border shadow-lg rounded-lg p-4';
    
    switch (notification.variant) {
      case 'primary':
        return `${baseStyles} border-blue-200`;
      case 'success':
        return `${baseStyles} border-green-200`;
      case 'warning':
        return `${baseStyles} border-yellow-200`;
      case 'error':
        return `${baseStyles} border-red-200`;
      case 'info':
        return `${baseStyles} border-blue-200`;
      default:
        return `${baseStyles} border-gray-200`;
    }
  };

  const getProgressBarColor = () => {
    switch (notification.variant) {
      case 'primary': return 'bg-blue-500';
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-400';
      default: return 'bg-gray-500';
    }
  };

  const renderProgress = () => {
    switch (notification.type) {
      case 'circular':
        return (
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${notification.progress}, 100`}
                className={getProgressBarColor().replace('bg-', 'text-')}
              />
            </svg>
            {notification.showPercentage && (
              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                {Math.round(notification.progress)}%
              </div>
            )}
          </div>
        );

      case 'step':
        return (
          <div className="space-y-2">
            {notification.steps?.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : step.active 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200'
                }`}>
                  {step.completed ? <Check className="w-3 h-3" /> : index + 1}
                </div>
                <span className={`text-sm ${step.completed ? 'text-green-600' : step.active ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        );

      case 'indeterminate':
        return (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full ${getProgressBarColor()} animate-pulse`} style={{ width: '60%' }} />
          </div>
        );

      default: // linear
        return (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
              style={{ width: `${notification.progress}%` }}
            />
          </div>
        );
    }
  };

  return (
    <div
      className={`
        ${getVariantStyles()}
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${notification.className || ''}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <div>
            <div className="font-semibold text-sm">{notification.title}</div>
            {notification.description && (
              <div className="text-xs text-gray-600 mt-1">{notification.description}</div>
            )}
          </div>
        </div>

        {notification.dismissible && (
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Display */}
      <div className="mb-3">
        {renderProgress()}
      </div>

      {/* Progress Info */}
      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
        {notification.showPercentage && notification.type !== 'circular' && (
          <span>{Math.round(notification.progress)}%</span>
        )}
        
        {notification.showETA && notification.state.estimatedTimeRemaining > 0 && (
          <span>ETA: {formatTime(notification.state.estimatedTimeRemaining)}</span>
        )}
        
        {notification.showSpeed && notification.state.speed > 0 && (
          <span>{formatSpeed(notification.state.speed)}</span>
        )}
      </div>

      {/* Actions */}
      {notification.actions && notification.actions.length > 0 && (
        <div className="flex gap-2">
          {notification.actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                flex items-center gap-1 px-3 py-1 text-xs rounded-md transition-colors
                ${action.variant === 'primary' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Hook for easy progress notification management
export const useProgressActions = () => {
  const { addProgressNotification, updateProgress, removeProgressNotification } = useProgressNotification();

  const startDownload = useCallback((filename: string, totalBytes?: number) => {
    return addProgressNotification({
      title: `Downloading ${filename}`,
      description: totalBytes ? `${(totalBytes / 1024 / 1024).toFixed(1)} MB` : undefined,
      type: 'linear',
      variant: 'info',
      progress: 0,
      status: 'running',
      showPercentage: true,
      showETA: true,
      showSpeed: true,
      dismissible: false,
      autoClose: true,
      actions: [
        {
          label: 'Cancel',
          icon: <X className="w-3 h-3" />,
          onClick: () => {},
          variant: 'secondary'
        }
      ]
    });
  }, [addProgressNotification]);

  const startUpload = useCallback((filename: string, totalBytes?: number) => {
    return addProgressNotification({
      title: `Uploading ${filename}`,
      description: totalBytes ? `${(totalBytes / 1024 / 1024).toFixed(1)} MB` : undefined,
      type: 'linear',
      variant: 'primary',
      progress: 0,
      status: 'running',
      showPercentage: true,
      showETA: true,
      showSpeed: true,
      dismissible: false,
      autoClose: true,
      actions: [
        {
          label: 'Pause',
          icon: <Pause className="w-3 h-3" />,
          onClick: () => {},
          variant: 'secondary'
        },
        {
          label: 'Cancel',
          icon: <X className="w-3 h-3" />,
          onClick: () => {},
          variant: 'secondary'
        }
      ]
    });
  }, [addProgressNotification]);

  const startProcessing = useCallback((taskName: string, steps?: string[]) => {
    return addProgressNotification({
      title: `Processing ${taskName}`,
      type: steps ? 'step' : 'linear',
      variant: 'success',
      progress: 0,
      status: 'running',
      showPercentage: !steps,
      dismissible: false,
      autoClose: true,
      steps: steps?.map(step => ({ label: step, completed: false }))
    });
  }, [addProgressNotification]);

  return {
    startDownload,
    startUpload,
    startProcessing,
    updateProgress,
    removeProgress: removeProgressNotification
  };
};

// Example usage component
export const ExampleProgressNotifications: React.FC = () => {
  const { 
    startDownload, 
    startUpload, 
    startProcessing, 
    updateProgress 
  } = useProgressActions();
  const { clearAll } = useProgressNotification();

  const [activeProgresses, setActiveProgresses] = useState<string[]>([]);

  const simulateDownload = () => {
    const id = startDownload('large-file.zip', 50 * 1024 * 1024); // 50MB
    setActiveProgresses(prev => [...prev, id]);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      updateProgress(id, progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setActiveProgresses(prev => prev.filter(p => p !== id));
      }
    }, 300);
  };

  const simulateUpload = () => {
    const id = startUpload('document.pdf', 10 * 1024 * 1024); // 10MB
    setActiveProgresses(prev => [...prev, id]);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 8;
      updateProgress(id, progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setActiveProgresses(prev => prev.filter(p => p !== id));
      }
    }, 400);
  };

  const simulateProcessing = () => {
    const steps = [
      'Analyzing data',
      'Processing images',
      'Generating report',
      'Saving results'
    ];
    
    const id = startProcessing('Data Analysis', steps);
    setActiveProgresses(prev => [...prev, id]);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      updateProgress(id, progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setActiveProgresses(prev => prev.filter(p => p !== id));
      }
    }, 500);
  };

  const simulateMultipleProgress = () => {
    // Start multiple progress notifications
    setTimeout(() => simulateDownload(), 0);
    setTimeout(() => simulateUpload(), 1000);
    setTimeout(() => simulateProcessing(), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Progress Notifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            onClick={simulateDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download File
          </button>
          
          <button
            onClick={simulateUpload}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
          
          <button
            onClick={simulateProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Loader2 className="w-4 h-4" />
            Process Data
          </button>
          
          <button
            onClick={simulateMultipleProgress}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            Multiple Tasks
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Clear All
          </button>
          
          <div className="text-sm text-gray-600 flex items-center">
            Active: {activeProgresses.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressNotificationComponent;