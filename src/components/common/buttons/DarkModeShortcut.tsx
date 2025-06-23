import React, { useState } from 'react';
import { Moon, Sun, Keyboard, X } from 'lucide-react';
import { useDarkModeShortcut } from '../../../hooks/useDarkModeShortcut';

interface DarkModeShortcutProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg';
  showKeyboardHint?: boolean;
  enableFloat?: boolean;
  className?: string;
  style?: 'modern' | 'minimal' | 'classic';
}

const DarkModeShortcut: React.FC<DarkModeShortcutProps> = ({
  position = 'bottom-right',
  size = 'md',
  showKeyboardHint = true,
  enableFloat = true,
  className = '',
  style = 'modern'
}) => {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { isDarkMode, toggleDarkMode, shortcutKeys } = useDarkModeShortcut();

  const getPositionClasses = () => {
    const base = enableFloat ? 'fixed z-50' : 'relative';
    switch (position) {
      case 'top-left':
        return `${base} top-4 left-4`;
      case 'top-right':
        return `${base} top-4 right-20`; // Moved left to avoid notifications
      case 'bottom-left':
        return `${base} bottom-4 left-4`;
      case 'bottom-right':
        return `${base} bottom-4 right-4`;
      default:
        return base;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-10 h-10 text-sm';
      case 'md':
        return 'w-12 h-12 text-base';
      case 'lg':
        return 'w-14 h-14 text-lg';
      default:
        return 'w-12 h-12 text-base';
    }
  };

  const getStyleClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-in-out transform active:scale-95';
    
    switch (style) {
      case 'modern':
        return `${baseClasses} rounded-full shadow-lg backdrop-blur-sm border hover:scale-110 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700 text-yellow-400 hover:bg-gray-700/90' 
            : 'bg-white/80 border-gray-200 text-blue-600 hover:bg-white/90'
        }`;
      case 'minimal':
        return `${baseClasses} rounded-lg hover:scale-105 ${
          isDarkMode 
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
            : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
        }`;
      case 'classic':
        return `${baseClasses} rounded-md shadow-md border hover:shadow-lg ${
          isDarkMode 
            ? 'bg-gray-900 border-gray-600 text-yellow-300 hover:bg-gray-800' 
            : 'bg-white border-gray-300 text-blue-700 hover:bg-gray-50'
        }`;
      default:
        return baseClasses;
    }
  };

  const formatShortcut = (shortcut: string) => {
    return shortcut
      .split('+')
      .map(key => {
        switch (key.toLowerCase()) {
          case 'ctrl':
            return 'Ctrl';
          case 'cmd':
          case 'meta':
            return '⌘';
          case 'shift':
            return '⇧';
          case 'alt':
            return '⌥';
          default:
            return key.toUpperCase();
        }
      })
      .join(' + ');
  };

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const primaryShortcut = isMac ? shortcutKeys.find(k => k.includes('cmd')) : shortcutKeys.find(k => k.includes('ctrl'));
  const displayShortcut = primaryShortcut || shortcutKeys[0];

  return (
    <div className={`${getPositionClasses()} ${className}`}>
      {/* Main Button */}
      <div className="relative group">
        <button
          onClick={toggleDarkMode}
          className={`
            ${getSizeClasses()} 
            ${getStyleClasses()}
            flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
          title={`Toggle dark mode (${formatShortcut(displayShortcut)})`}
          aria-label={`Toggle dark mode. Current mode: ${isDarkMode ? 'dark' : 'light'}`}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Keyboard Shortcut Hint */}
        {showKeyboardHint && (
          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className={`
              absolute whitespace-nowrap px-2 py-1 text-xs rounded shadow-lg border
              ${position.includes('right') ? 'right-0' : 'left-0'}
              ${position.includes('bottom') ? 'bottom-full mb-2' : 'top-full mt-2'}
              ${isDarkMode 
                ? 'bg-gray-800 text-gray-200 border-gray-600' 
                : 'bg-white text-gray-700 border-gray-200'
              }
            `}>
              <div className="flex items-center space-x-1">
                <Keyboard className="w-3 h-3" />
                <span>{formatShortcut(displayShortcut)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Info Button */}
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className={`
            absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs
            flex items-center justify-center opacity-0 group-hover:opacity-100
            transition-all duration-200 transform hover:scale-110
            ${isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }
          `}
          title="Show all shortcuts"
        >
          <Keyboard className="w-3 h-3" />
        </button>
      </div>

      {/* Shortcuts Panel */}
      {showShortcuts && (
        <div className={`
          absolute ${position.includes('right') ? 'right-0' : 'left-0'}
          ${position.includes('bottom') ? 'bottom-full mb-4' : 'top-full mt-4'}
          w-64 p-4 rounded-lg shadow-xl border backdrop-blur-sm
          ${isDarkMode 
            ? 'bg-gray-800/95 border-gray-600 text-gray-200' 
            : 'bg-white/95 border-gray-200 text-gray-700'
          }
        `}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">Dark Mode Shortcuts</h3>
            <button
              onClick={() => setShowShortcuts(false)}
              className={`
                p-1 rounded transition-colors
                ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              `}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {shortcutKeys.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-xs opacity-75">
                  {shortcut.includes('cmd') ? 'Mac' : 'Windows/Linux'}:
                </span>
                <code className={`
                  px-2 py-1 rounded text-xs font-mono
                  ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                `}>
                  {formatShortcut(shortcut)}
                </code>
              </div>
            ))}
          </div>
          
          <div className={`
            mt-3 pt-3 border-t text-xs opacity-75
            ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}
          `}>
            <p>Click the button or use keyboard shortcuts to toggle between light and dark modes.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DarkModeShortcut; 