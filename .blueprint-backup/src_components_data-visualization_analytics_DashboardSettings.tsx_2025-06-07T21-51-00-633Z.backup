import React, { useState, useEffect } from 'react';
import Button from '../../common/buttons/Button';
import Modal from '../../common/overlays/Modal';
import TabNavigation from '../../common/display/TabNavigation';
import ThemeToggle from '../../common/inputs/ThemeToggle';
import LanguageSwitch from '../../common/inputs/LanguageSwitch';

interface DashboardLayout {
  id: string;
  name: string;
  description: string;
  columns: number;
  widgets: Array<{
    id: string;
    type: string;
    position: { x: number; y: number; w: number; h: number };
  }>;
  created: Date;
}

interface DashboardSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  autoRefresh: boolean;
  refreshInterval: number;
  notifications: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;
  defaultLayout: string;
  gridSize: number;
  snapToGrid: boolean;
}

interface DashboardSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DashboardSettings;
  onSettingsChange: (settings: DashboardSettings) => void;
  layouts: DashboardLayout[];
  onLayoutSave: (layout: DashboardLayout) => void;
  onLayoutLoad: (layoutId: string) => void;
  onLayoutDelete: (layoutId: string) => void;
}

const defaultSettings: DashboardSettings = {
  theme: 'auto',
  language: 'en',
  autoRefresh: true,
  refreshInterval: 30000,
  notifications: true,
  compactMode: false,
  animationsEnabled: true,
  defaultLayout: 'default',
  gridSize: 10,
  snapToGrid: true,
};

const DashboardSettings: React.FC<DashboardSettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  layouts,
  onLayoutSave,
  onLayoutLoad,
  onLayoutDelete,
}) => {
  const [localSettings, setLocalSettings] = useState<DashboardSettings>(settings);
  const [newLayoutName, setNewLayoutName] = useState('');
  const [newLayoutDescription, setNewLayoutDescription] = useState('');
  const [importData, setImportData] = useState('');
  const [exportFormat, setExportFormat] = useState<'json' | 'yaml'>('json');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSettingsChange(localSettings);
    localStorage.setItem('dashboardSettings', JSON.stringify(localSettings));
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(defaultSettings);
  };

  const handleSaveCurrentLayout = () => {
    if (!newLayoutName.trim()) return;

    const newLayout: DashboardLayout = {
      id: `layout_${Date.now()}`,
      name: newLayoutName,
      description: newLayoutDescription,
      columns: 12,
      widgets: [], // This would be populated with current widget positions
      created: new Date(),
    };

    onLayoutSave(newLayout);
    setNewLayoutName('');
    setNewLayoutDescription('');
  };

  const handleExportSettings = () => {
    const exportData = {
      settings: localSettings,
      layouts,
      timestamp: new Date().toISOString(),
      version: '1.0',
    };

    let content: string;
    let filename: string;

    if (exportFormat === 'json') {
      content = JSON.stringify(exportData, null, 2);
      filename = `dashboard-config-${new Date().toISOString().split('T')[0]}.json`;
    } else {
      // Simple YAML export
      content = `# Dashboard Configuration Export
# Exported on: ${new Date().toISOString()}

settings:
  theme: "${exportData.settings.theme}"
  language: "${exportData.settings.language}"
  autoRefresh: ${exportData.settings.autoRefresh}
  refreshInterval: ${exportData.settings.refreshInterval}
  notifications: ${exportData.settings.notifications}
  compactMode: ${exportData.settings.compactMode}
  animationsEnabled: ${exportData.settings.animationsEnabled}
  defaultLayout: "${exportData.settings.defaultLayout}"
  gridSize: ${exportData.settings.gridSize}
  snapToGrid: ${exportData.settings.snapToGrid}

layouts:
${exportData.layouts
  .map(
    layout => `  - id: "${layout.id}"
    name: "${layout.name}"
    description: "${layout.description}"
    columns: ${layout.columns}
    created: "${layout.created.toISOString()}"`
  )
  .join('\n')}
`;
      filename = `dashboard-config-${new Date().toISOString().split('T')[0]}.yaml`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = () => {
    try {
      const data = JSON.parse(importData);
      if (data.settings) {
        setLocalSettings({ ...defaultSettings, ...data.settings });
      }
      if (data.layouts && Array.isArray(data.layouts)) {
        data.layouts.forEach((layout: DashboardLayout) => {
          onLayoutSave(layout);
        });
      }
      setImportData('');
      alert('Settings imported successfully!');
    } catch (error) {
      alert('Invalid import data. Please check the format.');
    }
  };

  const tabs = [
    {
      id: 'general',
      label: 'General',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <ThemeToggle />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <LanguageSwitch />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto Refresh</label>
                <p className="text-xs text-gray-500">Automatically refresh dashboard data</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.autoRefresh}
                onChange={e =>
                  setLocalSettings(prev => ({ ...prev, autoRefresh: e.target.checked }))
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            {localSettings.autoRefresh && (
              <div>
                <label className="block text-sm font-medium mb-2">Refresh Interval (seconds)</label>
                <select
                  value={localSettings.refreshInterval / 1000}
                  onChange={e =>
                    setLocalSettings(prev => ({
                      ...prev,
                      refreshInterval: parseInt(e.target.value) * 1000,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                  <option value={600}>10 minutes</option>
                </select>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Notifications</label>
                <p className="text-xs text-gray-500">Enable browser notifications</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.notifications}
                onChange={e =>
                  setLocalSettings(prev => ({ ...prev, notifications: e.target.checked }))
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Compact Mode</label>
                <p className="text-xs text-gray-500">Reduce spacing and padding</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.compactMode}
                onChange={e =>
                  setLocalSettings(prev => ({ ...prev, compactMode: e.target.checked }))
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Animations</label>
                <p className="text-xs text-gray-500">Enable UI animations and transitions</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.animationsEnabled}
                onChange={e =>
                  setLocalSettings(prev => ({ ...prev, animationsEnabled: e.target.checked }))
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'layout',
      label: 'Layout',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Grid Size</label>
              <select
                value={localSettings.gridSize}
                onChange={e =>
                  setLocalSettings(prev => ({
                    ...prev,
                    gridSize: parseInt(e.target.value),
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5px</option>
                <option value={10}>10px</option>
                <option value={15}>15px</option>
                <option value={20}>20px</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="snapToGrid"
                checked={localSettings.snapToGrid}
                onChange={e =>
                  setLocalSettings(prev => ({ ...prev, snapToGrid: e.target.checked }))
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
              />
              <label htmlFor="snapToGrid" className="text-sm font-medium">
                Snap to Grid
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Saved Layouts</h3>
            <div className="space-y-3">
              {layouts.map(layout => (
                <div
                  key={layout.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{layout.name}</h4>
                    <p className="text-sm text-gray-500">{layout.description}</p>
                    <p className="text-xs text-gray-400">
                      Created: {layout.created.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onLayoutLoad(layout.id)}>
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onLayoutDelete(layout.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-3">Save Current Layout</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Layout name"
                  value={newLayoutName}
                  onChange={e => setNewLayoutName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newLayoutDescription}
                  onChange={e => setNewLayoutDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
                <Button
                  onClick={handleSaveCurrentLayout}
                  disabled={!newLayoutName.trim()}
                  className="w-full"
                >
                  Save Current Layout
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'import-export',
      label: 'Import/Export',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Export Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Export Format</label>
                <select
                  value={exportFormat}
                  onChange={e => setExportFormat(e.target.value as 'json' | 'yaml')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="json">JSON</option>
                  <option value="yaml">YAML</option>
                </select>
              </div>
              <Button onClick={handleExportSettings} className="w-full">
                Export Settings & Layouts
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Import Configuration</h3>
            <div className="space-y-3">
              <textarea
                placeholder="Paste your configuration data here (JSON format)"
                value={importData}
                onChange={e => setImportData(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={6}
              />
              <Button
                onClick={handleImportSettings}
                disabled={!importData.trim()}
                className="w-full"
              >
                Import Settings & Layouts
              </Button>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ Import Warning</h4>
            <p className="text-sm text-yellow-700">
              Importing will overwrite your current settings and may add new layouts. Consider
              exporting your current configuration first as a backup.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dashboard Settings" size="xl">
      <div className="space-y-6">
        <TabNavigation tabs={tabs} />

        <div className="flex justify-between pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DashboardSettings;
