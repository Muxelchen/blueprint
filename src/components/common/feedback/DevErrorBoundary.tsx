import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class DevErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 React Error Boundary');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default development-friendly error display
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-2xl w-full mx-4">
            <div className="bg-white border border-red-200 rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">
                    Development Error
                  </h3>
                  <p className="text-red-600">
                    Something went wrong while rendering this component
                  </p>
                </div>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Error Message:</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono text-red-600">
                      {this.state.error.message}
                    </div>
                  </div>

                  {this.state.error.stack && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Stack Trace:</h4>
                      <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-700 max-h-40 overflow-y-auto">
                        <pre>{this.state.error.stack}</pre>
                      </div>
                    </div>
                  )}

                  {this.state.errorInfo && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Component Stack:</h4>
                      <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-700 max-h-40 overflow-y-auto">
                        <pre>{this.state.errorInfo.componentStack}</pre>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Reload Page
                    </button>
                    <button
                      onClick={() => {
                        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
                        // Force a re-render of the child component tree
                        if (this.props.onError) {
                          this.props.onError(new Error('Manual recovery triggered'), { componentStack: '' });
                        }
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {process.env.NODE_ENV === 'production' && (
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Reload Page
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component wrapper
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <DevErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </DevErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
}

export default DevErrorBoundary;