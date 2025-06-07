import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  HelpCircle,
  Shield,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavItem[];
}

export interface UserData {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface NavBarProps {
  logo?: React.ReactNode;
  logoText?: string;
  items?: NavItem[];
  user?: UserData;
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
  notificationCount?: number;
  className?: string;
  variant?: 'light' | 'dark' | 'glass';
  sticky?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({
  logo,
  logoText = 'Blueprint',
  items = [],
  user,
  onSearch,
  onNotificationClick,
  notificationCount = 0,
  className = '',
  variant = 'light',
  sticky = true,
  showSearch = true,
  showNotifications = true,
  showUserMenu = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock user data if none provided
  const defaultUser: UserData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Administrator',
  };

  const currentUser = user || defaultUser;

  // Mock navigation items if none provided
  const defaultItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { id: 'analytics', label: 'Analytics', href: '/analytics', badge: 'New' },
    {
      id: 'projects',
      label: 'Projects',
      href: '/projects',
      children: [
        { id: 'active', label: 'Active Projects', href: '/projects/active' },
        { id: 'archived', label: 'Archived', href: '/projects/archived' },
        { id: 'templates', label: 'Templates', href: '/projects/templates' },
      ],
    },
    { id: 'team', label: 'Team', href: '/team' },
    { id: 'settings', label: 'Settings', href: '/settings' },
  ];

  const navItems = items.length > 0 ? items : defaultItems;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  // Handle dropdown toggle
  const toggleDropdown = (itemId: string) => {
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(itemId)) {
      newOpenDropdowns.delete(itemId);
    } else {
      newOpenDropdowns.add(itemId);
    }
    setOpenDropdowns(newOpenDropdowns);
  };

  // Variant styles
  const variants = {
    light: 'bg-white border-b border-gray-200 text-gray-900',
    dark: 'bg-gray-900 border-b border-gray-700 text-white',
    glass: 'bg-white/10 backdrop-blur-md border-b border-white/20 text-white',
  };

  const linkVariants = {
    light: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    dark: 'text-gray-300 hover:text-white hover:bg-gray-800',
    glass: 'text-white/80 hover:text-white hover:bg-white/10',
  };

  const buttonVariants = {
    light: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    dark: 'text-gray-300 hover:text-white hover:bg-gray-800',
    glass: 'text-white/80 hover:text-white hover:bg-white/10',
  };

  return (
    <nav className={`${variants[variant]} ${sticky ? 'sticky top-0 z-50' : ''} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 flex items-center space-x-2">
              {logo || (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
              )}
              <span className="font-bold text-xl">{logoText}</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map(item => (
                  <div key={item.id} className="relative">
                    {item.children ? (
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(item.id)}
                          className={`${linkVariants[variant]} px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors duration-200`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${openDropdowns.has(item.id) ? 'rotate-180' : ''}`}
                          />
                          {item.badge && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </button>

                        {openDropdowns.has(item.id) && (
                          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1">
                              {item.children.map(child => (
                                <a
                                  key={child.id}
                                  href={child.href}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                >
                                  {child.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        className={`${linkVariants[variant]} px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200`}
                      >
                        {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            {showSearch && (
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      variant === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : ''
                    }`}
                  />
                </div>
              </form>
            )}

            {/* Notifications */}
            {showNotifications && (
              <button
                onClick={onNotificationClick}
                className={`${buttonVariants[variant]} p-2 rounded-md relative transition-colors duration-200`}
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </button>
            )}

            {/* User Menu */}
            {showUserMenu && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`${buttonVariants[variant]} flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <span className="hidden lg:block">{currentUser.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                        {currentUser.role && (
                          <p className="text-xs text-blue-600 mt-1">{currentUser.role}</p>
                        )}
                      </div>
                      <a
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </a>
                      <a
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </a>
                      <a
                        href="/help"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <HelpCircle className="h-4 w-4 mr-3" />
                        Help & Support
                      </a>
                      <a
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Shield className="h-4 w-4 mr-3" />
                        Admin Panel
                      </a>
                      <div className="border-t border-gray-100">
                        <button className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`${buttonVariants[variant]} p-2 rounded-md transition-colors duration-200`}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {/* Mobile search */}
              {showSearch && (
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </form>
              )}

              {/* Mobile navigation items */}
              {navItems.map(item => (
                <div key={item.id}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className={`${linkVariants[variant]} w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between transition-colors duration-200`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${openDropdowns.has(item.id) ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {openDropdowns.has(item.id) && (
                        <div className="ml-4 space-y-1">
                          {item.children.map(child => (
                            <a
                              key={child.id}
                              href={child.href}
                              className={`${linkVariants[variant]} block px-3 py-2 rounded-md text-sm transition-colors duration-200`}
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className={`${linkVariants[variant]} block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                    >
                      {item.label}
                      {item.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
