import React, { useCallback, useEffect, useState, createContext, useContext } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ThemeColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';

export interface ThemeContextValue {
  theme: Theme;
  colorScheme: ThemeColor;
  isDarkMode: boolean;
  setTheme: (theme: Theme) => void;
  setColorScheme: (colorScheme: ThemeColor) => void;
  toggleTheme: () => void;
}

const defaultColorScheme: ThemeColor = 'blue';
const storageThemeKey = 'blueprint_theme';
const storageColorKey = 'blueprint_color_scheme';

// Create context with default value
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Helper function to detect system preference
const detectSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return mediaQuery.matches ? 'dark' : 'light';
}

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeValue = useProvideTheme();
  return React.createElement(ThemeContext.Provider, { value: themeValue }, children);
};

// Implementation hook used by provider
function useProvideTheme(): ThemeContextValue {
  // Get initial theme from localStorage or default to system
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem(storageThemeKey) as Theme) || 'system';
  });
  
  // Get initial color scheme from localStorage or default
  const [colorScheme, setColorSchemeState] = useState<ThemeColor>(() => {
    if (typeof window === 'undefined') return defaultColorScheme;
    return (localStorage.getItem(storageColorKey) as ThemeColor) || defaultColorScheme;
  });
  
  // Track if dark mode is active (derived from theme)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (theme === 'system') {
      return detectSystemTheme() === 'dark';
    }
    return theme === 'dark';
  });

  // Update localStorage and state when theme changes
  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(storageThemeKey, newTheme);
    setThemeState(newTheme);
  }, []);

  // Update localStorage and state when color scheme changes
  const setColorScheme = useCallback((newColorScheme: ThemeColor) => {
    localStorage.setItem(storageColorKey, newColorScheme);
    setColorSchemeState(newColorScheme);
  }, []);

  // Toggle between light and dark (or system light and system dark)
  const toggleTheme = useCallback(() => {
    if (theme === 'system') {
      // If system, toggle between light and dark based on current state
      setTheme(isDarkMode ? 'light' : 'dark');
    } else {
      // Otherwise toggle between light and dark directly
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  }, [theme, isDarkMode, setTheme]);

  // Update CSS variables when theme or color scheme changes
  useEffect(() => {
    // HTML element that will receive the theme classes
    const htmlElement = document.documentElement;
    
    // Determine if dark mode should be active
    let newIsDarkMode: boolean;
    if (theme === 'system') {
      newIsDarkMode = detectSystemTheme() === 'dark';
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent): void => {
        setIsDarkMode(e.matches);
        updateThemeClasses(e.matches, colorScheme);
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      newIsDarkMode = theme === 'dark';
    }

    // Update state
    setIsDarkMode(newIsDarkMode);
    
    // Apply theme classes
    updateThemeClasses(newIsDarkMode, colorScheme);
  }, [theme, colorScheme]);

  // Helper function to update CSS classes and variables
  function updateThemeClasses(dark: boolean, color: ThemeColor): void {
    const htmlElement = document.documentElement;
    
    // Toggle dark mode class
    if (dark) {
      htmlElement.classList.add('dark');
      htmlElement.classList.remove('light');
    } else {
      htmlElement.classList.add('light');
      htmlElement.classList.remove('dark');
    }

    // Remove all color scheme classes
    ['blue', 'green', 'purple', 'orange', 'red', 'gray'].forEach(c => {
      htmlElement.classList.remove(`theme-${c}`);
    });
    
    // Add the current color scheme class
    htmlElement.classList.add(`theme-${color}`);
    
    // Update meta theme-color for mobile devices
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        dark ? '#1f2937' : '#ffffff'
      );
    }
  }

  return {
    theme,
    colorScheme,
    isDarkMode,
    setTheme,
    setColorScheme,
    toggleTheme
  };
}

// Hook for consuming the theme context
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}