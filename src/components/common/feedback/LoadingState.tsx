import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Wifi, WifiOff, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export interface LoadingStateProps {
  isLoading?: boolean;
  message?: string;
  progress?: number;
  variant?: 'spinner' | 'dots' | 'pulse' | 'bar' | 'skeleton';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  overlay?: boolean;
  showProgress?: boolean;
  mockDelay?: number;
  className?: string;
  children?: React.ReactNode;
}

export interface AsyncLoadingProps {
  asyncFunction: () => Promise<any>;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  children: (result: any, error: any) => React.ReactNode;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading = false,
  message = 'Loading...',
  progress = 0,
  variant = 'spinner',
  size = 'md',
  color = 'blue',
  overlay = false,
  showProgress = false,
  mockDelay = 0,
  className = '',
  children
}) => {
  const [internalLoading, setInternalLoading] = useState(isLoading);
  const [currentProgress, setCurrentProgress] = useState(progress);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Mock loading with delay
  useEffect(() => {
    if (mockDelay > 0 && isLoading) {
      setInternalLoading(true);
      const timer = setTimeout(() => {
        setInternalLoading(false);
      }, mockDelay);
      return () => clearTimeout(timer);
    } else {
      setInternalLoading(isLoading);
    }
  }, [isLoading, mockDelay]);

  // Simulate progress
  useEffect(() => {
    if (internalLoading && showProgress && progress === 0) {
      setCurrentProgress(0);
      intervalRef.current = setInterval(() => {
        setCurrentProgress(prev => {
          const increment = Math.random() * 15 + 5;
          const newProgress = Math.min(prev + increment, 90);
          return newProgress;
        });
      }, 500);
    } else {
      setCurrentProgress(progress);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [internalLoading, showProgress, progress]);

  // Complete progress when loading finishes
  useEffect(() => {
    if (!internalLoading && showProgress && currentProgress < 100) {
      setCurrentProgress(100);
    }
  }, [internalLoading, showProgress, currentProgress]);

  const getSizeClasses = () => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };
    return sizes[size];
  };

  const getColorClasses = () => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      red: 'text-red-600',
      purple: 'text-purple-600',
      gray: 'text-gray-600'
    };
    return colors[color];
  };

  const renderSpinner = () => (
    <Loader2 className={`animate-spin ${getSizeClasses()} ${getColorClasses()}`} />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`rounded-full ${getSizeClasses()} ${getColorClasses().replace('text-', 'bg-')} animate-pulse`}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={`${getSizeClasses()} ${getColorClasses().replace('text-', 'bg-')} rounded-full animate-pulse`} />
  );

  const renderProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${getColorClasses().replace('text-', 'bg-')}`}
        style={{ width: `${currentProgress}%` }}
      />
    </div>
  );

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  );

  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bar':
        return renderProgressBar();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  if (!internalLoading && !children) {
    return null;
  }

  const loadingContent = (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {variant !== 'skeleton' && renderLoadingIndicator()}
      {variant === 'skeleton' && renderSkeleton()}
      
      {message && variant !== 'skeleton' && (
        <p className="text-sm text-gray-600 text-center">{message}</p>
      )}
      
      {showProgress && variant !== 'bar' && variant !== 'skeleton' && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(currentProgress)}%</span>
          </div>
          {renderProgressBar()}
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 shadow-xl">
          {loadingContent}
        </div>
      </div>
    );
  }

  if (children) {
    return (
      <div className="relative">
        {children}
        {internalLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            {loadingContent}
          </div>
        )}
      </div>
    );
  }

  return loadingContent;
};

// Async Loading Wrapper Component
export const AsyncLoadingWrapper: React.FC<AsyncLoadingProps> = ({
  asyncFunction,
  loadingMessage = 'Loading...',
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState<Error | null>(null);

  const executeAsync = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await asyncFunction();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeAsync();
  }, []);

  return (
    <>
      {loading && (
        <LoadingState
          isLoading={true}
          message={loadingMessage}
          variant="spinner"
          showProgress={true}
        />
      )}
      {!loading && children(result, error)}
    </>
  );
};

// Connection Status Component
export const ConnectionStatus: React.FC<{
  isOnline?: boolean;
  showDetails?: boolean;
  className?: string;
}> = ({ isOnline, showDetails = false, className = '' }) => {
  const [online, setOnline] = useState(isOnline ?? navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {online ? (
        <Wifi className="w-4 h-4 text-green-600" />
      ) : (
        <WifiOff className="w-4 h-4 text-red-600" />
      )}
      
      <span className={`text-sm ${online ? 'text-green-600' : 'text-red-600'}`}>
        {online ? 'Online' : 'Offline'}
      </span>
      
      {showDetails && online && connectionType !== 'unknown' && (
        <span className="text-xs text-gray-500">
          ({connectionType})
        </span>
      )}
    </div>
  );
};

// Loading Button Component
export const LoadingButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => Promise<void> | void;
  loading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  loadingText = 'Loading...',
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(loading);

  const handleClick = async () => {
    if (isLoading || disabled || !onClick) return;

    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  const getVariantClasses = () => {
    const base = 'font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
      primary: `${base} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`,
      secondary: `${base} bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500`,
      danger: `${base} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`
    };
    return variants[variant];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };
    return sizes[size];
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={`${getVariantClasses()} ${getSizeClasses()} ${className} flex items-center space-x-2`}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{isLoading ? loadingText : children}</span>
    </button>
  );
};

// Status Indicator Component
export const StatusIndicator: React.FC<{
  status: 'loading' | 'success' | 'error' | 'warning';
  message?: string;
  showIcon?: boolean;
  className?: string;
}> = ({ status, message, showIcon = true, className = '' }) => {
  const getStatusConfig = () => {
    const configs = {
      loading: {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      success: {
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      error: {
        icon: <XCircle className="w-4 h-4" />,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      },
      warning: {
        icon: <AlertCircle className="w-4 h-4" />,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      }
    };
    return configs[status];
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center space-x-2 p-3 rounded-lg border ${config.bgColor} ${config.borderColor} ${className}`}>
      {showIcon && (
        <div className={config.color}>
          {config.icon}
        </div>
      )}
      {message && (
        <span className={`text-sm ${config.color}`}>{message}</span>
      )}
    </div>
  );
};

// Example usage component
export const ExampleLoadingState: React.FC = () => {
  const [basicLoading, setBasicLoading] = useState(false);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);

  const mockApiCall = (delay: number = 2000) => {
    return new Promise(resolve => setTimeout(resolve, delay));
  };

  const handleBasicLoading = async () => {
    setBasicLoading(true);
    await mockApiCall(3000);
    setBasicLoading(false);
  };

  const handleOverlayLoading = async () => {
    setOverlayLoading(true);
    await mockApiCall(4000);
    setOverlayLoading(false);
  };

  const handleProgressLoading = async () => {
    setProgressLoading(true);
    await mockApiCall(5000);
    setProgressLoading(false);
  };

  const handleButtonAction = async () => {
    await mockApiCall(2000);
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Loading State System</h3>
        
        {/* Connection Status */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium mb-3">Connection Status</h4>
          <ConnectionStatus showDetails={true} />
        </div>

        {/* Loading Variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Spinner Variants */}
          <div className="space-y-4">
            <h4 className="font-medium">Spinner Variants</h4>
            <div className="space-y-3">
              <LoadingState isLoading={true} variant="spinner" size="sm" message="Small spinner" />
              <LoadingState isLoading={true} variant="spinner" size="md" message="Medium spinner" />
              <LoadingState isLoading={true} variant="spinner" size="lg" message="Large spinner" />
            </div>
          </div>

          {/* Dots Variants */}
          <div className="space-y-4">
            <h4 className="font-medium">Dots Variants</h4>
            <div className="space-y-3">
              <LoadingState isLoading={true} variant="dots" color="blue" message="Blue dots" />
              <LoadingState isLoading={true} variant="dots" color="green" message="Green dots" />
              <LoadingState isLoading={true} variant="dots" color="purple" message="Purple dots" />
            </div>
          </div>

          {/* Pulse Variants */}
          <div className="space-y-4">
            <h4 className="font-medium">Pulse & Bar</h4>
            <div className="space-y-3">
              <LoadingState isLoading={true} variant="pulse" color="red" message="Pulse loading" />
              <LoadingState isLoading={true} variant="bar" progress={65} message="Progress bar" />
            </div>
          </div>
        </div>

        {/* Skeleton Loading */}
        <div className="mb-8">
          <h4 className="font-medium mb-3">Skeleton Loading</h4>
          <div className="border border-gray-200 rounded-lg p-4">
            <LoadingState isLoading={true} variant="skeleton" />
          </div>
        </div>

        {/* Interactive Examples */}
        <div className="space-y-6">
          <h4 className="font-medium">Interactive Loading Examples</h4>
          
          {/* Basic Loading */}
          <div>
            <button
              onClick={handleBasicLoading}
              disabled={basicLoading}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Trigger Basic Loading
            </button>
            
            <div className="border border-gray-200 rounded-lg p-6 min-h-32">
              {basicLoading ? (
                <LoadingState
                  isLoading={true}
                  message="Fetching data from server..."
                  variant="spinner"
                  size="md"
                />
              ) : (
                <div>
                  <h5 className="font-medium mb-2">Content Loaded</h5>
                  <p className="text-gray-600">This content appears after loading completes.</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Loading */}
          <div>
            <button
              onClick={handleProgressLoading}
              disabled={progressLoading}
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Trigger Progress Loading
            </button>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <LoadingState
                isLoading={progressLoading}
                message="Processing your request..."
                variant="spinner"
                showProgress={true}
                size="md"
              >
                <div>
                  <h5 className="font-medium mb-2">Data Processing Complete</h5>
                  <p className="text-gray-600">Your data has been successfully processed.</p>
                </div>
              </LoadingState>
            </div>
          </div>

          {/* Loading Buttons */}
          <div className="space-y-4">
            <h5 className="font-medium">Loading Buttons</h5>
            <div className="flex flex-wrap gap-4">
              <LoadingButton
                onClick={handleButtonAction}
                variant="primary"
                loadingText="Saving..."
              >
                Save Changes
              </LoadingButton>
              
              <LoadingButton
                onClick={handleButtonAction}
                variant="secondary"
                loadingText="Uploading..."
              >
                Upload File
              </LoadingButton>
              
              <LoadingButton
                onClick={handleButtonAction}
                variant="danger"
                loadingText="Deleting..."
              >
                Delete Item
              </LoadingButton>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="space-y-3">
            <h5 className="font-medium">Status Indicators</h5>
            <div className="space-y-2">
              <StatusIndicator status="loading" message="Loading user data..." />
              <StatusIndicator status="success" message="Data loaded successfully" />
              <StatusIndicator status="warning" message="Connection is slow" />
              <StatusIndicator status="error" message="Failed to load data" />
            </div>
          </div>

          {/* Overlay Loading */}
          <div>
            <button
              onClick={handleOverlayLoading}
              disabled={overlayLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              Trigger Overlay Loading
            </button>
          </div>

          {/* Async Loading Wrapper Example */}
          <div>
            <h5 className="font-medium mb-3">Async Loading Wrapper</h5>
            <div className="border border-gray-200 rounded-lg p-4">
              <AsyncLoadingWrapper
                asyncFunction={() => mockApiCall(3000).then(() => ({ message: 'Data loaded!', timestamp: new Date() }))}
                loadingMessage="Fetching async data..."
              >
                {(result, error) => (
                  <div>
                    {result && (
                      <div>
                        <h6 className="font-medium">Async Result:</h6>
                        <p className="text-sm text-gray-600">{result.message}</p>
                        <p className="text-xs text-gray-500">Loaded at: {result.timestamp?.toLocaleTimeString()}</p>
                      </div>
                    )}
                    {error && (
                      <div className="text-red-600">
                        <h6 className="font-medium">Error:</h6>
                        <p className="text-sm">{error.message}</p>
                      </div>
                    )}
                  </div>
                )}
              </AsyncLoadingWrapper>
            </div>
          </div>
        </div>

        {/* Overlay Loading State */}
        <LoadingState
          isLoading={overlayLoading}
          message="Processing your request..."
          variant="spinner"
          size="lg"
          overlay={true}
          showProgress={true}
        />

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Loading State Features</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Multiple loading variants: spinner, dots, pulse, progress bar, skeleton</li>
            <li>• Configurable sizes, colors, and overlay modes</li>
            <li>• Mock delays for testing and demonstration</li>
            <li>• Progress tracking with automatic simulation</li>
            <li>• Connection status monitoring</li>
            <li>• Loading buttons with async support</li>
            <li>• Status indicators for different states</li>
            <li>• Async wrapper component for data fetching</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;