import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { X, Check, AlertTriangle, Info, AlertCircle, Bell } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'notification';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: Toast = {
      id,
      duration: 5000,
      ...toastData,
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove toast after duration (unless persistent)
    if (!toast.persistent && toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id);
      if (toast?.onClose) {
        toast.onClose();
      }
      return prev.filter(t => t.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

interface ToastComponentProps {
  toast: Toast;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Animate in
    setIsVisible(true);

    // Progress bar animation
    if (!toast.persistent && toast.duration && toast.duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const decrement = 100 / (toast.duration! / 100);
          return Math.max(0, prev - decrement);
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [toast.duration, toast.persistent]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => removeToast(toast.id), 150);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'notification':
        return <Bell className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    const baseStyles = 'relative overflow-hidden rounded-lg shadow-lg border p-4 backdrop-blur-sm';

    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
      case 'notification':
        return `${baseStyles} bg-purple-50 border-purple-200 text-purple-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800`;
    }
  };

  const getProgressBarColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-400';
      case 'error':
        return 'bg-red-400';
      case 'warning':
        return 'bg-yellow-400';
      case 'info':
        return 'bg-blue-400';
      case 'notification':
        return 'bg-purple-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div
      className={`
        ${getStyles()}
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      {/* Progress bar */}
      {!toast.persistent && toast.duration && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-10">
          <div
            className={`h-full transition-all duration-100 ease-linear ${getProgressBarColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{toast.title}</div>
          {toast.message && <div className="text-sm opacity-90 mt-1">{toast.message}</div>}

          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="text-sm font-medium underline hover:no-underline mt-2 block"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Hook for easy toast creation
export const useToastActions = () => {
  const { addToast } = useToast();

  return {
    success: (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: 'success', title, message, ...options }),

    error: (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: 'error', title, message, ...options }),

    warning: (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: 'warning', title, message, ...options }),

    info: (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: 'info', title, message, ...options }),

    notification: (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: 'notification', title, message, ...options }),
  };
};

// Example usage component
export const ExampleToasts: React.FC = () => {
  const { success, error, warning, info, notification } = useToastActions();
  const { clearAll } = useToast();

  const showExampleToasts = () => {
    success('Success!', 'Your operation completed successfully.');

    setTimeout(() => {
      error('Error occurred', 'Please try again later.', { persistent: true });
    }, 1000);

    setTimeout(() => {
      warning('Warning', 'This action cannot be undone.');
    }, 2000);

    setTimeout(() => {
      info('Information', 'New features are available.', {
        action: {
          label: 'Learn more',
          onClick: () => console.log('Learn more clicked'),
        },
      });
    }, 3000);

    setTimeout(() => {
      notification('New message', 'You have received a new notification.');
    }, 4000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Toast Notifications</h3>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => success('Success!', 'Operation completed.')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Success Toast
        </button>

        <button
          onClick={() => error('Error!', 'Something went wrong.')}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Error Toast
        </button>

        <button
          onClick={() => warning('Warning!', 'Please be careful.')}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          Warning Toast
        </button>

        <button
          onClick={() =>
            info('Info', 'Here is some information.', {
              action: { label: 'Got it', onClick: () => console.log('Acknowledged') },
            })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Info Toast with Action
        </button>

        <button
          onClick={() =>
            notification('Notification', 'New update available.', { persistent: true })
          }
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Persistent Toast
        </button>

        <button
          onClick={showExampleToasts}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Show All Types
        </button>

        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default ToastComponent;
