import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Home, 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  Shield, 
  Bell,
  Search,
  Menu,
  X,
  Star,
  Clock,
  Bookmark,
  ExternalLink
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavigationItem[];
  isActive?: boolean;
  isNew?: boolean;
  isFavorite?: boolean;
  description?: string;
  shortcut?: string;
  external?: boolean;
}

export interface NavigationSystemProps {
  items?: NavigationItem[];
  currentPath?: string;
  showBreadcrumbs?: boolean;
  showSearch?: boolean;
  showFavorites?: boolean;
  showRecent?: boolean;
  variant?: 'sidebar' | 'horizontal' | 'mega' | 'mobile';
  size?: 'sm' | 'md' | 'lg';
  collapsible?: boolean;
  searchPlaceholder?: string;
  onNavigate?: (item: NavigationItem) => void;
  onToggleFavorite?: (item: NavigationItem) => void;
  onSearch?: (query: string) => void;
  className?: string;
  maxRecent?: number;
}

export interface NavigationState {
  expandedItems: Set<string>;
  searchQuery: string;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  recentItems: NavigationItem[];
  favoriteItems: NavigationItem[];
}

// Sample navigation data
const defaultNavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
    isActive: true,
    description: 'Main dashboard overview'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    badge: 'New',
    isNew: true,
    description: 'Data analytics and insights',
    children: [
      {
        id: 'reports',
        label: 'Reports',
        href: '/analytics/reports',
        description: 'Generate and view reports'
      },
      {
        id: 'metrics',
        label: 'Metrics',
        href: '/analytics/metrics',
        badge: 5,
        description: 'Key performance metrics'
      },
      {
        id: 'charts',
        label: 'Charts & Graphs',
        href: '/analytics/charts',
        description: 'Visual data representations'
      }
    ]
  },
  {
    id: 'users',
    label: 'User Management',
    href: '/users',
    icon: <Users className="w-5 h-5" />,
    badge: 12,
    description: 'Manage users and permissions',
    children: [
      {
        id: 'all-users',
        label: 'All Users',
        href: '/users/all',
        description: 'View all users'
      },
      {
        id: 'roles',
        label: 'Roles & Permissions',
        href: '/users/roles',
        icon: <Shield className="w-4 h-4" />,
        description: 'Manage user roles'
      },
      {
        id: 'invitations',
        label: 'Invitations',
        href: '/users/invitations',
        badge: 3,
        description: 'Pending user invitations'
      }
    ]
  },
  {
    id: 'content',
    label: 'Content',
    href: '/content',
    icon: <FileText className="w-5 h-5" />,
    description: 'Manage content and documents',
    children: [
      {
        id: 'documents',
        label: 'Documents',
        href: '/content/documents',
        description: 'Document library'
      },
      {
        id: 'media',
        label: 'Media Library',
        href: '/content/media',
        description: 'Images, videos, and files'
      }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/notifications',
    icon: <Bell className="w-5 h-5" />,
    badge: 8,
    description: 'System notifications'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
    description: 'Application settings',
    children: [
      {
        id: 'general',
        label: 'General',
        href: '/settings/general',
        description: 'General application settings'
      },
      {
        id: 'security',
        label: 'Security',
        href: '/settings/security',
        icon: <Shield className="w-4 h-4" />,
        description: 'Security and privacy settings'
      },
      {
        id: 'integrations',
        label: 'Integrations',
        href: '/settings/integrations',
        description: 'Third-party integrations'
      }
    ]
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: 'https://help.example.com',
    external: true,
    description: 'Get help and support',
    shortcut: '?'
  }
];

const NavigationSystem: React.FC<NavigationSystemProps> = ({
  items = defaultNavigationItems,
  currentPath = '/dashboard',
  showBreadcrumbs = true,
  showSearch = true,
  showFavorites = true,
  showRecent = true,
  variant = 'sidebar',
  size = 'md',
  collapsible = true,
  searchPlaceholder = 'Search navigation...',
  onNavigate,
  onToggleFavorite,
  onSearch,
  className = '',
  maxRecent = 5
}) => {
  const [state, setState] = useState<NavigationState>({
    expandedItems: new Set(['analytics', 'users']),
    searchQuery: '',
    isCollapsed: false,
    isMobileOpen: false,
    recentItems: [
      { id: 'reports', label: 'Reports', href: '/analytics/reports' },
      { id: 'all-users', label: 'All Users', href: '/users/all' },
      { id: 'documents', label: 'Documents', href: '/content/documents' }
    ],
    favoriteItems: [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <Home className="w-4 h-4" /> },
      { id: 'metrics', label: 'Metrics', href: '/analytics/metrics', icon: <BarChart3 className="w-4 h-4" /> }
    ]
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Search shortcut (Ctrl/Cmd + K)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Help shortcut (?)
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const helpItem = items.find(item => item.shortcut === '?');
        if (helpItem) {
          handleNavigate(helpItem);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items]);

  const toggleExpanded = (itemId: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedItems);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      return { ...prev, expandedItems: newExpanded };
    });
  };

  const toggleCollapsed = () => {
    setState(prev => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  };

  const toggleMobileOpen = () => {
    setState(prev => ({ ...prev, isMobileOpen: !prev.isMobileOpen }));
  };

  const handleSearch = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
    onSearch?.(query);
  };

  const handleNavigate = (item: NavigationItem) => {
    // Add to recent items
    setState(prev => {
      const recentItems = [
        item,
        ...prev.recentItems.filter(i => i.id !== item.id)
      ].slice(0, maxRecent);
      
      return { 
        ...prev, 
        recentItems,
        isMobileOpen: false 
      };
    });

    onNavigate?.(item);
  };

  const handleToggleFavorite = (item: NavigationItem) => {
    setState(prev => {
      const isFavorite = prev.favoriteItems.some(f => f.id === item.id);
      const favoriteItems = isFavorite
        ? prev.favoriteItems.filter(f => f.id !== item.id)
        : [...prev.favoriteItems, item];
      
      return { ...prev, favoriteItems };
    });

    onToggleFavorite?.(item);
  };

  const filterItems = (items: NavigationItem[]): NavigationItem[] => {
    if (!state.searchQuery) return items;
    
    return items.filter(item => {
      const matchesSearch = item.label.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                           item.description?.toLowerCase().includes(state.searchQuery.toLowerCase());
      
      if (matchesSearch) return true;
      
      // Check children
      if (item.children) {
        return filterItems(item.children).length > 0;
      }
      
      return false;
    });
  };

  const generateBreadcrumbs = (): NavigationItem[] => {
    const pathParts = currentPath.split('/').filter(Boolean);
    const breadcrumbs: NavigationItem[] = [];
    
    // Helper function to find item by path
    const findItemByPath = (items: NavigationItem[], targetPath: string): NavigationItem | null => {
      for (const item of items) {
        if (item.href === targetPath) return item;
        if (item.children) {
          const found = findItemByPath(item.children, targetPath);
          if (found) return found;
        }
      }
      return null;
    };

    // Build breadcrumbs
    let currentBreadcrumbPath = '';
    for (const part of pathParts) {
      currentBreadcrumbPath += `/${part}`;
      const item = findItemByPath(items, currentBreadcrumbPath);
      if (item) {
        breadcrumbs.push(item);
      }
    }

    return breadcrumbs;
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isExpanded = state.expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isFavorite = state.favoriteItems.some(f => f.id === item.id);
    const isActive = item.href === currentPath;

    return (
      <div key={item.id} className="relative">
        <div
          className={`group flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer
            ${isActive 
              ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-500' 
              : 'text-gray-700 hover:bg-gray-100'
            }
            ${level > 0 ? 'ml-4' : ''}
            ${state.isCollapsed && level === 0 ? 'justify-center' : ''}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              handleNavigate(item);
            }
          }}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          <div className="flex items-center flex-1 min-w-0">
            {item.icon && (
              <div className={`flex-shrink-0 mr-3 ${state.isCollapsed && level === 0 ? 'mr-0' : ''}`}>
                {item.icon}
              </div>
            )}
            
            {(!state.isCollapsed || level > 0) && (
              <>
                <span className="flex-1 text-sm font-medium truncate">
                  {item.label}
                </span>
                
                {item.external && (
                  <ExternalLink className="w-3 h-3 ml-1 text-gray-400" />
                )}
                
                {item.badge && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium
                    ${typeof item.badge === 'number' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
                
                {item.isNew && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                    New
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {(!state.isCollapsed || level > 0) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(item);
                }}
                className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity
                  ${isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}
                `}
              >
                <Star className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
            
            {hasChildren && (!state.isCollapsed || level > 0) && (
              <div className="p-1">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tooltip for collapsed items */}
        {state.isCollapsed && level === 0 && (
          <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
            {item.label}
            {item.description && (
              <div className="text-xs text-gray-300 mt-1">{item.description}</div>
            )}
          </div>
        )}

        {/* Children */}
        {hasChildren && isExpanded && (!state.isCollapsed || level > 0) && (
          <div className="mt-1">
            {item.children?.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderQuickAccess = () => {
    if (state.isCollapsed) return null;

    return (
      <div className="mb-6 space-y-4">
        {/* Favorites */}
        {showFavorites && state.favoriteItems.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
              Favorites
            </h4>
            <div className="space-y-1">
              {state.favoriteItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleNavigate(item)}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                >
                  {item.icon && <div className="mr-3">{item.icon}</div>}
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent */}
        {showRecent && state.recentItems.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
              Recent
            </h4>
            <div className="space-y-1">
              {state.recentItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleNavigate(item)}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                >
                  <Clock className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBreadcrumbs = () => {
    if (!showBreadcrumbs) return null;

    const breadcrumbs = generateBreadcrumbs();
    if (breadcrumbs.length <= 1) return null;

    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <Home className="w-4 h-4" />
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={item.id}>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <button
              onClick={() => handleNavigate(item)}
              className={`hover:text-blue-600 transition-colors ${
                index === breadcrumbs.length - 1 ? 'font-medium text-gray-900' : ''
              }`}
            >
              {item.label}
            </button>
          </React.Fragment>
        ))}
      </nav>
    );
  };

  const sizeClasses = {
    sm: 'w-56',
    md: 'w-64',
    lg: 'w-72'
  };

  const filteredItems = filterItems(items);

  if (variant === 'mobile') {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileOpen}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {state.isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Overlay */}
        {state.isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMobileOpen}>
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <button
                  onClick={toggleMobileOpen}
                  className="p-1 text-gray-600 hover:text-gray-900 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {showSearch && (
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={state.searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {renderQuickAccess()}

              <div className="space-y-1">
                {filteredItems.map(item => renderNavigationItem(item))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      state.isCollapsed ? 'w-16' : sizeClasses[size]
    } ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!state.isCollapsed && (
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
            )}
            {collapsible && (
              <button
                onClick={toggleCollapsed}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        {showSearch && !state.isCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={state.searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                ⌘K
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderQuickAccess()}
          
          <div className="space-y-1">
            {filteredItems.map(item => renderNavigationItem(item))}
          </div>
        </div>

        {/* Footer */}
        {!state.isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">?</kbd> for help
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationSystem;