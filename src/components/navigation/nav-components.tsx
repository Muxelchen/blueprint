import React, { useState, useRef, useEffect } from 'react';
import {
  NavigationProps,
  NavigationItem,
  DrawerNavigationProps,
  SidebarNavigationProps,
  SidebarNavigationItem,
} from '../../types/navigation';

// NavBar Component
export interface NavBarProps extends NavigationProps {
  brand?: React.ReactNode;
  items?: NavigationItem[];
  actions?: React.ReactNode;
  sticky?: boolean;
  transparent?: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({
  brand,
  items = [],
  actions,
  variant = 'horizontal',
  size = 'md',
  sticky = false,
  transparent = false,
  className = '',
  ...props
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseClasses = `
    w-full flex items-center justify-between px-4 py-2
    ${sticky ? 'sticky top-0 z-50' : ''}
    ${transparent ? 'bg-transparent' : 'bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700'}
    ${size === 'sm' ? 'h-12' : size === 'lg' ? 'h-20' : 'h-16'}
  `.trim();

  return (
    <nav className={`${baseClasses} ${className}`} {...props}>
      {/* Brand */}
      {brand && <div className="flex-shrink-0">{brand}</div>}

      {/* Desktop Navigation Items */}
      <div className="hidden md:flex items-center space-x-6">
        {items.map(item => (
          <NavItem key={item.id} item={item} />
        ))}
      </div>

      {/* Actions */}
      {actions && <div className="flex items-center space-x-4">{actions}</div>}

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:hidden">
          <div className="px-4 py-2 space-y-2">
            {items.map(item => (
              <NavItem key={item.id} item={item} mobile />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Navigation Item Component
interface NavItemProps {
  item: NavigationItem;
  mobile?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, mobile = false }) => {
  const baseClasses = mobile
    ? 'block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700'
    : 'px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700';

  const activeClasses = item.active
    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    : 'text-gray-700 dark:text-gray-300';

  const disabledClasses = item.disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  const handleClick = (e: React.MouseEvent) => {
    if (item.disabled) return;
    if (item.onClick) {
      item.onClick(e);
    }
  };

  const content = (
    <span className="flex items-center">
      {item.icon && (
        <span className="mr-2">
          <i className={item.icon} />
        </span>
      )}
      {item.label}
      {item.badge && (
        <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
          {item.badge}
        </span>
      )}
    </span>
  );

  if (item.href || item.path) {
    return (
      <a
        href={item.href || item.path}
        target={item.target}
        className={`${baseClasses} ${activeClasses} ${disabledClasses}`}
        onClick={handleClick}
        onMouseEnter={item.onHover}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={`${baseClasses} ${activeClasses} ${disabledClasses}`}
      onClick={handleClick}
      onMouseEnter={item.onHover}
    >
      {content}
    </button>
  );
};

// DrawerNav Component
export const DrawerNav: React.FC<DrawerNavigationProps> = ({
  children,
  open,
  placement = 'left',
  size = 'md',
  overlay = true,
  closeOnEscape = true,
  closeOnOverlay = true,
  lockScroll = true,
  preserveFocus = true,
  onClose,
  onOpen,
  className = '',
  ...props
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && onOpen) {
      onOpen();
    }
  }, [open, onOpen]);

  useEffect(() => {
    if (lockScroll) {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }

    return () => {
      if (lockScroll) {
        document.body.style.overflow = '';
      }
    };
  }, [open, lockScroll]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && open && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, open, onClose]);

  const getDrawerSize = () => {
    if (typeof size === 'number' || typeof size === 'string') {
      return size;
    }
    return size === 'sm' ? '256px' : size === 'lg' ? '512px' : '384px';
  };

  const getDrawerClasses = () => {
    const baseClasses =
      'fixed bg-white dark:bg-gray-800 shadow-lg z-50 transition-transform duration-300';
    const sizeValue = getDrawerSize();

    switch (placement) {
      case 'left':
        return `${baseClasses} top-0 left-0 h-full transform ${open ? 'translate-x-0' : '-translate-x-full'}`;
      case 'right':
        return `${baseClasses} top-0 right-0 h-full transform ${open ? 'translate-x-0' : 'translate-x-full'}`;
      case 'top':
        return `${baseClasses} top-0 left-0 w-full transform ${open ? 'translate-y-0' : '-translate-y-full'}`;
      case 'bottom':
        return `${baseClasses} bottom-0 left-0 w-full transform ${open ? 'translate-y-0' : 'translate-y-full'}`;
      default:
        return baseClasses;
    }
  };

  const getDrawerStyle = () => {
    const sizeValue = getDrawerSize();
    if (placement === 'left' || placement === 'right') {
      return { width: sizeValue };
    } else {
      return { height: sizeValue };
    }
  };

  if (!open && !overlay) return null;

  return (
    <>
      {/* Overlay */}
      {overlay && open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeOnOverlay ? onClose : undefined}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`${getDrawerClasses()} ${className}`}
        style={getDrawerStyle()}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

// NavigationSystem Component - Main navigation orchestrator
export interface NavigationSystemProps {
  type: 'navbar' | 'sidebar' | 'drawer';
  navbarProps?: NavBarProps;
  sidebarProps?: SidebarNavigationProps;
  drawerProps?: DrawerNavigationProps;
  responsive?: boolean;
}

export const NavigationSystem: React.FC<NavigationSystemProps> = ({
  type,
  navbarProps,
  sidebarProps,
  drawerProps,
  responsive = true,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (responsive && isMobile && type === 'sidebar') {
    return (
      <>
        <NavBar
          {...navbarProps}
          actions={
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          }
        />
        <DrawerNav {...drawerProps} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <SidebarNavigation {...sidebarProps} items={sidebarProps?.items || []} />
        </DrawerNav>
      </>
    );
  }

  switch (type) {
    case 'navbar':
      return <NavBar {...navbarProps} />;
    case 'sidebar':
      return <SidebarNavigation {...sidebarProps} items={sidebarProps?.items || []} />;
    case 'drawer':
      return <DrawerNav {...drawerProps} open={drawerProps?.open || false} />;
    default:
      return null;
  }
};

// SidebarNavigation Component
const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  items = [],
  collapsed = false,
  collapsible = true,
  width = 256,
  collapsedWidth = 64,
  theme = 'light',
  onItemSelect,
  onToggle,
  className = '',
  ...props
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const themeClasses =
    theme === 'dark'
      ? 'bg-gray-900 text-white border-gray-700'
      : 'bg-white text-gray-900 border-gray-200';

  const currentWidth = collapsed ? collapsedWidth : width;

  return (
    <div
      className={`h-full border-r transition-all duration-300 ${themeClasses} ${className}`}
      style={{ width: currentWidth }}
      {...props}
    >
      {/* Toggle Button */}
      {collapsible && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onToggle?.(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto">
        {items.map(item => (
          <SidebarItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            expanded={expandedItems.has(item.id)}
            onToggleExpanded={() => toggleExpanded(item.id)}
            onSelect={onItemSelect}
            level={0}
          />
        ))}
      </div>
    </div>
  );
};

// SidebarItem Component
interface SidebarItemProps {
  item: SidebarNavigationItem;
  collapsed: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  onSelect?: (item: SidebarNavigationItem) => void;
  level: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  collapsed,
  expanded,
  onToggleExpanded,
  onSelect,
  level,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const paddingLeft = collapsed ? 0 : level * 16 + 16;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      onToggleExpanded();
    } else {
      onSelect?.(item);
      item.onClick?.(e);
    }
  };

  const baseClasses = `
    w-full flex items-center p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700
    ${item.active ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : ''}
    ${collapsed ? 'justify-center' : ''}
  `.trim();

  return (
    <>
      <button
        className={baseClasses}
        style={{ paddingLeft: collapsed ? undefined : paddingLeft }}
        onClick={handleClick}
        title={collapsed ? item.label : undefined}
      >
        {item.icon && (
          <span className={collapsed ? '' : 'mr-3'}>
            <i className={item.icon} />
          </span>
        )}

        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>

            {item.badge && (
              <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                {item.badge}
              </span>
            )}

            {hasChildren && (
              <svg
                className={`w-4 h-4 ml-2 transform transition-transform ${expanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </>
        )}
      </button>

      {/* Children */}
      {hasChildren && expanded && !collapsed && (
        <div>
          {item.children!.map(child => (
            <SidebarItem
              key={child.id}
              item={child}
              collapsed={collapsed}
              expanded={false}
              onToggleExpanded={() => {}}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </>
  );
};
