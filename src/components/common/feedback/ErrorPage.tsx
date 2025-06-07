import React, { useState, useCallback } from 'react';
import {
  AlertTriangle,
  Home,
  ArrowLeft,
  RefreshCw,
  Search,
  FileX,
  WifiOff,
  Settings,
  HelpCircle,
  FileQuestion,
  Server,
} from 'lucide-react';

export type ErrorType =
  | '404'
  | '500'
  | 'network'
  | 'permission'
  | 'maintenance'
  | 'timeout'
  | 'generic';

export interface ErrorPageProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  showSearchButton?: boolean;
  customActions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: React.ReactNode;
  }>;
  onBack?: () => void;
  onHome?: () => void;
  onRefresh?: () => void;
  onSearch?: () => void;
  className?: string;
  showSuggestions?: boolean;
  fullPage?: boolean;
  animated?: boolean;
}

interface ErrorConfig {
  icon: React.ReactNode;
  title: string;
  message: string;
  color: string;
  bgColor: string;
  suggestions: string[];
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  type = '404',
  title,
  message,
  showBackButton = true,
  showHomeButton = true,
  showRefreshButton = false,
  showSearchButton = false,
  customActions = [],
  onBack,
  onHome,
  onRefresh,
  onSearch,
  className = '',
  showSuggestions = true,
  fullPage = true,
  animated = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  const errorConfigs: Record<ErrorType, ErrorConfig> = {
    '404': {
      icon: <FileX className="w-16 h-16" />,
      title: 'Page Not Found',
      message:
        'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
      color: 'text-accent dark:text-accent-dark',
      bgColor: 'bg-accent-light/10',
      suggestions: [
        'Check the URL for typos',
        'Go back to the previous page',
        'Visit our homepage',
        'Use the search function',
      ],
    },
    '500': {
      icon: <AlertTriangle className="w-16 h-16" />,
      title: 'Internal Server Error',
      message: "Something went wrong on our end. We're working to fix this issue.",
      color: 'text-error dark:text-error-dark',
      bgColor: 'bg-error-light/10',
      suggestions: [
        'Refresh the page',
        'Try again in a few minutes',
        'Clear your browser cache',
        'Contact support if the problem persists',
      ],
    },
    network: {
      icon: <WifiOff className="w-16 h-16" />,
      title: 'Network Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      color: 'text-warning dark:text-warning-dark',
      bgColor: 'bg-warning-light/10',
      suggestions: [
        'Check your internet connection',
        'Try using a different network',
        'Disable your VPN if enabled',
        'Contact your network administrator',
      ],
    },
    permission: {
      icon: <Settings className="w-16 h-16" />,
      title: 'Access Denied',
      message: "You don't have permission to access this resource.",
      color: 'text-warning dark:text-warning-dark',
      bgColor: 'bg-warning-light/10',
      suggestions: [
        'Log in with the correct account',
        'Contact an administrator',
        'Check your account permissions',
        'Return to the homepage',
      ],
    },
    maintenance: {
      icon: <Settings className="w-16 h-16" />,
      title: 'Under Maintenance',
      message: 'This service is temporarily unavailable due to scheduled maintenance.',
      color: 'text-accent dark:text-accent-dark',
      bgColor: 'bg-accent-light/10',
      suggestions: [
        'Try again later',
        'Check our status page',
        'Follow us for updates',
        'Use alternative features',
      ],
    },
    timeout: {
      icon: <RefreshCw className="w-16 h-16" />,
      title: 'Request Timeout',
      message: 'The request took too long to complete. Please try again.',
      color: 'text-text-secondary dark:text-text-secondary',
      bgColor: 'bg-surface-secondary',
      suggestions: [
        'Refresh the page',
        'Check your connection',
        'Try again in a moment',
        'Use a different browser',
      ],
    },
    generic: {
      icon: <HelpCircle className="w-16 h-16" />,
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred. Please try again.',
      color: 'text-text-secondary dark:text-text-secondary',
      bgColor: 'bg-surface-secondary',
      suggestions: [
        'Refresh the page',
        'Go back and try again',
        'Clear browser cache',
        'Contact support',
      ],
    },
  };

  const config = errorConfigs[type];
  const finalTitle = title || config.title;
  const finalMessage = message || config.message;

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  }, [onBack]);

  const handleHome = useCallback(() => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = '/';
    }
  }, [onHome]);

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setIsRetrying(true);
      try {
        await onRefresh();
      } finally {
        setIsRetrying(false);
      }
    } else {
      setIsRetrying(true);
      window.location.reload();
    }
  }, [onRefresh]);

  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch();
    } else if (searchQuery.trim()) {
      // Default search behavior - you can customize this
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  }, [onSearch, searchQuery]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && searchQuery.trim()) {
        handleSearch();
      }
    },
    [handleSearch, searchQuery]
  );

  const getActionButtonClasses = (variant: 'primary' | 'secondary' | 'outline' = 'primary') => {
    const base =
      'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
      primary: `${base} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`,
      secondary: `${base} bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500`,
      outline: `${base} border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500`,
    };

    return variants[variant];
  };

  const containerClasses = fullPage
    ? 'min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12'
    : 'flex items-center justify-center p-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className={`max-w-md w-full text-center ${animated ? 'animate-fade-in' : ''}`}>
        {/* Error Icon */}
        <div
          className={`mx-auto w-24 h-24 ${config.bgColor} ${config.color} rounded-full flex items-center justify-center mb-8 ${animated ? 'animate-bounce' : ''}`}
        >
          {config.icon}
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{finalTitle}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{finalMessage}</p>
        </div>

        {/* Search Bar (for 404 errors) */}
        {(type === '404' || showSearchButton) && (
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for what you're looking for..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {showBackButton && (
            <button onClick={handleBack} className={getActionButtonClasses('outline')}>
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          )}

          {showHomeButton && (
            <button onClick={handleHome} className={getActionButtonClasses('primary')}>
              <Home className="w-5 h-5" />
              Go Home
            </button>
          )}

          {showRefreshButton && (
            <button
              onClick={handleRefresh}
              disabled={isRetrying}
              className={getActionButtonClasses('secondary')}
            >
              <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry'}
            </button>
          )}

          {customActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={getActionButtonClasses(action.variant)}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>

        {/* Suggestions */}
        {showSuggestions && (
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">What you can try:</h3>
            <ul className="space-y-2">
              {config.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Hook for error handling
export const useErrorHandler = () => {
  const [error, setError] = useState<{ type: ErrorType; title?: string; message?: string } | null>(
    null
  );

  const showError = useCallback((type: ErrorType, title?: string, message?: string) => {
    setError({ type, title, message });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handle404 = useCallback(() => {
    showError('404');
  }, [showError]);

  const handle500 = useCallback(() => {
    showError('500');
  }, [showError]);

  const handleNetworkError = useCallback(() => {
    showError('network');
  }, [showError]);

  const handlePermissionError = useCallback(() => {
    showError('permission');
  }, [showError]);

  return {
    error,
    showError,
    clearError,
    handle404,
    handle500,
    handleNetworkError,
    handlePermissionError,
  };
};

// Example usage component
export const ExampleErrorPages: React.FC = () => {
  const [currentError, setCurrentError] = useState<ErrorType>('404');
  const [showDemo, setShowDemo] = useState(false);

  const errorTypes: Array<{ type: ErrorType; label: string; description: string }> = [
    { type: '404', label: '404 Not Found', description: 'Page does not exist' },
    { type: '500', label: '500 Server Error', description: 'Internal server error' },
    { type: 'network', label: 'Network Error', description: 'Connection problem' },
    { type: 'permission', label: 'Access Denied', description: 'Insufficient permissions' },
    { type: 'maintenance', label: 'Maintenance', description: 'Service temporarily unavailable' },
    { type: 'timeout', label: 'Timeout', description: 'Request took too long' },
    { type: 'generic', label: 'Generic Error', description: 'General error state' },
  ];

  const customActions = [
    {
      label: 'Contact Support',
      onClick: () => alert('Contact support clicked'),
      variant: 'outline' as const,
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      label: 'Report Issue',
      onClick: () => alert('Report issue clicked'),
      variant: 'secondary' as const,
      icon: <AlertTriangle className="w-5 h-5" />,
    },
  ];

  if (showDemo) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDemo(false)}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          Close Demo
        </button>

        <ErrorPage
          type={currentError}
          showRefreshButton={
            currentError === '500' || currentError === 'network' || currentError === 'timeout'
          }
          showSearchButton={currentError === '404'}
          customActions={currentError === '500' ? customActions : []}
          onBack={() => setShowDemo(false)}
          onHome={() => setShowDemo(false)}
          onRefresh={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Refresh completed');
          }}
          onSearch={() => alert('Search functionality would be implemented here')}
          fullPage={true}
          animated={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Error Page Types</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {errorTypes.map(({ type, label, description }) => (
            <button
              key={type}
              onClick={() => {
                setCurrentError(type);
                setShowDemo(true);
              }}
              className="p-4 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900 mb-1">{label}</div>
              <div className="text-sm text-gray-600">{description}</div>
            </button>
          ))}
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Features</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Local navigation with browser history support</li>
            <li>• Customizable error types and messages</li>
            <li>• Built-in search functionality for 404 pages</li>
            <li>• Retry mechanisms with loading states</li>
            <li>• Helpful suggestions for each error type</li>
            <li>• Responsive design with animations</li>
            <li>• Custom action buttons support</li>
          </ul>
        </div>
      </div>

      {/* Inline preview examples */}
      <div>
        <h4 className="font-medium mb-4">Inline Error Examples</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Compact 404 Error</h5>
            <ErrorPage
              type="404"
              title="Content Not Found"
              message="This content is no longer available."
              fullPage={false}
              showSuggestions={false}
              showSearchButton={false}
              className="bg-white border border-gray-200 rounded-lg"
            />
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Network Error</h5>
            <ErrorPage
              type="network"
              fullPage={false}
              showSuggestions={false}
              showRefreshButton={true}
              onRefresh={async () => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                alert('Network retry attempted');
              }}
              className="bg-white border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
