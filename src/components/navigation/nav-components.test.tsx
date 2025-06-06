import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavBar, DrawerNav, NavigationSystem } from './nav-components';
import { NavigationItem } from '../../types/navigation';

describe('Navigation Components', () => {
  describe('NavBar', () => {
    it('renders brand and navigation items', () => {
      const items: NavigationItem[] = [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'About', href: '/about' }
      ];

      render(
        <NavBar 
          brand={<span>Test Brand</span>}
          items={items}
        />
      );

      expect(screen.getByText('Test Brand')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('handles mobile menu toggle', () => {
      render(<NavBar />);
      
      const mobileButton = screen.getByRole('button');
      expect(mobileButton).toBeInTheDocument();
    });

    it('applies sticky and transparent styles', () => {
      render(<NavBar sticky transparent />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('sticky');
      expect(nav).toHaveClass('bg-transparent');
    });
  });

  describe('DrawerNav', () => {
    it('renders when open', () => {
      render(
        <DrawerNav open={true}>
          <div>Drawer Content</div>
        </DrawerNav>
      );

      expect(screen.getByText('Drawer Content')).toBeInTheDocument();
    });

    it('does not render when closed and no overlay', () => {
      render(
        <DrawerNav open={false} overlay={false}>
          <div>Drawer Content</div>
        </DrawerNav>
      );

      expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();
    });

    it('renders overlay when open', () => {
      render(
        <DrawerNav open={true} overlay={true}>
          <div>Content</div>
        </DrawerNav>
      );

      const overlay = document.querySelector('.bg-black.bg-opacity-50');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('NavigationSystem', () => {
    it('renders navbar type', () => {
      const navbarProps = {
        brand: <span>Test</span>
      };

      render(
        <NavigationSystem 
          type="navbar" 
          navbarProps={navbarProps}
        />
      );

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('renders drawer type', () => {
      const drawerProps = {
        open: true,
        children: <div>Drawer Test</div>
      };

      render(
        <NavigationSystem 
          type="drawer" 
          drawerProps={drawerProps}
        />
      );

      expect(screen.getByText('Drawer Test')).toBeInTheDocument();
    });
  });
});