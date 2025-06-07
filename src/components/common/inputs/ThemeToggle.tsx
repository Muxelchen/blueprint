import React from 'react';
import { Sun, Moon } from 'lucide-react';
import IconButton from '../buttons/IconButton';
import { useDarkMode } from '../../../hooks/useDarkMode';

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
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleToggle = () => {
    toggleDarkMode();
    onThemeChange?.(!isDarkMode);
  };

  return (
    <IconButton
      icon={isDarkMode ? <Sun /> : <Moon />}
      onClick={handleToggle}
      tooltip={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      variant="ghost"
      size={size}
      className={className}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    />
  );
};

export default ThemeToggle;
