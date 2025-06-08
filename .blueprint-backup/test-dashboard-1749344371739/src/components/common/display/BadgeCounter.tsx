import React, { useState, useEffect, useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';

export interface BadgeCounterProps {
  count: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  showZero?: boolean;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const BadgeCounter: React.FC<BadgeCounterProps> = ({
  count,
  max = 99,
  size = 'md',
  variant = 'primary',
  showZero = false,
  dot = false,
  pulse = false,
  className = '',
  children,
}) => {
  // Don't render if count is 0 and showZero is false
  if (count === 0 && !showZero) {
    return children ? <>{children}</> : null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  const sizeClasses = {
    sm: dot ? 'w-2 h-2' : 'min-w-[16px] h-4 text-xs px-1',
    md: dot ? 'w-3 h-3' : 'min-w-[20px] h-5 text-sm px-1.5',
    lg: dot ? 'w-4 h-4' : 'min-w-[24px] h-6 text-base px-2',
  };

  const variantClasses = {
    primary: 'bg-blue-500 text-white dark:bg-blue-600',
    secondary: 'bg-gray-500 text-white dark:bg-gray-600',
    success: 'bg-green-500 text-white dark:bg-green-600', 
    warning: 'bg-yellow-500 text-white dark:bg-yellow-600',
    error: 'bg-red-500 text-white dark:bg-red-600',
    info: 'bg-cyan-500 text-white dark:bg-cyan-600',
  };

  const badgeClasses = `
    inline-flex items-center justify-center rounded-full font-medium
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${pulse ? 'animate-pulse' : ''}
    ${className}
  `;

  if (children) {
    return (
      <div className="relative inline-block">
        {children}
        <span
          className={`
            absolute -top-1 -right-1 z-10
            ${badgeClasses}
          `}
        >
          {!dot && displayCount}
        </span>
      </div>
    );
  }

  return (
    <span className={badgeClasses}>
      {!dot && displayCount}
    </span>
  );
};

// Badge Manager for handling multiple badge counters
interface BadgeManagerState {
  badges: Record<string, number>;
}

export const useBadgeManager = () => {
  const [state, setState] = useState<BadgeManagerState>({ badges: {} });

  // Load badges from localStorage
  useEffect(() => {
    const savedBadges = localStorage.getItem('badge-manager-state');
    if (savedBadges) {
      try {
        const parsed = JSON.parse(savedBadges);
        setState({ badges: parsed });
      } catch (error) {
        console.warn('Failed to parse saved badge state:', error);
      }
    }
  }, []);

  // Save badges to localStorage
  useEffect(() => {
    localStorage.setItem('badge-manager-state', JSON.stringify(state.badges));
  }, [state.badges]);

  const updateBadge = useCallback((id: string, count: number) => {
    setState(prev => ({
      badges: {
        ...prev.badges,
        [id]: Math.max(0, count),
      },
    }));
  }, []);

  const incrementBadge = useCallback((id: string, amount = 1) => {
    setState(prev => ({
      badges: {
        ...prev.badges,
        [id]: (prev.badges[id] || 0) + amount,
      },
    }));
  }, []);

  const decrementBadge = useCallback((id: string, amount = 1) => {
    setState(prev => ({
      badges: {
        ...prev.badges,
        [id]: Math.max(0, (prev.badges[id] || 0) - amount),
      },
    }));
  }, []);

  const resetBadge = useCallback((id: string) => {
    setState(prev => ({
      badges: {
        ...prev.badges,
        [id]: 0,
      },
    }));
  }, []);

  const clearAllBadges = useCallback(() => {
    setState({ badges: {} });
  }, []);

  const getTotalCount = useCallback(() => {
    return Object.values(state.badges).reduce((sum, count) => sum + count, 0);
  }, [state.badges]);

  return {
    badges: state.badges,
    updateBadge,
    incrementBadge,
    decrementBadge,
    resetBadge,
    clearAllBadges,
    getTotalCount,
    getBadgeCount: (id: string) => state.badges[id] || 0,
  };
};

// Notification Badge Component
export interface NotificationBadgeProps {
  children: React.ReactNode;
  count: number;
  maxCount?: number;
  variant?: BadgeCounterProps['variant'];
  size?: BadgeCounterProps['size'];
  showZero?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  offset?: { x: number; y: number };
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  children,
  count,
  maxCount = 99,
  variant = 'error',
  size = 'sm',
  showZero = false,
  position = 'top-right',
  offset = { x: 0, y: 0 },
  className = '',
}) => {
  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-0 right-0 transform translate-x-1/2 -translate-y-1/2',
      'top-left': 'top-0 left-0 transform -translate-x-1/2 -translate-y-1/2',
      'bottom-right': 'bottom-0 right-0 transform translate-x-1/2 translate-y-1/2',
      'bottom-left': 'bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2',
    };

    return positions[position];
  };

  const shouldShow = showZero || count > 0;

  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      {shouldShow && (
        <div
          className={`absolute ${getPositionClasses()}`}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          <BadgeCounter
            count={count}
            max={maxCount}
            variant={variant}
            size={size}
            showZero={showZero}
            dot={true}
          />
        </div>
      )}
    </div>
  );
};

// Example usage component
export const ExampleBadges: React.FC = () => {
  const { badges, incrementBadge, resetBadge, clearAllBadges, getTotalCount } = useBadgeManager();

  const [localCount, setLocalCount] = useState(5);

  const simulateNotifications = () => {
    // Simulate incoming notifications
    incrementBadge('messages', Math.floor(Math.random() * 5) + 1);

    setTimeout(() => {
      incrementBadge('alerts', Math.floor(Math.random() * 3) + 1);
    }, 1000);

    setTimeout(() => {
      incrementBadge('tasks', Math.floor(Math.random() * 2) + 1);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Badge Counter Examples</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Badge Counters */}
          <div className="space-y-4">
            <h4 className="font-medium">Basic Counters</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span>Small:</span>
                <BadgeCounter count={3} size="sm" variant="primary" />
              </div>
              <div className="flex items-center gap-4">
                <span>Medium:</span>
                <BadgeCounter count={12} size="md" variant="success" />
              </div>
              <div className="flex items-center gap-4">
                <span>Large:</span>
                <BadgeCounter count={156} max={99} size="lg" variant="error" />
              </div>
            </div>
          </div>

          {/* Interactive Badge */}
          <div className="space-y-4">
            <h4 className="font-medium">Interactive Counter</h4>
            <div className="space-y-2">
                              <BadgeCounter
                  count={localCount}
                  variant="primary"
                />
              <div className="text-sm text-gray-600">Click the badge or use +/- buttons</div>
              <button
                onClick={() => setLocalCount(0)}
                className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Managed Badges */}
          <div className="space-y-4">
            <h4 className="font-medium">Managed Badges</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Messages:</span>
                <div className="flex items-center gap-2">
                  <BadgeCounter count={badges.messages || 0} variant="info" showZero />
                  <button
                    onClick={() => incrementBadge('messages')}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                  >
                    +1
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>Alerts:</span>
                <div className="flex items-center gap-2">
                  <BadgeCounter count={badges.alerts || 0} variant="warning" showZero />
                  <button
                    onClick={() => incrementBadge('alerts')}
                    className="px-2 py-1 text-xs bg-yellow-500 text-white rounded"
                  >
                    +1
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>Tasks:</span>
                <div className="flex items-center gap-2">
                  <BadgeCounter count={badges.tasks || 0} variant="success" showZero />
                  <button
                    onClick={() => incrementBadge('tasks')}
                    className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Badges */}
        <div className="mt-8">
          <h4 className="font-medium mb-4">Notification Badges</h4>
          <div className="flex flex-wrap gap-6">
            <NotificationBadge count={badges.messages || 0} variant="info">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                📨
              </div>
            </NotificationBadge>

            <NotificationBadge count={badges.alerts || 0} variant="warning" position="top-left">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                ⚠️
              </div>
            </NotificationBadge>

            <NotificationBadge count={badges.tasks || 0} variant="success" position="bottom-right">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                ✓
              </div>
            </NotificationBadge>

            <NotificationBadge count={getTotalCount()} variant="error" maxCount={99}>
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                🔔
              </div>
            </NotificationBadge>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={simulateNotifications}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Simulate Notifications
          </button>

          <button
            onClick={() => resetBadge('messages')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Clear Messages
          </button>

          <button
            onClick={() => resetBadge('alerts')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Clear Alerts
          </button>

          <button
            onClick={() => resetBadge('tasks')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Clear Tasks
          </button>

          <button
            onClick={clearAllBadges}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Clear All Badges
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">Total notifications: {getTotalCount()}</div>
      </div>
    </div>
  );
};

export default BadgeCounter;
