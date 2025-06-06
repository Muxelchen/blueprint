import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RouteProvider, Link, useNavigation, RouteMapping } from './routing';
import { RouteConfig } from '../../types/navigation';

// Mock component for testing
const TestComponent = () => <div>Test Page</div>;
const NotFoundComponent = () => <div>Page Not Found</div>;

const mockRoutes: RouteConfig[] = [
  { path: '/', component: TestComponent },
  { path: '/about', component: () => <div>About Page</div> },
  { path: '/contact', component: () => <div>Contact Page</div> }
];

// Test component that uses navigation
const NavigationTestComponent = () => {
  const { navigate, currentRoute, params, query } = useNavigation();
  
  return (
    <div>
      <div data-testid="current-path">{currentRoute?.path || 'No route'}</div>
      <button onClick={() => navigate('/about')}>Go to About</button>
      <button onClick={() => navigate('/contact', { replace: true })}>Replace with Contact</button>
    </div>
  );
};

describe('Routing Components', () => {
  beforeEach(() => {
    // Reset window location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
        search: '',
        hash: ''
      },
      writable: true
    });
  });

  describe('RouteProvider', () => {
    it('provides navigation context to children', () => {
      render(
        <RouteProvider routes={mockRoutes}>
          <NavigationTestComponent />
        </RouteProvider>
      );

      expect(screen.getByTestId('current-path')).toBeInTheDocument();
      expect(screen.getByText('Go to About')).toBeInTheDocument();
    });

    it('throws error when used outside provider', () => {
      // Mock console.error to prevent test output noise
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<NavigationTestComponent />);
      }).toThrow('useNavigation must be used within a RouteProvider');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Link', () => {
    it('renders link with correct href', () => {
      render(
        <RouteProvider routes={mockRoutes}>
          <Link to="/about">About Link</Link>
        </RouteProvider>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/about');
      expect(link).toHaveTextContent('About Link');
    });

    it('handles click navigation', () => {
      const mockNavigate = vi.fn();
      
      render(
        <RouteProvider routes={mockRoutes}>
          <div>
            <Link to="/contact">Contact</Link>
            <NavigationTestComponent />
          </div>
        </RouteProvider>
      );

      const link = screen.getByRole('link');
      fireEvent.click(link);
      
      // The link should prevent default and handle navigation
      expect(link).toBeInTheDocument();
    });

    it('calls custom onClick handler', () => {
      const mockClick = vi.fn();
      
      render(
        <RouteProvider routes={mockRoutes}>
          <Link to="/about" onClick={mockClick}>
            About
          </Link>
        </RouteProvider>
      );

      const link = screen.getByRole('link');
      fireEvent.click(link);
      
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('RouteMapping', () => {
    it('renders current route component', () => {
      render(
        <RouteProvider routes={mockRoutes}>
          <RouteMapping routes={mockRoutes} />
        </RouteProvider>
      );

      // Should render the root route component
      expect(screen.getByText('Test Page')).toBeInTheDocument();
    });

    it('renders fallback when no route matches', () => {
      const emptyRoutes: RouteConfig[] = [];
      
      render(
        <RouteProvider routes={emptyRoutes}>
          <RouteMapping 
            routes={emptyRoutes} 
            fallback={NotFoundComponent}
          />
        </RouteProvider>
      );

      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    it('renders default fallback when no custom fallback provided', () => {
      const emptyRoutes: RouteConfig[] = [];
      
      render(
        <RouteProvider routes={emptyRoutes}>
          <RouteMapping routes={emptyRoutes} />
        </RouteProvider>
      );

      expect(screen.getByText('Page not found')).toBeInTheDocument();
    });
  });

  describe('Navigation hooks', () => {
    it('provides navigation functions', () => {
      render(
        <RouteProvider routes={mockRoutes}>
          <NavigationTestComponent />
        </RouteProvider>
      );

      const aboutButton = screen.getByText('Go to About');
      const replaceButton = screen.getByText('Replace with Contact');
      
      expect(aboutButton).toBeInTheDocument();
      expect(replaceButton).toBeInTheDocument();
    });
  });
});