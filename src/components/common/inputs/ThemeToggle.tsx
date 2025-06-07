import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import IconButton from '../buttons/IconButton';

export interface ThemeToggleProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onThemeChange?: (isDark: boolean) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md',
  onThemeChange,
}) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Initialize from localStorage or system preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#1f2937';
      document.body.style.color = '#f9fafb';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#f9fafb';
      document.body.style.color = '#111827';
    }

    // Save to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Trigger callback
    onThemeChange?.(isDark);
  }, [isDark, onThemeChange]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('theme');
      if (!saved) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <IconButton
      icon={isDark ? <Sun /> : <Moon />}
      onClick={toggleTheme}
      tooltip={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      variant="ghost"
      size={size}
      className={className}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    />
  );
};

export default ThemeToggle;
