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
  onTabClose
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id || '');
  const [tabList, setTabList] = useState(tabs);

  const handleTabClick = (tabId: string) => {
    const tab = tabList.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    }
  };

  const handleTabClose = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newTabs = tabList.filter(tab => tab.id !== tabId);
    setTabList(newTabs);
    
    if (activeTab === tabId && newTabs.length > 0) {
      const newActiveTab = newTabs[0].id;
      setActiveTab(newActiveTab);
      onTabChange?.(newActiveTab);
    }
    
    onTabClose?.(tabId);
  };

  const getTabButtonClasses = (tab: Tab) => {
    const baseClasses = 'relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none';
    const isActive = activeTab === tab.id;
    const isDisabled = tab.disabled;

    const variantClasses = {
      default: `
        border-b-2 rounded-t-md
        ${isActive 
          ? 'border-blue-500 text-blue-600 bg-blue-50' 
          : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `,
      pills: `
        rounded-full
        ${isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `,
      underline: `
        border-b-2 pb-2
        ${isActive 
          ? 'border-blue-500 text-blue-600' 
          : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `,
      cards: `
        rounded-lg border
        ${isActive 
          ? 'bg-white border-blue-500 text-blue-600 shadow-md' 
          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `
    };

    return `${baseClasses} ${variantClasses[variant]}`;
  };

  const getTabListClasses = () => {
    const baseClasses = orientation === 'horizontal' ? 'flex' : 'flex flex-col space-y-1';
    
    const variantClasses = {
      default: orientation === 'horizontal' ? 'border-b border-gray-200' : '',
      pills: orientation === 'horizontal' ? 'space-x-2' : '',
      underline: orientation === 'horizontal' ? 'space-x-8' : '',
      cards: orientation === 'horizontal' ? 'space-x-2 p-2 bg-gray-100 rounded-lg' : 'space-y-2 p-2 bg-gray-100 rounded-lg'
    };

    return `${baseClasses} ${variantClasses[variant]}`;
  };

  const activeTabContent = tabList.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={`tab-navigation ${className}`}>
      <div className={orientation === 'horizontal' ? 'flex flex-col' : 'flex'}>
        {/* Tab List */}
        <div className={`${getTabListClasses()} ${orientation === 'vertical' ? 'w-64 mr-6' : ''}`}>
          {tabList.map((tab) => (
            <button
              key={tab.id}
              className={getTabButtonClasses(tab)}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.icon && (
                <span className="w-4 h-4">{tab.icon}</span>
              )}
              
              <span>{tab.label}</span>
              
              {tab.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {tab.badge}
                </span>
              )}
              
              {tab.closable && (
                <button
                  className="ml-2 p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                  onClick={(e) => handleTabClose(tab.id, e)}
                  aria-label={`Close ${tab.label} tab`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={`tab-content ${orientation === 'vertical' ? 'flex-1' : 'mt-4'}`}>
          {activeTabContent && (
            <div className="fade-in">
              {activeTabContent}
            </div>
          )}
        </div>
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
          <p className="text-gray-600">Welcome to your dashboard! Here you can see an overview of your data.</p>
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
      )
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
      )
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
      )
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
              <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" defaultValue="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" defaultValue="john@example.com" />
            </div>
          </div>
        </div>
      )
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
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Horizontal Tabs (Default)</h3>
        <TabNavigation
          tabs={mockTabs}
          defaultActiveTab="dashboard"
          onTabChange={(tabId) => console.log('Tab changed to:', tabId)}
          onTabClose={(tabId) => console.log('Tab closed:', tabId)}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Pills Variant</h3>
        <TabNavigation
          tabs={mockTabs.slice(0, 3)}
          variant="pills"
          defaultActiveTab="dashboard"
        />
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