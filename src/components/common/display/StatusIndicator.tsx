import React, { useState, useEffect, useCallback } from 'react';
import {
  Circle,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Server,
  Database,
  Globe,
} from 'lucide-react';

export type StatusType =
  | 'online'
  | 'offline'
  | 'idle'
  | 'busy'
  | 'away'
  | 'connecting'
  | 'error'
  | 'maintenance';

export interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  pulse?: boolean;
  onClick?: () => void;
  className?: string;
  customStatuses?: Record<
    string,
    {
      color: string;
      bgColor: string;
      textColor: string;
      icon?: React.ReactNode;
      description?: string;
    }
  >;
}

interface StatusState {
  currentStatus: StatusType;
  lastChanged: number;
  history: Array<{
    status: StatusType;
    timestamp: number;
    duration?: number;
  }>;
  uptime: number;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  showLabel = true,
  size = 'md',
  animated = true,
  pulse = false,
  onClick,
  className = '',
  customStatuses = {},
}) => {
  const [state, setState] = useState<StatusState>({
    currentStatus: status,
    lastChanged: Date.now(),
    history: [{ status, timestamp: Date.now() }],
    uptime: 0,
    connectionQuality: 'excellent',
  });

  // Update status when prop changes
  useEffect(() => {
    if (status !== state.currentStatus) {
      setState(prev => {
        const now = Date.now();
        const duration = now - prev.lastChanged;

        return {
          ...prev,
          currentStatus: status,
          lastChanged: now,
          history: [
            ...prev.history.slice(-9), // Keep last 10 entries
            {
              status: prev.currentStatus,
              timestamp: prev.lastChanged,
              duration,
            },
            { status, timestamp: now },
          ],
        };
      });
    }
  }, [status, state.currentStatus, state.lastChanged]);

  // Update uptime counter
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.currentStatus === 'online') {
        setState(prev => ({
          ...prev,
          uptime: prev.uptime + 1000,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.currentStatus]);

  const getStatusConfig = () => {
    const defaultStatuses = {
      online: {
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-800',
        icon: <CheckCircle className="w-4 h-4" />,
        description: 'System is operational',
      },
      offline: {
        color: 'bg-gray-500',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-800',
        icon: <WifiOff className="w-4 h-4" />,
        description: 'System is offline',
      },
      idle: {
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-800',
        icon: <Clock className="w-4 h-4" />,
        description: 'System is idle',
      },
      busy: {
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
        icon: <Zap className="w-4 h-4" />,
        description: 'System is busy',
      },
      away: {
        color: 'bg-orange-500',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-800',
        icon: <Circle className="w-4 h-4" />,
        description: 'System is away',
      },
      connecting: {
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-800',
        icon: <Wifi className="w-4 h-4" />,
        description: 'Connecting...',
      },
      error: {
        color: 'bg-red-600',
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
        icon: <AlertTriangle className="w-4 h-4" />,
        description: 'System error',
      },
      maintenance: {
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-800',
        icon: <Server className="w-4 h-4" />,
        description: 'Under maintenance',
      },
    };

    return (
      { ...defaultStatuses, ...customStatuses }[state.currentStatus] || defaultStatuses.offline
    );
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4',
      xl: 'w-5 h-5',
    };
    return sizes[size];
  };

  const getContainerSizeClasses = () => {
    const sizes = {
      sm: 'gap-1.5 text-xs',
      md: 'gap-2 text-sm',
      lg: 'gap-2.5 text-base',
      xl: 'gap-3 text-lg',
    };
    return sizes[size];
  };

  const getAnimationClasses = () => {
    let classes = 'transition-all duration-300';

    if (animated) {
      classes += ' ease-in-out';
    }

    if (pulse && (state.currentStatus === 'connecting' || state.currentStatus === 'busy')) {
      classes += ' animate-pulse';
    }

    return classes;
  };

  const config = getStatusConfig();

  return (
    <div
      className={`inline-flex items-center ${getContainerSizeClasses()} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="relative">
        <div
          className={`
            ${getSizeClasses()} 
            ${config.color} 
            rounded-full 
            ${getAnimationClasses()}
          `}
        />
        {pulse && state.currentStatus === 'online' && (
          <div
            className={`
              absolute inset-0 
              ${getSizeClasses()} 
              ${config.color} 
              rounded-full 
              animate-ping 
              opacity-75
            `}
          />
        )}
      </div>

      {showLabel && (
        <span className={`font-medium ${config.textColor}`}>
          {label || state.currentStatus.charAt(0).toUpperCase() + state.currentStatus.slice(1)}
        </span>
      )}
    </div>
  );
};

// System Status Component
export interface SystemStatusProps {
  services: Array<{
    name: string;
    status: StatusType;
    description?: string;
    icon?: React.ReactNode;
    endpoint?: string;
  }>;
  onServiceClick?: (service: string) => void;
  className?: string;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  services,
  onServiceClick,
  className = '',
}) => {
  const getOverallStatus = (): StatusType => {
    const statuses = services.map(s => s.status);

    if (statuses.includes('error')) return 'error';
    if (statuses.includes('maintenance')) return 'maintenance';
    if (statuses.includes('offline')) return 'offline';
    if (statuses.includes('connecting')) return 'connecting';
    if (statuses.includes('busy')) return 'busy';
    if (statuses.includes('away')) return 'away';
    if (statuses.includes('idle')) return 'idle';
    if (statuses.every(s => s === 'online')) return 'online';

    return 'idle';
  };

  const getStatusCounts = () => {
    return services.reduce(
      (acc, service) => {
        acc[service.status] = (acc[service.status] || 0) + 1;
        return acc;
      },
      {} as Record<StatusType, number>
    );
  };

  const overallStatus = getOverallStatus();
  const statusCounts = getStatusCounts();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusIndicator status={overallStatus} label="System Status" size="lg" pulse={true} />
        </div>

        <div className="text-sm text-gray-600">{services.length} services</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((service, index) => (
          <div
            key={index}
            className={`
              p-3 border rounded-lg hover:shadow-sm transition-shadow
              ${onServiceClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            `}
            onClick={() => onServiceClick?.(service.name)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {service.icon && <div className="text-gray-500">{service.icon}</div>}
                <div>
                  <div className="font-medium text-sm">{service.name}</div>
                  {service.description && (
                    <div className="text-xs text-gray-500">{service.description}</div>
                  )}
                </div>
              </div>

              <StatusIndicator
                status={service.status}
                showLabel={false}
                size="md"
                animated={true}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex items-center gap-2">
            <StatusIndicator status={status as StatusType} showLabel={false} size="sm" />
            <span className="text-gray-600">
              {count} {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// User Status Manager
interface UserStatusManagerState {
  userStatus: StatusType;
  customMessage: string;
  autoAway: boolean;
  lastActivity: number;
}

export const useUserStatusManager = () => {
  const [state, setState] = useState<UserStatusManagerState>({
    userStatus: 'online',
    customMessage: '',
    autoAway: true,
    lastActivity: Date.now(),
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('user-status-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse user status state:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('user-status-state', JSON.stringify(state));
  }, [state]);

  // Auto-away detection
  useEffect(() => {
    if (!state.autoAway) return;

    const handleActivity = () => {
      setState(prev => ({
        ...prev,
        lastActivity: Date.now(),
        userStatus: prev.userStatus === 'away' ? 'online' : prev.userStatus,
      }));
    };

    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - state.lastActivity;
      const fiveMinutes = 5 * 60 * 1000;

      if (inactiveTime > fiveMinutes && state.userStatus === 'online') {
        setState(prev => ({ ...prev, userStatus: 'away' }));
      }
    };

    // Add activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Check inactivity every minute
    const interval = setInterval(checkInactivity, 60000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(interval);
    };
  }, [state.autoAway, state.lastActivity, state.userStatus]);

  const setUserStatus = useCallback((status: StatusType) => {
    setState(prev => ({ ...prev, userStatus: status }));
  }, []);

  const setCustomMessage = useCallback((message: string) => {
    setState(prev => ({ ...prev, customMessage: message }));
  }, []);

  const setAutoAway = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, autoAway: enabled }));
  }, []);

  return {
    userStatus: state.userStatus,
    customMessage: state.customMessage,
    autoAway: state.autoAway,
    lastActivity: state.lastActivity,
    setUserStatus,
    setCustomMessage,
    setAutoAway,
  };
};

// Example usage component
export const ExampleStatusIndicators: React.FC = () => {
  const { userStatus, customMessage, autoAway, setUserStatus, setCustomMessage, setAutoAway } =
    useUserStatusManager();

  const [services, setServices] = useState([
    {
      name: 'API Server',
      status: 'online' as StatusType,
      description: 'REST API',
      icon: <Server className="w-4 h-4" />,
    },
    {
      name: 'Database',
      status: 'online' as StatusType,
      description: 'PostgreSQL',
      icon: <Database className="w-4 h-4" />,
    },
    {
      name: 'CDN',
      status: 'online' as StatusType,
      description: 'Content Delivery',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      name: 'Auth Service',
      status: 'idle' as StatusType,
      description: 'Authentication',
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      name: 'Email Service',
      status: 'maintenance' as StatusType,
      description: 'SMTP Server',
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      name: 'File Storage',
      status: 'online' as StatusType,
      description: 'S3 Compatible',
      icon: <Circle className="w-4 h-4" />,
    },
  ]);

  const simulateStatusChanges = () => {
    const statuses: StatusType[] = ['online', 'offline', 'idle', 'busy', 'connecting', 'error'];

    setServices(prev =>
      prev.map(service => ({
        ...service,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      }))
    );
  };

  const resetServices = () => {
    setServices(prev =>
      prev.map(service => ({
        ...service,
        status: 'online' as StatusType,
      }))
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Status Indicators</h3>

        {/* Basic Status Indicators */}
        <div className="space-y-4">
          <h4 className="font-medium">Basic Indicators</h4>
          <div className="flex flex-wrap gap-4">
            <StatusIndicator status="online" size="sm" />
            <StatusIndicator status="offline" size="md" />
            <StatusIndicator status="idle" size="lg" />
            <StatusIndicator status="busy" size="xl" pulse />
            <StatusIndicator status="connecting" animated pulse />
            <StatusIndicator status="error" />
            <StatusIndicator status="maintenance" />
          </div>
        </div>

        {/* User Status Manager */}
        <div className="mt-8 space-y-4">
          <h4 className="font-medium">User Status Manager</h4>

          <div className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center gap-4">
              <StatusIndicator status={userStatus} label="Your Status" size="lg" pulse />

              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Custom status message..."
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto-away"
                checked={autoAway}
                onChange={e => setAutoAway(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="auto-away" className="text-sm">
                Automatically set to away after 5 minutes of inactivity
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              {(['online', 'idle', 'busy', 'away', 'offline'] as StatusType[]).map(status => (
                <button
                  key={status}
                  onClick={() => setUserStatus(status)}
                  className={`
                    px-3 py-1 text-sm rounded-md border transition-colors
                    ${
                      userStatus === status
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <h4 className="font-medium mb-4">System Status</h4>

          <SystemStatus
            services={services}
            onServiceClick={service => console.log(`Clicked: ${service}`)}
          />

          <div className="mt-4 flex gap-2">
            <button
              onClick={simulateStatusChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Simulate Status Changes
            </button>

            <button
              onClick={resetServices}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Reset All to Online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
