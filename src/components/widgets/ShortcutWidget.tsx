import React, { useState, useCallback } from 'react';
import { Keyboard, Settings, Moon, Sun, Zap, RotateCcw, Check, Copy } from 'lucide-react';
import { useDarkModeShortcut } from '../../hooks/useDarkModeShortcut';

interface ShortcutWidgetProps {
  title?: string;
  height?: string;
  enableCustomShortcuts?: boolean;
  showConfiguration?: boolean;
  compact?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

interface CustomShortcut {
  id: string;
  name: string;
  description: string;
  keys: string;
  action: () => void;
  category: 'system' | 'navigation' | 'editing' | 'custom';
  enabled: boolean;
}

const ShortcutWidget: React.FC<ShortcutWidgetProps> = ({
  title = 'Keyboard Shortcuts',
  height = '400px',
  enableCustomShortcuts = true,
  showConfiguration = true,
  compact = false,
  theme = 'auto',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'config'>('shortcuts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'system' | 'navigation' | 'editing' | 'custom'>('all');
  const [customShortcuts, setCustomShortcuts] = useState<CustomShortcut[]>([]);
  const [showNotification, setShowNotification] = useState(true);

  const { isDarkMode, toggleDarkMode: darkModeToggle, shortcutKeys } = useDarkModeShortcut({
    showNotification,
    onToggle: (isDark) => {
      console.log(`Dark mode ${isDark ? 'enabled' : 'disabled'}`);
    }
  });

  // Built-in shortcuts
  const builtInShortcuts: CustomShortcut[] = [
    {
      id: 'dark-mode',
      name: 'Toggle Dark Mode',
      description: 'Switch between light and dark themes',
      keys: shortcutKeys[0] || 'Ctrl+Shift+D',
      action: darkModeToggle,
      category: 'system',
      enabled: true,
    },
    {
      id: 'search',
      name: 'Global Search',
      description: 'Open global search dialog',
      keys: 'Ctrl+K',
      action: () => console.log('Opening search...'),
      category: 'navigation',
      enabled: true,
    },
    {
      id: 'help',
      name: 'Show Help',
      description: 'Display help and shortcuts',
      keys: 'F1',
      action: () => console.log('Showing help...'),
      category: 'system',
      enabled: true,
    },
    {
      id: 'save',
      name: 'Save',
      description: 'Save current document or settings',
      keys: 'Ctrl+S',
      action: () => console.log('Saving...'),
      category: 'editing',
      enabled: true,
    },
    {
      id: 'refresh',
      name: 'Refresh',
      description: 'Refresh current page or data',
      keys: 'F5',
      action: () => window.location.reload(),
      category: 'navigation',
      enabled: true,
    },
  ];

  const allShortcuts = [...builtInShortcuts, ...customShortcuts];

  const filteredShortcuts = allShortcuts.filter(shortcut => {
    const matchesSearch = shortcut.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shortcut.keys.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || shortcut.category === selectedCategory;
    return matchesSearch && matchesCategory && shortcut.enabled;
  });

  const formatShortcut = (keys: string) => {
    return keys.split('+').map(key => {
      switch (key.toLowerCase()) {
        case 'ctrl': return 'Ctrl';
        case 'cmd': return '⌘';
        case 'shift': return '⇧';
        case 'alt': return '⌥';
        case 'meta': return '⌘';
        default: return key.charAt(0).toUpperCase() + key.slice(1);
      }
    }).join(' + ');
  };

  const copyShortcutToClipboard = useCallback((shortcut: CustomShortcut) => {
    navigator.clipboard.writeText(`${shortcut.name}: ${shortcut.keys}`);
    console.log(`Copied: ${shortcut.name} - ${shortcut.keys}`);
  }, []);

  const testShortcut = useCallback((shortcut: CustomShortcut) => {
    try {
      shortcut.action();
      console.log(`Executed shortcut: ${shortcut.name}`);
    } catch (error) {
      console.error(`Failed to execute shortcut: ${shortcut.name}`, error);
    }
  }, []);

  const addCustomShortcut = useCallback(() => {
    const newShortcut: CustomShortcut = {
      id: `custom-${Date.now()}`,
      name: 'New Shortcut',
      description: 'Custom shortcut description',
      keys: 'Ctrl+Alt+N',
      action: () => console.log('Custom shortcut executed'),
      category: 'custom',
      enabled: true,
    };
    setCustomShortcuts(prev => [...prev, newShortcut]);
  }, []);

  const currentTheme = {
    background: isDarkMode ? 'bg-gray-800' : 'bg-white',
    surface: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    accent: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    accentBg: isDarkMode ? 'bg-blue-900' : 'bg-blue-100',
  };

  const containerClass = `
    ${currentTheme.background} ${currentTheme.text} ${currentTheme.border}
    border rounded-lg shadow-sm transition-colors duration-200 ${className}
  `;

  if (compact) {
    return (
      <div className={containerClass} style={{ height }}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center space-x-2">
              <Keyboard className="w-5 h-5" />
              <span>Quick Shortcuts</span>
            </h3>
          </div>
          
          <div className="space-y-2">
            {filteredShortcuts.slice(0, 3).map((shortcut) => (
              <div key={shortcut.id} className={`flex items-center justify-between p-2 rounded ${currentTheme.surface}`}>
                <div className="flex-1">
                  <div className="font-medium text-sm">{shortcut.name}</div>
                </div>
                <code className={`px-2 py-1 rounded text-xs font-mono ${currentTheme.accentBg} ${currentTheme.accent}`}>
                  {formatShortcut(shortcut.keys)}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass} style={{ height }}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${currentTheme.border}`}>
          <div className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5" />
            <h3 className="font-semibold">{title}</h3>
          </div>
          
          {showConfiguration && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('shortcuts')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  activeTab === 'shortcuts' 
                    ? `${currentTheme.accentBg} ${currentTheme.accent}` 
                    : `${currentTheme.surface} ${currentTheme.textSecondary}`
                }`}
              >
                Shortcuts
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  activeTab === 'config' 
                    ? `${currentTheme.accentBg} ${currentTheme.accent}` 
                    : `${currentTheme.surface} ${currentTheme.textSecondary}`
                }`}
              >
                Config
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'shortcuts' ? (
            <div className="p-4 h-full flex flex-col">
              {/* Search and Filters */}
              <div className="mb-4 space-y-3">
                <input
                  type="text"
                  placeholder="Search shortcuts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-3 py-2 rounded border ${currentTheme.border} ${currentTheme.surface} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className={`px-3 py-1 text-sm rounded border ${currentTheme.border} ${currentTheme.surface} ${currentTheme.text}`}
                  >
                    <option value="all">All Categories</option>
                    <option value="system">System</option>
                    <option value="navigation">Navigation</option>
                    <option value="editing">Editing</option>
                    <option value="custom">Custom</option>
                  </select>
                  
                  {enableCustomShortcuts && (
                    <button
                      onClick={addCustomShortcut}
                      className={`px-3 py-1 text-sm rounded ${currentTheme.accentBg} ${currentTheme.accent} hover:opacity-80 transition-opacity`}
                    >
                      Add Custom
                    </button>
                  )}
                </div>
              </div>

              {/* Shortcuts List */}
              <div className="flex-1 overflow-y-auto space-y-2">
                {filteredShortcuts.map((shortcut) => (
                  <div key={shortcut.id} className={`p-3 rounded border ${currentTheme.border} ${currentTheme.surface} hover:shadow-sm transition-shadow`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{shortcut.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded ${currentTheme.accentBg} ${currentTheme.accent}`}>
                            {shortcut.category}
                          </span>
                        </div>
                        <p className={`text-sm ${currentTheme.textSecondary}`}>{shortcut.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <code className={`px-2 py-1 rounded text-sm font-mono ${currentTheme.accentBg} ${currentTheme.accent}`}>
                          {formatShortcut(shortcut.keys)}
                        </code>
                        <button
                          onClick={() => copyShortcutToClipboard(shortcut)}
                          className={`p-1 rounded ${currentTheme.textSecondary} hover:${currentTheme.text} transition-colors`}
                          title="Copy shortcut"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => testShortcut(shortcut)}
                          className={`p-1 rounded ${currentTheme.textSecondary} hover:${currentTheme.text} transition-colors`}
                          title="Test shortcut"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <h4 className="font-medium mb-4">Configuration</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Show Notifications</h5>
                    <p className={`text-sm ${currentTheme.textSecondary}`}>Display notifications when shortcuts are triggered</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showNotification}
                      onChange={(e) => setShowNotification(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">Reset All Shortcuts</h5>
                  <button
                    onClick={() => setCustomShortcuts([])}
                    className={`flex items-center space-x-2 px-3 py-2 rounded border ${currentTheme.border} ${currentTheme.textSecondary} hover:${currentTheme.text} transition-colors`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Default</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-3 border-t ${currentTheme.border} ${currentTheme.surface}`}>
          <div className="flex items-center justify-between text-sm">
            <span className={currentTheme.textSecondary}>
              {filteredShortcuts.length} shortcuts available
            </span>
            <div className="flex items-center space-x-2">
              <span className={currentTheme.textSecondary}>Dark Mode:</span>
              <button
                onClick={darkModeToggle}
                className={`p-1 rounded transition-colors ${currentTheme.textSecondary} hover:${currentTheme.text}`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortcutWidget;