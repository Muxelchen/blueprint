import React, { useState } from 'react';
import { Check, Palette, Monitor, Moon, Sun } from 'lucide-react';

export interface ThemeOption {
  id: string;
  name: string;
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  preview?: {
    surface: string;
    accent: string;
  };
}

export interface ThemeSelectorProps {
  selectedTheme?: string;
  onThemeChange?: (themeId: string) => void;
  onModeChange?: (mode: 'light' | 'dark' | 'auto') => void;
  showModeToggle?: boolean;
  showColorPicker?: boolean;
  compact?: boolean;
  className?: string;
}

const defaultThemes: ThemeOption[] = [
  {
    id: 'blue-light',
    name: 'Blue',
    mode: 'light',
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    preview: { surface: '#f8fafc', accent: '#e0e7ff' },
  },
  {
    id: 'blue-dark',
    name: 'Blue Dark',
    mode: 'dark',
    primaryColor: '#60a5fa',
    backgroundColor: '#111827',
    textColor: '#f9fafb',
    preview: { surface: '#1f2937', accent: '#1e3a8a' },
  },
  {
    id: 'green-light',
    name: 'Green',
    mode: 'light',
    primaryColor: '#10b981',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    preview: { surface: '#f0fdf4', accent: '#dcfce7' },
  },
  {
    id: 'green-dark',
    name: 'Green Dark',
    mode: 'dark',
    primaryColor: '#34d399',
    backgroundColor: '#111827',
    textColor: '#f9fafb',
    preview: { surface: '#1f2937', accent: '#064e3b' },
  },
  {
    id: 'purple-light',
    name: 'Purple',
    mode: 'light',
    primaryColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    preview: { surface: '#faf5ff', accent: '#ede9fe' },
  },
  {
    id: 'purple-dark',
    name: 'Purple Dark',
    mode: 'dark',
    primaryColor: '#a78bfa',
    backgroundColor: '#111827',
    textColor: '#f9fafb',
    preview: { surface: '#1f2937', accent: '#581c87' },
  },
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme = 'blue-light',
  onThemeChange,
  onModeChange,
  showModeToggle = true,
  showColorPicker = false,
  compact = false,
  className = '',
}) => {
  const [currentMode, setCurrentMode] = useState<'light' | 'dark' | 'auto'>('auto');
  const [customColor, setCustomColor] = useState('#3b82f6');

  const handleThemeSelect = (themeId: string) => {
    onThemeChange?.(themeId);
  };

  const handleModeChange = (mode: 'light' | 'dark' | 'auto') => {
    setCurrentMode(mode);
    onModeChange?.(mode);
  };

  const getModeIcon = (mode: 'light' | 'dark' | 'auto') => {
    switch (mode) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'auto':
        return <Monitor className="w-4 h-4" />;
    }
  };

  const ThemePreview: React.FC<{ theme: ThemeOption; isSelected: boolean }> = ({ 
    theme, 
    isSelected 
  }) => (
    <button
      onClick={() => handleThemeSelect(theme.id)}
      className={`
        relative group w-full p-3 rounded-lg border-2 transition-all duration-200
        ${isSelected 
          ? 'border-accent ring-2 ring-accent-light dark:ring-accent-dark' 
          : 'border-border hover:border-border-secondary dark:hover:border-border-secondary'
        }
      `}
    >
      {/* Theme preview */}
      <div 
        className="w-full h-16 rounded-md mb-2 relative overflow-hidden bg-surface"
      >
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-20 bg-surface-secondary"
        />
        
        {/* Content preview */}
        <div className="absolute inset-2 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div 
              className="w-2 h-2 rounded-full bg-accent"
            />
            <div 
              className="w-8 h-1 rounded bg-text-primary opacity-30"
            />
          </div>
          <div 
            className="w-4 h-4 rounded bg-accent"
          />
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-1 right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-text-on-primary" />
          </div>
        )}
      </div>

      {/* Theme name */}
      <div className="text-sm font-medium text-text-primary">
        {theme.name}
      </div>
      <div className="text-xs text-text-secondary capitalize">
        {theme.mode} mode
      </div>
    </button>
  );

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          {defaultThemes.slice(0, 3).map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              className={`
                w-6 h-6 rounded-full border-2 transition-all duration-200
                ${selectedTheme === theme.id 
                  ? 'border-white shadow-lg scale-110' 
                  : 'border-gray-300 hover:scale-105'
                }
              `}
              style={{ backgroundColor: theme.primaryColor }}
              title={theme.name}
            />
          ))}
        </div>
        
        {showModeToggle && (
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['light', 'auto', 'dark'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`
                  p-1 rounded transition-colors duration-200
                  ${currentMode === mode 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                `}
                title={`${mode} mode`}
              >
                {getModeIcon(mode)}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showModeToggle && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Display Mode
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'auto', 'dark'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`
                  flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200
                  ${currentMode === mode 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {getModeIcon(mode)}
                <span className="text-sm capitalize">{mode}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Color Theme
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {defaultThemes.map((theme) => (
            <ThemePreview
              key={theme.id}
              theme={theme}
              isSelected={selectedTheme === theme.id}
            />
          ))}
        </div>
      </div>

      {showColorPicker && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Custom Color
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <button
              onClick={() => {
                // Generate custom theme based on color
                const customTheme = `custom-${customColor.slice(1)}`;
                handleThemeSelect(customTheme);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Palette className="w-4 h-4" />
              Apply Custom
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector; 