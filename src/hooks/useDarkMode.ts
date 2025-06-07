import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

const STORAGE_KEY = 'darkMode';

export const useDarkMode = () => {
  const { isDarkMode, toggleDarkMode } = useAppStore();

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const savedMode = localStorage.getItem(STORAGE_KEY);
      if (!savedMode) {
        if (e.matches && !isDarkMode) {
          toggleDarkMode();
        } else if (!e.matches && isDarkMode) {
          toggleDarkMode();
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isDarkMode, toggleDarkMode]);

  useEffect(() => {
    // Apply dark mode to document root
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Save preference to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isDarkMode));

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? 'var(--background)' : 'var(--background)');
    }
  }, [isDarkMode]);

  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode: (enabled: boolean) => {
      if (enabled !== isDarkMode) {
        toggleDarkMode();
      }
    },
  };
};
