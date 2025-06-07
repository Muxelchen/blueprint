import React, { useState } from 'react';
import { Home, User, Settings, BarChart3, FileText } from 'lucide-react';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
  closable?: boolean;
}

export interface TabNavigationProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline' | 'cards';
  className?: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  defaultActiveTab,
  orientation = 'horizontal',
  variant = 'default',
  className = '',
  onTabChange,
  onTabClose,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id || '');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    }
  };

  // Clean style functions without complex hover logic
  const getTabButtonStyles = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    const isActive = activeTab === tabId;
    const isHovered = hoveredTab === tabId;
    const isDisabled = tab?.disabled;

    // Base styles for all variants
    const baseStyles = {
      padding: '12px 16px',
      border: 'none',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      fontSize: '14px',
      fontWeight: '500' as const,
      opacity: isDisabled ? 0.5 : 1,
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      position: 'relative' as const,
      zIndex: 1,
      outline: 'none',
      fontFamily: 'Inter, system-ui, sans-serif',
      whiteSpace: 'nowrap' as const,
      userSelect: 'none' as const,
      textDecoration: 'none',
      lineHeight: '1.5',
      borderRadius: '6px',
    };

    // Different styles based on variant and state
    if (variant === 'underline') {
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: isActive ? '#2563eb' : isHovered && !isActive && !isDisabled ? '#374151' : '#64748b',
        borderBottom: isActive ? '3px solid #2563eb' : '3px solid transparent',
        borderRadius: '0',
        paddingBottom: '12px',
      };
    }

    if (variant === 'pills') {
      return {
        ...baseStyles,
        backgroundColor: isActive
          ? '#2563eb'
          : isHovered && !isActive && !isDisabled
            ? '#e2e8f0'
            : '#f8fafc',
        color: isActive ? 'white' : '#475569',
        borderRadius: '20px',
        padding: '10px 18px',
        boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
      };
    }

    if (variant === 'cards') {
      return {
        ...baseStyles,
        backgroundColor: isActive
          ? '#ffffff'
          : isHovered && !isActive && !isDisabled
            ? '#ffffff'
            : '#f8fafc',
        color: isActive ? '#2563eb' : '#475569',
        border: isActive ? '2px solid #2563eb' : '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
      };
    }

    // Default variant
    return {
      ...baseStyles,
      backgroundColor: isActive
        ? '#eff6ff'
        : isHovered && !isActive && !isDisabled
          ? '#f8fafc'
          : 'transparent',
      color: isActive ? '#2563eb' : isHovered && !isActive && !isDisabled ? '#374151' : '#6b7280',
      borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
      borderRadius: '6px 6px 0 0',
      paddingBottom: '10px',
    };
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* Tab List */}
      <div
        style={{
          display: 'flex',
          gap: variant === 'underline' ? '32px' : '8px',
          marginBottom: '20px',
          borderBottom:
            variant === 'underline' || variant === 'default' ? '1px solid #e5e7eb' : 'none',
          paddingBottom: '0px',
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            disabled={tab.disabled}
            style={getTabButtonStyles(tab.id)}
          >
            {tab.icon && (
              <span
                style={{
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  marginLeft: '4px',
                  minWidth: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ width: '100%', minHeight: '200px' }}>
        {activeTabContent && <div key={activeTab}>{activeTabContent}</div>}
      </div>
    </div>
  );
};

// Example usage with mock data
export const ExampleTabNavigation: React.FC = () => {
  const mockTabs: Tab[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home />,
      content: (
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p className="text-gray-600">
            Welcome to your dashboard! Here you can see an overview of your data.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Total Users</h3>
              <p className="text-2xl font-bold text-blue-600">1,234</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900">Revenue</h3>
              <p className="text-2xl font-bold text-green-600">$12,345</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900">Orders</h3>
              <p className="text-2xl font-bold text-purple-600">567</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 />,
      badge: '5',
      content: (
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <p className="text-gray-600">Deep dive into your analytics data.</p>
          <div className="mt-6">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText />,
      closable: true,
      content: (
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Reports</h2>
          <p className="text-gray-600">Generate and view your reports.</p>
          <div className="mt-6 space-y-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold">Monthly Sales Report</h3>
              <p className="text-sm text-gray-600">Generated on May 1, 2025</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold">User Activity Report</h3>
              <p className="text-sm text-gray-600">Generated on April 28, 2025</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User />,
      content: (
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
          <p className="text-gray-600">Manage your profile information.</p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                defaultValue="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                defaultValue="john@example.com"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings />,
      disabled: true,
      content: (
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
          <p className="text-gray-600">This tab is disabled for demonstration.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Horizontal Tabs (Default)</h3>
        <TabNavigation
          tabs={mockTabs}
          defaultActiveTab="dashboard"
          onTabChange={tabId => console.log('Tab changed to:', tabId)}
          onTabClose={tabId => console.log('Tab closed:', tabId)}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Pills Variant</h3>
        <TabNavigation tabs={mockTabs.slice(0, 3)} variant="pills" defaultActiveTab="dashboard" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Vertical Cards</h3>
        <TabNavigation
          tabs={mockTabs.slice(0, 4)}
          orientation="vertical"
          variant="cards"
          defaultActiveTab="dashboard"
        />
      </div>
    </div>
  );
};

export default TabNavigation;
