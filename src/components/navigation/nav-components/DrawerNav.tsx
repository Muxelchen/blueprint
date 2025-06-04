import React, { useState, useEffect, useRef } from 'react';
import { X, Menu, Home, User, Settings, FileText, BarChart3, Mail, Calendar, ShoppingCart, Users } from 'lucide-react';
import Button from '../../common/buttons/Button';

export interface DrawerNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
  divider?: boolean;
  children?: DrawerNavItem[];
}

export interface DrawerNavProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  items: DrawerNavItem[];
  title?: string;
  footer?: React.ReactNode;
  overlay?: boolean;
  className?: string;
}

const DrawerNav: React.FC<DrawerNavProps> = ({
  isOpen,
  onClose,
  position = 'left',
  size = 'md',
  items,
  title = 'Navigation',
  footer,
  overlay = true,
  className = ''
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      if (overlay) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, overlay]);

  const sizeClasses = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96'
  };

  const positionClasses = {
    left: {
      drawer: 'left-0',
      transform: isOpen ? 'translate-x-0' : '-translate-x-full'
    },
    right: {
      drawer: 'right-0',
      transform: isOpen ? 'translate-x-0' : 'translate-x-full'
    }
  };

  const handleItemClick = (item: DrawerNavItem) => {
    if (item.disabled) return;

    if (item.children && item.children.length > 0) {
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
    } else {
      if (item.onClick) {
        item.onClick();
      }
      if (item.href) {
        window.location.href = item.href;
      }
      onClose();
    }
  };

  const renderNavItem = (item: DrawerNavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSubMenuOpen = activeSubmenu === item.id;
    const paddingLeft = level > 0 ? `pl-${4 + level * 4}` : 'pl-4';

    return (
      <div key={item.id}>
        {item.divider && <div className="border-t border-gray-200 my-2" />}
        
        <button
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
          className={`
            w-full text-left ${paddingLeft} pr-4 py-3 flex items-center justify-between
            transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:bg-gray-100
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isSubMenuOpen ? 'bg-gray-100' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <span className="w-5 h-5 text-gray-600">{item.icon}</span>
            )}
            <span className="text-gray-900 font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          
          {hasChildren && (
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isSubMenuOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>

        {hasChildren && isSubMenuOpen && (
          <div className="bg-gray-50">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      {overlay && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`
          fixed top-0 ${positionClasses[position].drawer} h-full z-50
          ${sizeClasses[size]} bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${positionClasses[position].transform}
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {items.map(item => renderNavItem(item))}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 p-4">
            {footer}
          </div>
        )}
      </div>
    </>
  );
};

// Hook for drawer state management
export const useDrawer = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer
  };
};

// Example usage with mock data
export const ExampleDrawerNav: React.FC = () => {
  const leftDrawer = useDrawer();
  const rightDrawer = useDrawer();

  const navigationItems: DrawerNavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home />,
      onClick: () => console.log('Dashboard clicked')
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 />,
      badge: '5',
      children: [
        {
          id: 'reports',
          label: 'Reports',
          icon: <FileText />,
          onClick: () => console.log('Reports clicked')
        },
        {
          id: 'metrics',
          label: 'Metrics',
          onClick: () => console.log('Metrics clicked')
        },
        {
          id: 'insights',
          label: 'Insights',
          onClick: () => console.log('Insights clicked')
        }
      ]
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <Users />,
      children: [
        {
          id: 'all-users',
          label: 'All Users',
          onClick: () => console.log('All Users clicked')
        },
        {
          id: 'user-roles',
          label: 'Roles & Permissions',
          onClick: () => console.log('Roles clicked')
        },
        {
          id: 'user-groups',
          label: 'User Groups',
          onClick: () => console.log('Groups clicked')
        }
      ]
    },
    {
      id: 'divider1',
      label: '',
      divider: true
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User />,
      onClick: () => console.log('Profile clicked')
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: <Mail />,
      badge: '12',
      onClick: () => console.log('Messages clicked')
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <Calendar />,
      onClick: () => console.log('Calendar clicked')
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingCart />,
      disabled: true,
      onClick: () => console.log('Orders clicked')
    },
    {
      id: 'divider2',
      label: '',
      divider: true
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings />,
      children: [
        {
          id: 'general',
          label: 'General',
          onClick: () => console.log('General settings clicked')
        },
        {
          id: 'security',
          label: 'Security',
          onClick: () => console.log('Security settings clicked')
        },
        {
          id: 'notifications',
          label: 'Notifications',
          onClick: () => console.log('Notification settings clicked')
        }
      ]
    }
  ];

  const quickActions: DrawerNavItem[] = [
    {
      id: 'new-project',
      label: 'New Project',
      onClick: () => console.log('New project')
    },
    {
      id: 'import-data',
      label: 'Import Data',
      onClick: () => console.log('Import data')
    },
    {
      id: 'export-report',
      label: 'Export Report',
      onClick: () => console.log('Export report')
    }
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4">
        <Button
          onClick={leftDrawer.toggleDrawer}
          leftIcon={<Menu />}
        >
          Left Navigation
        </Button>
        
        <Button
          onClick={rightDrawer.toggleDrawer}
          variant="secondary"
          leftIcon={<Menu />}
        >
          Right Quick Actions
        </Button>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Features:</h3>
        <ul className="text-sm space-y-1">
          <li>• Slide-out navigation from left or right</li>
          <li>• Multi-level nested menus</li>
          <li>• Badge support for notifications</li>
          <li>• Keyboard navigation (Escape to close)</li>
          <li>• Click outside to close</li>
          <li>• Custom footer content</li>
          <li>• Responsive design</li>
        </ul>
      </div>

      {/* Left Drawer */}
      <DrawerNav
        isOpen={leftDrawer.isOpen}
        onClose={leftDrawer.closeDrawer}
        position="left"
        size="md"
        title="Main Navigation"
        items={navigationItems}
        footer={
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Dashboard v2.0.1</p>
            <Button size="sm" variant="ghost" fullWidth>
              Sign Out
            </Button>
          </div>
        }
      />

      {/* Right Drawer */}
      <DrawerNav
        isOpen={rightDrawer.isOpen}
        onClose={rightDrawer.closeDrawer}
        position="right"
        size="sm"
        title="Quick Actions"
        items={quickActions}
        footer={
          <div className="space-y-2">
            <Button size="sm" fullWidth>
              Save Changes
            </Button>
            <Button size="sm" variant="ghost" fullWidth>
              Reset
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default DrawerNav;