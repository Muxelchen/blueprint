import React, { useState, useEffect, useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';

export interface BadgeCounterProps {
  count: number;
  maxCount?: number;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showZero?: boolean;
  animated?: boolean;
  interactive?: boolean;
  onCountChange?: (newCount: number) => void;
  className?: string;
  label?: string;
}

export interface BadgeCounterState {
  currentCount: number;
  isAnimating: boolean;
  history: number[];
}

const BadgeCounter: React.FC<BadgeCounterProps> = ({
  count: initialCount,
  maxCount = 99,
  variant = 'default',
  size = 'md',
  showZero = false,
  animated = true,
  interactive = false,
  onCountChange,
  className = '',
  label
}) => {
  const [state, setState] = useState<BadgeCounterState>({
    currentCount: initialCount,
    isAnimating: false,
    history: [initialCount]
  });

  // Load count from localStorage if available
  useEffect(() => {
    const storageKey = `badge-counter-${label || 'default'}`;
    const savedCount = localStorage.getItem(storageKey);
    if (savedCount && !isNaN(Number(savedCount))) {
      const count = Number(savedCount);
      setState(prev => ({
        ...prev,
        currentCount: count,
        history: [count]
      }));
    }
  }, [label]);

  // Save count to localStorage when it changes
  useEffect(() => {
    if (label) {
      const storageKey = `badge-counter-${label}`;
      localStorage.setItem(storageKey, state.currentCount.toString());
    }
  }, [state.currentCount, label]);

  // Update count when prop changes
  useEffect(() => {
    if (initialCount !== state.currentCount) {
      updateCount(initialCount);
    }
  }, [initialCount]);

  const updateCount = useCallback((newCount: number, animate = true) => {
    const clampedCount = Math.max(0, newCount);
    
    setState(prev => {
      if (animate && animated) {
        return {
          currentCount: clampedCount,
          isAnimating: true,
          history: [...prev.history.slice(-9), clampedCount] // Keep last 10 values
        };
      }
      
      return {
        currentCount: clampedCount,
        isAnimating: false,
        history: [...prev.history.slice(-9), clampedCount]
      };
    });

    if (animate && animated) {
      setTimeout(() => {
        setState(prev => ({ ...prev, isAnimating: false }));
      }, 300);
    }

    onCountChange?.(clampedCount);
  }, [animated, onCountChange]);

  const increment = useCallback(() => {
    updateCount(state.currentCount + 1);
  }, [state.currentCount, updateCount]);

  const decrement = useCallback(() => {
    updateCount(Math.max(0, state.currentCount - 1));
  }, [state.currentCount, updateCount]);

  const getDisplayCount = () => {
    if (state.currentCount > maxCount) {
      return `${maxCount}+`;
    }
    return state.currentCount.toString();
  };

  const getBadgeStyles = () => {
    const sizeClasses = {
      sm: 'px-1.5 py-0.5 text-xs min-w-[1.25rem] h-5',
      md: 'px-2 py-1 text-sm min-w-[1.5rem] h-6',
      lg: 'px-2.5 py-1.5 text-base min-w-[2rem] h-8'
    };

    const variantClasses = {
      default: 'bg-gray-500 text-white',
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-600 text-white',
      success: 'bg-green-500 text-white',
      warning: 'bg-yellow-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-400 text-white'
    };

    const animationClasses = state.isAnimating && animated
      ? 'transform scale-110 transition-transform duration-300 ease-out'
      : 'transition-all duration-200 ease-in-out';

    return `
      inline-flex items-center justify-center rounded-full font-semibold
      ${sizeClasses[size]} ${variantClasses[variant]} ${animationClasses}
    `;
  };

  const getInteractiveStyles = () => {
    if (!interactive) return '';
    
    return `
      cursor-pointer hover:opacity-80 active:scale-95
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    `;
  };

  const shouldShow = showZero || state.currentCount > 0;

  if (!shouldShow) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {interactive && (
        <button
          onClick={decrement}
          disabled={state.currentCount <= 0}
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease count"
        >
          <Minus className="w-3 h-3" />
        </button>
      )}

      <span
        className={`${getBadgeStyles()} ${getInteractiveStyles()}`}
        onClick={interactive ? increment : undefined}
        onKeyDown={interactive ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            increment();
          }
        } : undefined}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        aria-label={`Count: ${state.currentCount}${interactive ? '. Click to increment.' : ''}`}
      >
        {getDisplayCount()}
      </span>

      {interactive && (
        <button
          onClick={increment}
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-label="Increase count"
        >
          <Plus className="w-3 h-3" />
        </button>
      )}
    </div>
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
        [id]: Math.max(0, count)
      }
    }));
  }, []);

  const incrementBadge = useCallback((id: string, amount = 1) => {
    setState(prev => ({
      badges: {
        ...prev.badges,
        [id]: (prev.badges[id] || 0) + amount
      }
    }));
  }, []);

  const decrementBadge = useCallback((id: string, amount = 1) => {
    setState(prev => ({
      badges: {
        ...prev.badges,
        [id]: Math.max(0, (prev.badges[id] || 0) - amount)
      }
    }));
  }, []);

  const resetBadge = useCallback((id: string) => {
    setState(prev => ({
      badges: {
        ...prev.badges,
        [id]: 0
      }
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
    getBadgeCount: (id: string) => state.badges[id] || 0
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
  className = ''
}) => {
  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-0 right-0 transform translate-x-1/2 -translate-y-1/2',
      'top-left': 'top-0 left-0 transform -translate-x-1/2 -translate-y-1/2',
      'bottom-right': 'bottom-0 right-0 transform translate-x-1/2 translate-y-1/2',
      'bottom-left': 'bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2'
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
            transform: `translate(${offset.x}px, ${offset.y}px)`
          }}
        >
          <BadgeCounter
            count={count}
            maxCount={maxCount}
            variant={variant}
            size={size}
            showZero={showZero}
            animated={true}
          />
        </div>
      )}
    </div>
  );
};

// Example usage component
export const ExampleBadges: React.FC = () => {
  const {
    badges,
    incrementBadge,
    resetBadge,
    clearAllBadges,
    getTotalCount
  } = useBadgeManager();

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
                <BadgeCounter count={156} maxCount={99} size="lg" variant="error" />
              </div>
            </div>
          </div>

          {/* Interactive Badge */}
          <div className="space-y-4">
            <h4 className="font-medium">Interactive Counter</h4>
            <div className="space-y-2">
              <BadgeCounter
                count={localCount}
                interactive={true}
                variant="primary"
                label="interactive-demo"
                onCountChange={setLocalCount}
              />
              <div className="text-sm text-gray-600">
                Click the badge or use +/- buttons
              </div>
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
                  <BadgeCounter
                    count={badges.messages || 0}
                    variant="info"
                    showZero
                  />
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
                  <BadgeCounter
                    count={badges.alerts || 0}
                    variant="warning"
                    showZero
                  />
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
                  <BadgeCounter
                    count={badges.tasks || 0}
                    variant="success"
                    showZero
                  />
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

        <div className="mt-4 text-sm text-gray-600">
          Total notifications: {getTotalCount()}
        </div>
      </div>
    </div>
  );
};

export default BadgeCounter;