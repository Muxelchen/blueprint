import { useEffect, useCallback } from 'react';
import { useDarkMode } from './useDarkMode';

interface DarkModeShortcutOptions {
  enableKeyboardShortcut?: boolean;
  shortcutKeys?: string[];
  onToggle?: (isDarkMode: boolean) => void;
  showNotification?: boolean;
}

export const useDarkModeShortcut = (options: DarkModeShortcutOptions = {}) => {
  const {
    enableKeyboardShortcut = true,
    shortcutKeys = ['ctrl+shift+d', 'cmd+shift+d'],
    onToggle,
    showNotification = true
  } = options;

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleToggle = useCallback(() => {
    toggleDarkMode();
    onToggle?.(!isDarkMode);
    
    if (showNotification) {
      // Create a simple toast notification
      const toast = document.createElement('div');
      toast.className = `
        fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg border transition-all duration-300
        ${isDarkMode 
          ? 'bg-white text-gray-900 border-gray-200' 
          : 'bg-gray-900 text-white border-gray-700'
        }
      `;
      toast.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>${isDarkMode ? '☀️' : '🌙'}</span>
          <span>${isDarkMode ? 'Light' : 'Dark'} mode enabled</span>
        </div>
      `;
      
      document.body.appendChild(toast);
      
      // Auto remove after 2 seconds
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }, 2000);
    }
  }, [isDarkMode, toggleDarkMode, onToggle, showNotification]);

  const isKeyMatch = useCallback((event: KeyboardEvent, shortcut: string) => {
    const keys = shortcut.toLowerCase().split('+');
    const modifiers = keys.filter(key => ['ctrl', 'cmd', 'shift', 'alt', 'meta'].includes(key));
    const mainKey = keys.find(key => !['ctrl', 'cmd', 'shift', 'alt', 'meta'].includes(key));

    if (!mainKey) return false;

    const requiredModifiers = {
      ctrl: modifiers.includes('ctrl'),
      cmd: modifiers.includes('cmd') || modifiers.includes('meta'),
      shift: modifiers.includes('shift'),
      alt: modifiers.includes('alt'),
    };

    const currentModifiers = {
      ctrl: event.ctrlKey,
      cmd: event.metaKey,
      shift: event.shiftKey,
      alt: event.altKey,
    };

    // Check main key
    if (event.key.toLowerCase() !== mainKey) return false;

    // Check modifiers
    return (
      currentModifiers.ctrl === requiredModifiers.ctrl &&
      currentModifiers.cmd === requiredModifiers.cmd &&
      currentModifiers.shift === requiredModifiers.shift &&
      currentModifiers.alt === requiredModifiers.alt
    );
  }, []);

  useEffect(() => {
    if (!enableKeyboardShortcut) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return;
      }

      // Check if any of the shortcut combinations match
      const isMatch = shortcutKeys.some(shortcut => isKeyMatch(event, shortcut));
      
      if (isMatch) {
        event.preventDefault();
        event.stopPropagation();
        handleToggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcut, shortcutKeys, isKeyMatch, handleToggle]);

  return {
    isDarkMode,
    toggleDarkMode: handleToggle,
    shortcutKeys,
    enableKeyboardShortcut,
  };
}; 