import React, { useState, useEffect, useCallback } from 'react';
import { X, AlertTriangle, Info, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error' | 'announcement';

export interface AlertBannerProps {
  id?: string;
  type: AlertType;
  title: string;
  message?: string;
  dismissible?: boolean;
  persistent?: boolean;
  autoHide?: boolean;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  link?: {
    text: string;
    url: string;
    external?: boolean;
  };
  onDismiss?: () => void;
  className?: string;
}

interface AlertState {
  visible: boolean;
  dismissed: boolean;
}

const AlertBanner: React.FC<AlertBannerProps> = ({
  id = `alert-${Date.now()}`,
  type,
  title,
  message,
  dismissible = true,
  persistent = false,
  autoHide = false,
  duration = 8000,
  actions = [],
  link,
  onDismiss,
  className = '',
}) => {
  const [state, setState] = useState<AlertState>({
    visible: true,
    dismissed: false,
  });

  // Load dismissed state from localStorage
  useEffect(() => {
    if (persistent) {
      const dismissedAlerts = JSON.parse(localStorage.getItem('dismissedAlerts') || '{}');
      if (dismissedAlerts[id]) {
        setState({ visible: false, dismissed: true });
      }
    }
  }, [id, persistent]);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide && state.visible && !state.dismissed && duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, state.visible, state.dismissed]);

  const handleDismiss = useCallback(() => {
    setState(prev => ({ ...prev, visible: false }));

    // Store dismissal in localStorage for persistent alerts
    if (persistent) {
      const dismissedAlerts = JSON.parse(localStorage.getItem('dismissedAlerts') || '{}');
      dismissedAlerts[id] = {
        dismissedAt: new Date().toISOString(),
        alertType: type,
        title,
      };
      localStorage.setItem('dismissedAlerts', JSON.stringify(dismissedAlerts));
    }

    // Call external onDismiss callback after animation
    setTimeout(() => {
      setState(prev => ({ ...prev, dismissed: true }));
      onDismiss?.();
    }, 300);
  }, [id, persistent, type, title, onDismiss]);

  const getIcon = () => {
    const iconClasses = 'w-5 h-5 flex-shrink-0';

    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClasses} text-green-600`} />;
      case 'error':
        return <AlertCircle className={`${iconClasses} text-red-600`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClasses} text-yellow-600`} />;
      case 'info':
        return <Info className={`${iconClasses} text-blue-600`} />;
      case 'announcement':
        return <Info className={`${iconClasses} text-purple-600`} />;
      default:
        return <Info className={`${iconClasses} text-gray-600`} />;
    }
  };

  const getAlertStyles = () => {
    const baseStyles = `
      relative border-l-4 p-4 shadow-sm transition-all duration-300 ease-in-out
      ${state.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
    `;

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-400 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-400 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800`;
      case 'announcement':
        return `${baseStyles} bg-purple-50 border-purple-400 text-purple-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-400 text-gray-800`;
    }
  };

  const getButtonStyles = (variant: 'primary' | 'secondary' = 'primary') => {
    const baseStyles = 'px-3 py-1 text-sm font-medium rounded-md transition-colors';

    if (variant === 'primary') {
      switch (type) {
        case 'success':
          return `${baseStyles} bg-green-600 text-white hover:bg-green-700`;
        case 'error':
          return `${baseStyles} bg-red-600 text-white hover:bg-red-700`;
        case 'warning':
          return `${baseStyles} bg-yellow-600 text-white hover:bg-yellow-700`;
        case 'info':
          return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700`;
        case 'announcement':
          return `${baseStyles} bg-purple-600 text-white hover:bg-purple-700`;
        default:
          return `${baseStyles} bg-gray-600 text-white hover:bg-gray-700`;
      }
    } else {
      switch (type) {
        case 'success':
          return `${baseStyles} border border-green-300 text-green-700 hover:bg-green-100`;
        case 'error':
          return `${baseStyles} border border-red-300 text-red-700 hover:bg-red-100`;
        case 'warning':
          return `${baseStyles} border border-yellow-300 text-yellow-700 hover:bg-yellow-100`;
        case 'info':
          return `${baseStyles} border border-blue-300 text-blue-700 hover:bg-blue-100`;
        case 'announcement':
          return `${baseStyles} border border-purple-300 text-purple-700 hover:bg-purple-100`;
        default:
          return `${baseStyles} border border-gray-300 text-gray-700 hover:bg-gray-100`;
      }
    }
  };

  if (state.dismissed) {
    return null;
  }

  return (
    <div className={`${getAlertStyles()} ${className}`}>
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold">{title}</h3>
              {message && <div className="mt-1 text-sm opacity-90">{message}</div>}

              {link && (
                <div className="mt-2">
                  <a
                    href={link.url}
                    target={link.external ? '_blank' : '_self'}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center text-sm font-medium underline hover:no-underline"
                  >
                    {link.text}
                    {link.external && <ExternalLink className="w-3 h-3 ml-1" />}
                  </a>
                </div>
              )}

              {actions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={getButtonStyles(action.variant)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {dismissible && (
              <button
                onClick={handleDismiss}
                className="ml-4 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Alert Manager for handling multiple alerts
interface AlertManagerState {
  alerts: (AlertBannerProps & { id: string })[];
}

export const useAlertManager = () => {
  const [state, setState] = useState<AlertManagerState>({ alerts: [] });

  const addAlert = useCallback((alert: Omit<AlertBannerProps, 'id'>) => {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAlert = { ...alert, id };

    setState(prev => ({
      alerts: [...prev.alerts, newAlert],
    }));

    return id;
  }, []);

  const removeAlert = useCallback((id: string) => {
    setState(prev => ({
      alerts: prev.alerts.filter(alert => alert.id !== id),
    }));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setState({ alerts: [] });
  }, []);

  const clearDismissedAlerts = useCallback(() => {
    localStorage.removeItem('dismissedAlerts');
  }, []);

  return {
    alerts: state.alerts,
    addAlert,
    removeAlert,
    clearAllAlerts,
    clearDismissedAlerts,
  };
};

// Alert Container Component
export const AlertContainer: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { alerts, removeAlert } = useAlertManager();

  return (
    <div className={`space-y-3 ${className}`}>
      {alerts.map(alert => (
        <AlertBanner key={alert.id} {...alert} onDismiss={() => removeAlert(alert.id)} />
      ))}
    </div>
  );
};

// Example usage component
export const ExampleAlerts: React.FC = () => {
  const { addAlert, clearAllAlerts, clearDismissedAlerts } = useAlertManager();

  const showExampleAlerts = () => {
    addAlert({
      type: 'success',
      title: 'Success!',
      message: 'Your changes have been saved successfully.',
      autoHide: true,
      duration: 5000,
    });

    setTimeout(() => {
      addAlert({
        type: 'warning',
        title: 'Warning',
        message: 'Your session will expire in 5 minutes.',
        actions: [
          {
            label: 'Extend Session',
            onClick: () => console.log('Session extended'),
            variant: 'primary',
          },
          {
            label: 'Logout',
            onClick: () => console.log('Logged out'),
            variant: 'secondary',
          },
        ],
      });
    }, 1000);

    setTimeout(() => {
      addAlert({
        type: 'error',
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
        persistent: true,
        link: {
          text: 'Check Status Page',
          url: 'https://status.example.com',
          external: true,
        },
      });
    }, 2000);

    setTimeout(() => {
      addAlert({
        type: 'info',
        title: 'New Feature Available',
        message: "We've added a new dashboard with advanced analytics.",
        actions: [
          {
            label: 'Explore Now',
            onClick: () => console.log('Exploring new feature'),
            variant: 'primary',
          },
        ],
      });
    }, 3000);

    setTimeout(() => {
      addAlert({
        type: 'announcement',
        title: 'Scheduled Maintenance',
        message:
          'Our services will be temporarily unavailable tomorrow from 2:00 AM to 4:00 AM UTC.',
        dismissible: false,
        persistent: true,
      });
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Alert Banner Examples</h3>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() =>
              addAlert({
                type: 'success',
                title: 'Success!',
                message: 'Operation completed successfully.',
              })
            }
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Success Alert
          </button>

          <button
            onClick={() =>
              addAlert({
                type: 'error',
                title: 'Error!',
                message: 'Something went wrong. Please try again.',
              })
            }
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Error Alert
          </button>

          <button
            onClick={() =>
              addAlert({
                type: 'warning',
                title: 'Warning!',
                message: 'This action cannot be undone.',
              })
            }
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Warning Alert
          </button>

          <button
            onClick={() =>
              addAlert({
                type: 'info',
                title: 'Information',
                message: "Here's some helpful information.",
                link: { text: 'Learn More', url: '#' },
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Info with Link
          </button>

          <button
            onClick={() =>
              addAlert({
                type: 'announcement',
                title: 'Announcement',
                message: 'Important system update coming soon.',
                persistent: true,
              })
            }
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Persistent Alert
          </button>

          <button
            onClick={showExampleAlerts}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Show All Types
          </button>

          <button
            onClick={clearAllAlerts}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Clear All
          </button>

          <button
            onClick={clearDismissedAlerts}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Clear Dismissed History
          </button>
        </div>
      </div>

      <AlertContainer />
    </div>
  );
};

export default AlertBanner;
