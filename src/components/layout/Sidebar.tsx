import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BarChart3,
  Map,
  Settings,
  User,
  Calendar,
  FileText,
  Archive,
  Layers,
  Activity,
  MessageSquare,
  HelpCircle,
  Shield,
  Database,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Star,
  Grid,
  Table,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';

interface SidebarProps {
  // Mobile props kept for backwards compatibility
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { 
    sidebarCollapsed, 
    isMobileSidebarOpen, 
    toggleSidebarCollapsed, 
    toggleMobileSidebar,
    setMobileSidebarOpen 
  } = useAppStore();
  
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const location = useLocation();

  // Use global state for mobile sidebar, fallback to props for compatibility
  const mobileIsOpen = isOpen !== undefined ? isOpen : isMobileSidebarOpen;
  const mobileToggle = onToggle || toggleMobileSidebar;

  // Main navigation items
  const mainNavigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      badge: null,
      submenu: [
        { name: 'Overview', href: '/' },
        { name: 'Analytics', href: '/analytics' },
        { name: 'Reports', href: '/reports' },
      ],
    },
    {
      name: 'Components',
      href: '/showcase',
      icon: Grid,
      badge: null,
      submenu: [
        { name: 'Component Showcase', href: '/showcase' },
        { name: 'Widgets', href: '/test-widgets' },
      ],
    },
    {
      name: 'Templates',
      href: '/templates',
      icon: Table,
      badge: null,
      submenu: [
        { name: 'Dashboard Templates', href: '/templates' },
        { name: 'Analytics Template', href: '/templates/analytics' },
        { name: 'Data Table Template', href: '/templates/datatable' },
      ],
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      badge: 'New',
      submenu: [
        { name: 'Traffic', href: '/analytics/traffic' },
        { name: 'Conversions', href: '/analytics/conversions' },
        { name: 'Revenue', href: '/analytics/revenue' },
      ],
    },
    {
      name: 'Maps',
      href: '/map',
      icon: Map,
      badge: null,
      submenu: [
        { name: 'Interactive Map', href: '/map' },
        { name: 'Heat Maps', href: '/map/heat' },
        { name: 'Locations', href: '/map/locations' },
      ],
    },
    {
      name: 'Activity',
      href: '/activity',
      icon: Activity,
      badge: '12',
      submenu: [
        { name: 'Recent Activity', href: '/activity' },
        { name: 'User Actions', href: '/activity/users' },
        { name: 'System Logs', href: '/activity/logs' },
      ],
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Layers,
      badge: null,
      submenu: [
        { name: 'All Projects', href: '/projects' },
        { name: 'Active', href: '/projects/active' },
        { name: 'Archived', href: '/projects/archived' },
      ],
    },
    {
      name: 'Calendar',
      href: '/calendar',
      icon: Calendar,
      badge: null,
      submenu: [],
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      badge: '5',
      submenu: [
        { name: 'Inbox', href: '/messages' },
        { name: 'Sent', href: '/messages/sent' },
        { name: 'Drafts', href: '/messages/drafts' },
      ],
    },
  ];

  // Secondary navigation items
  const secondaryNavigation = [
    { name: 'Documents', href: '/documents', icon: FileText, badge: null },
    { name: 'Database', href: '/database', icon: Database, badge: null },
    { name: 'Security', href: '/security', icon: Shield, badge: 'Alert' },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark, badge: null },
    { name: 'Archive', href: '/archive', icon: Archive, badge: null },
  ];

  // Bottom navigation items
  const bottomNavigation = [
    { name: 'Settings', href: '/user-settings', icon: Settings, badge: null },
    { name: 'Help & Support', href: '/help', icon: HelpCircle, badge: null },
    { name: 'Profile', href: '/profile', icon: User, badge: null },
  ];

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isDesktopView = window.innerWidth >= 1024;
      setIsDesktop(isDesktopView);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleCollapse = () => {
    toggleSidebarCollapsed();
    setActiveSubmenu(null);
  };

  const toggleSubmenu = (itemName: string) => {
    if (sidebarCollapsed) return;
    setActiveSubmenu(activeSubmenu === itemName ? null : itemName);
  };

  const isActive = (href: string) => location.pathname === href;

  // Render navigation item
  const renderNavItem = (item: any) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isSubmenuOpen = activeSubmenu === item.name;
    const itemIsActive = isActive(item.href);

    return (
      <div key={item.name}>
        <div className={`group relative flex items-center ${hasSubmenu ? 'cursor-pointer' : ''}`}>
          {hasSubmenu ? (
            <button
              onClick={() => toggleSubmenu(item.name)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                itemIsActive || isSubmenuOpen
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-secondary-600 dark:text-gray-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium ${
                        item.badge === 'New'
                          ? 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300'
                          : item.badge === 'Alert'
                            ? 'bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300'
                            : 'bg-secondary-200 dark:bg-gray-700 text-secondary-700 dark:text-gray-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 ml-2 transition-transform ${
                      isSubmenuOpen ? 'rotate-90' : ''
                    }`}
                  />
                </>
              )}
            </button>
          ) : (
            <Link
              to={item.href}
              onClick={() => !isDesktop && mobileToggle()}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                itemIsActive
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-secondary-600 dark:text-gray-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium ${
                        item.badge === 'New'
                          ? 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300'
                          : item.badge === 'Alert'
                            ? 'bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300'
                            : 'bg-secondary-200 dark:bg-gray-700 text-secondary-700 dark:text-gray-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )}

          {/* Tooltip for collapsed state */}
          {sidebarCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-secondary-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {item.name}
            </div>
          )}
        </div>

        {/* Submenu */}
        <AnimatePresence>
          {hasSubmenu && isSubmenuOpen && !sidebarCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-6 mt-1 space-y-1">
                {item.submenu.map((subItem: any) => (
                  <Link
                    key={subItem.name}
                    to={subItem.href}
                    onClick={() => !isDesktop && mobileToggle()}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(subItem.href)
                        ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium'
                        : 'text-secondary-600 dark:text-gray-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileIsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={mobileToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop ? 0 : (mobileIsOpen ? 0 : -280),
          width: sidebarCollapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed inset-y-0 left-0 z-50 lg:sticky lg:top-0 lg:h-screen bg-white dark:bg-gray-800 border-r border-secondary-200 dark:border-gray-700 shadow-lg lg:translate-x-0 ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        } w-64 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-secondary-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900 dark:text-white">Blueprint</span>
            </Link>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={handleToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-secondary-600 dark:text-gray-300" />
            ) : (
              <ChevronDown className="w-4 h-4 text-secondary-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 min-h-0">
          <div className="px-3 space-y-2 pb-4">
            {/* Main navigation */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-secondary-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Main
                </h3>
              )}
              {mainNavigation.map(item => renderNavItem(item))}
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-secondary-200 dark:border-gray-700"></div>

            {/* Secondary navigation */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-secondary-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Tools
                </h3>
              )}
              {secondaryNavigation.map(item => renderNavItem(item))}
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="border-t border-secondary-200 dark:border-gray-700 p-3 space-y-1">
          {bottomNavigation.map(item => renderNavItem(item))}
        </div>

        {/* Status indicator */}
        {!sidebarCollapsed && (
          <div className="px-3 py-2 border-t border-secondary-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-xs text-secondary-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span>System Online</span>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
};

export default Sidebar;
