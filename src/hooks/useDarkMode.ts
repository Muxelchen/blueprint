import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export const useDarkMode = () => {
  const { isDarkMode, toggleDarkMode } = useAppStore();

  useEffect(() => {
    // Load dark mode preference from localStorage on mount
    const savedMode = localStorage.getItem('blueprint-dark-mode');
    if (savedMode) {
      const isDark = JSON.parse(savedMode);
      if (isDark !== isDarkMode) {
        toggleDarkMode();
      }
    }
  }, []);

  useEffect(() => {
    // Apply dark mode to document root
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    // Save preference to localStorage
    localStorage.setItem('blueprint-dark-mode', JSON.stringify(isDarkMode));

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#1f2937' : '#ffffff');
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
