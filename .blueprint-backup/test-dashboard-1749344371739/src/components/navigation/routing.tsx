import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  RouteConfig,
  NavigationContext,
  NavigationOptions,
  RouteGuard,
  RouteMeta,
} from '../../types/navigation';

// Route Context
const RouteContext = createContext<NavigationContext | null>(null);

// Custom hook to use routing
export const useNavigation = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useNavigation must be used within a RouteProvider');
  }
  return context;
};

// Route Provider Component
export interface RouteProviderProps {
  children: React.ReactNode;
  routes: RouteConfig[];
  basePath?: string;
  fallback?: React.ComponentType<any>;
  guards?: RouteGuard[];
}

export const RouteProvider: React.FC<RouteProviderProps> = ({
  children,
  routes,
  basePath = '',
  fallback: DefaultFallback,
  guards = [],
}) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [currentRoute, setCurrentRoute] = useState<RouteConfig | null>(null);
  const [previousRoute, setPreviousRoute] = useState<RouteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Parse URL parameters and query
  const parseUrl = useCallback((path: string) => {
    const [pathname, search] = path.split('?');
    const [, hash] = search?.split('#') || ['', ''];

    const params: Record<string, string> = {};
    const query: Record<string, string> = {};

    // Parse query parameters
    if (search) {
      const searchParams = new URLSearchParams(search.split('#')[0]);
      searchParams.forEach((value, key) => {
        query[key] = value;
      });
    }

    return { pathname, params, query, hash: hash || '' };
  }, []);

  // Find matching route
  const findRoute = useCallback(
    (path: string): RouteConfig | null => {
      const { pathname } = parseUrl(path);

      const findMatchingRoute = (
        routeList: RouteConfig[],
        currentPath: string
      ): RouteConfig | null => {
        for (const route of routeList) {
          // Simple path matching - in a real implementation, you'd use a proper router
          if (route.path === currentPath || (route.path === '/' && currentPath === '')) {
            return route;
          }

          // Check for dynamic segments
          const routeSegments = route.path.split('/');
          const pathSegments = currentPath.split('/');

          if (routeSegments.length === pathSegments.length) {
            const isMatch = routeSegments.every((segment, index) => {
              return segment.startsWith(':') || segment === pathSegments[index];
            });

            if (isMatch) {
              return route;
            }
          }

          // Check children routes
          if (route.children) {
            const childRoute = findMatchingRoute(route.children, currentPath);
            if (childRoute) {
              return childRoute;
            }
          }
        }
        return null;
      };

      return findMatchingRoute(routes, pathname);
    },
    [routes, parseUrl]
  );

  // Navigation functions
  const navigate = useCallback(
    (path: string, options: NavigationOptions = {}) => {
      const fullPath = basePath + path;

      if (options.replace) {
        window.history.replaceState(options.state, '', fullPath);
      } else {
        window.history.pushState(options.state, '', fullPath);
      }

      setCurrentPath(fullPath);
    },
    [basePath]
  );

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  const goForward = useCallback(() => {
    window.history.forward();
  }, []);

  const replace = useCallback(
    (path: string) => {
      navigate(path, { replace: true });
    },
    [navigate]
  );

  // Create navigation context
  const navigationContext: NavigationContext = {
    currentRoute: currentRoute!,
    previousRoute: previousRoute || undefined,
    ...parseUrl(currentPath),
    user: undefined, // This would come from auth context
    permissions: [], // This would come from auth context
    navigate,
    goBack,
    goForward,
    replace,
  };

  // Handle route changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update current route when path changes
  useEffect(() => {
    const route = findRoute(currentPath);
    if (route) {
      setPreviousRoute(currentRoute);
      setCurrentRoute(route);
    }
  }, [currentPath, findRoute, currentRoute]);

  // Run route guards
  useEffect(() => {
    if (!currentRoute) return;

    const runGuards = async () => {
      setIsLoading(true);

      // Run global guards
      for (const guard of guards) {
        const canActivate = await guard.guard(currentRoute, navigationContext);
        if (!canActivate) {
          if (guard.redirectTo) {
            navigate(guard.redirectTo);
          }
          setIsLoading(false);
          return;
        }
      }

      // Run route-specific guards
      if (currentRoute.guards) {
        for (const guard of currentRoute.guards) {
          const canActivate = await guard.guard(currentRoute, navigationContext);
          if (!canActivate) {
            if (guard.redirectTo) {
              navigate(guard.redirectTo);
            }
            setIsLoading(false);
            return;
          }
        }
      }

      setIsLoading(false);
    };

    runGuards();
  }, [currentRoute, guards, navigationContext, navigate]);

  return <RouteContext.Provider value={navigationContext}>{children}</RouteContext.Provider>;
};

// Route Outlet Component - renders the current route's component
export const RouteOutlet: React.FC = () => {
  const { currentRoute } = useNavigation();

  if (!currentRoute) {
    return <div>Route not found</div>;
  }

  const Component = currentRoute.component;
  return <Component />;
};

// Link Component for navigation
export interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  replace?: boolean;
  state?: any;
  onClick?: (event: React.MouseEvent) => void;
}

export const Link: React.FC<LinkProps> = ({
  to,
  children,
  className = '',
  replace = false,
  state,
  onClick,
  ...props
}) => {
  const { navigate } = useNavigation();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();

    if (onClick) {
      onClick(event);
    }

    navigate(to, { replace, state });
  };

  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

// Route Guard Components
export const AuthGuard: React.FC<{ children: React.ReactNode; fallback?: React.ComponentType }> = ({
  children,
  fallback: Fallback,
}) => {
  const { user } = useNavigation();

  if (!user) {
    return Fallback ? <Fallback /> : <div>Please log in to access this page</div>;
  }

  return <>{children}</>;
};

export const RoleGuard: React.FC<{
  children: React.ReactNode;
  roles: string[];
  fallback?: React.ComponentType;
}> = ({ children, roles, fallback: Fallback }) => {
  const { user, permissions } = useNavigation();

  const hasRequiredRole = roles.some(role => permissions.includes(role));

  if (!hasRequiredRole) {
    return Fallback ? <Fallback /> : <div>You don't have permission to access this page</div>;
  }

  return <>{children}</>;
};

// Route Mapper Component - generates routes from configuration
export interface RouteMapperProps {
  routes: RouteConfig[];
  fallback?: React.ComponentType;
}

export const RouteMapping: React.FC<RouteMapperProps> = ({ routes, fallback }) => {
  const { currentRoute } = useNavigation();

  if (!currentRoute) {
    return fallback ? React.createElement(fallback) : <div>Page not found</div>;
  }

  const Component = currentRoute.component;

  // Apply layout if specified
  if (currentRoute.meta?.layout) {
    // In a real implementation, you'd resolve the layout component
    return <Component />;
  }

  return <Component />;
};

// Higher-order component for route protection
export const withRouteGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  guards: RouteGuard[]
) => {
  return (props: P) => {
    const navigationContext = useNavigation();
    const [canRender, setCanRender] = useState(false);

    useEffect(() => {
      const checkGuards = async () => {
        for (const guard of guards) {
          const canActivate = await guard.guard(navigationContext.currentRoute, navigationContext);
          if (!canActivate) {
            if (guard.redirectTo) {
              navigationContext.navigate(guard.redirectTo);
            }
            return;
          }
        }
        setCanRender(true);
      };

      checkGuards();
    }, [navigationContext]);

    if (!canRender) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

// Breadcrumb generator based on current route
export const useBreadcrumb = () => {
  const { currentRoute } = useNavigation();

  const generateBreadcrumb = useCallback(() => {
    if (!currentRoute?.meta?.breadcrumb) {
      return [];
    }

    return currentRoute.meta.breadcrumb;
  }, [currentRoute]);

  return generateBreadcrumb();
};

// Route preloader for code splitting
export const useRoutePreloader = () => {
  const preloadRoute = useCallback(async (path: string) => {
    // In a real implementation, this would preload the route's component
    // This is useful for code splitting with React.lazy
    console.log(`Preloading route: ${path}`);
  }, []);

  return { preloadRoute };
};

// Route transition hook
export const useRouteTransition = () => {
  const { currentRoute, previousRoute } = useNavigation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (previousRoute && currentRoute && previousRoute !== currentRoute) {
      setIsTransitioning(true);

      // Simulate transition duration
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentRoute, previousRoute]);

  return { isTransitioning };
};
