import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Advanced theme system with CSS custom properties and dynamic theme generation
export interface ThemeColors {
  // Core brand colors
  primary: string;
  'primary-50': string;
  'primary-100': string;
  'primary-200': string;
  'primary-300': string;
  'primary-400': string;
  'primary-500': string;
  'primary-600': string;
  'primary-700': string;
  'primary-800': string;
  'primary-900': string;
  
  // Secondary colors
  secondary: string;
  'secondary-50': string;
  'secondary-100': string;
  'secondary-200': string;
  'secondary-300': string;
  'secondary-400': string;
  'secondary-500': string;
  'secondary-600': string;
  'secondary-700': string;
  'secondary-800': string;
  'secondary-900': string;
  
  // Semantic colors
  success: string;
  'success-50': string;
  'success-500': string;
  'success-600': string;
  warning: string;
  'warning-50': string;
  'warning-500': string;
  'warning-600': string;
  error: string;
  'error-50': string;
  'error-500': string;
  'error-600': string;
  info: string;
  'info-50': string;
  'info-500': string;
  'info-600': string;
  
  // Surface colors
  background: string;
  'background-secondary': string;
  surface: string;
  'surface-secondary': string;
  'surface-tertiary': string;
  
  // Text colors
  'text-primary': string;
  'text-secondary': string;
  'text-tertiary': string;
  'text-on-primary': string;
  'text-on-secondary': string;
  
  // Border colors
  border: string;
  'border-secondary': string;
  'border-focus': string;
  
  // Interactive states
  hover: string;
  active: string;
  disabled: string;
  'disabled-text': string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

export interface ThemeTypography {
  'font-family-primary': string;
  'font-family-secondary': string;
  'font-family-mono': string;
  'font-size-xs': string;
  'font-size-sm': string;
  'font-size-base': string;
  'font-size-lg': string;
  'font-size-xl': string;
  'font-size-2xl': string;
  'font-size-3xl': string;
  'font-size-4xl': string;
  'font-weight-light': string;
  'font-weight-normal': string;
  'font-weight-medium': string;
  'font-weight-semibold': string;
  'font-weight-bold': string;
  'line-height-tight': string;
  'line-height-normal': string;
  'line-height-relaxed': string;
  'letter-spacing-tight': string;
  'letter-spacing-normal': string;
  'letter-spacing-wide': string;
}

export interface ThemeShadows {
  'shadow-xs': string;
  'shadow-sm': string;
  'shadow-md': string;
  'shadow-lg': string;
  'shadow-xl': string;
  'shadow-2xl': string;
  'shadow-inner': string;
  'shadow-none': string;
}

export interface ThemeRadius {
  'radius-none': string;
  'radius-sm': string;
  'radius-md': string;
  'radius-lg': string;
  'radius-xl': string;
  'radius-2xl': string;
  'radius-3xl': string;
  'radius-full': string;
}

export interface ThemeTransitions {
  'transition-fast': string;
  'transition-normal': string;
  'transition-slow': string;
  'ease-in': string;
  'ease-out': string;
  'ease-in-out': string;
  'ease-bounce': string;
}

export interface Theme {
  id: string;
  name: string;
  mode: 'light' | 'dark' | 'auto';
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  shadows: ThemeShadows;
  radius: ThemeRadius;
  transitions: ThemeTransitions;
  custom?: Record<string, any>;
}

export interface ThemeContextValue {
  currentTheme: Theme;
  availableThemes: Theme[];
  mode: 'light' | 'dark' | 'auto';
  setTheme: (themeId: string) => void;
  setMode: (mode: 'light' | 'dark' | 'auto') => void;
  createCustomTheme: (baseTheme: string, overrides: Partial<Theme>) => Theme;
  generateThemeFromColor: (primaryColor: string, mode?: 'light' | 'dark') => Theme;
  exportTheme: (theme: Theme) => string;
  importTheme: (themeJson: string) => Theme;
}

// Color utility functions for theme generation
class ColorUtils {
  static hexToHsl(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];
    
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
  }
  
  static hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= h && h < 2/6) {
      r = x; g = c; b = 0;
    } else if (2/6 <= h && h < 3/6) {
      r = 0; g = c; b = x;
    } else if (3/6 <= h && h < 4/6) {
      r = 0; g = x; b = c;
    } else if (4/6 <= h && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (5/6 <= h && h < 1) {
      r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  static generateColorScale(baseColor: string, steps: number = 11): string[] {
    const [h, s, l] = this.hexToHsl(baseColor);
    const colors: string[] = [];
    
    for (let i = 0; i < steps; i++) {
      const lightness = 95 - (i * 85 / (steps - 1)); // 95% to 10%
      colors.push(this.hslToHex(h, s, lightness));
    }
    
    return colors;
  }
  
  static adjustBrightness(color: string, amount: number): string {
    const [h, s, l] = this.hexToHsl(color);
    return this.hslToHex(h, s, Math.max(0, Math.min(100, l + amount)));
  }
  
  static adjustSaturation(color: string, amount: number): string {
    const [h, s, l] = this.hexToHsl(color);
    return this.hslToHex(h, Math.max(0, Math.min(100, s + amount)), l);
  }
}

// Theme generator
class ThemeGenerator {
  static generateFromColor(primaryColor: string, mode: 'light' | 'dark' = 'light'): Theme {
    const primaryScale = ColorUtils.generateColorScale(primaryColor);
    const [h, s] = ColorUtils.hexToHsl(primaryColor);
    
    // Generate complementary secondary color
    const secondaryHue = (h + 180) % 360;
    const secondaryColor = ColorUtils.hslToHex(secondaryHue, s * 0.7, mode === 'light' ? 50 : 40);
    const secondaryScale = ColorUtils.generateColorScale(secondaryColor);
    
    const colors: ThemeColors = {
      primary: primaryScale[5],
      'primary-50': primaryScale[0],
      'primary-100': primaryScale[1],
      'primary-200': primaryScale[2],
      'primary-300': primaryScale[3],
      'primary-400': primaryScale[4],
      'primary-500': primaryScale[5],
      'primary-600': primaryScale[6],
      'primary-700': primaryScale[7],
      'primary-800': primaryScale[8],
      'primary-900': primaryScale[9],
      
      secondary: secondaryScale[5],
      'secondary-50': secondaryScale[0],
      'secondary-100': secondaryScale[1],
      'secondary-200': secondaryScale[2],
      'secondary-300': secondaryScale[3],
      'secondary-400': secondaryScale[4],
      'secondary-500': secondaryScale[5],
      'secondary-600': secondaryScale[6],
      'secondary-700': secondaryScale[7],
      'secondary-800': secondaryScale[8],
      'secondary-900': secondaryScale[9],
      
      // Semantic colors
      success: '#10b981',
      'success-50': '#ecfdf5',
      'success-500': '#10b981',
      'success-600': '#059669',
      warning: '#f59e0b',
      'warning-50': '#fffbeb',
      'warning-500': '#f59e0b',
      'warning-600': '#d97706',
      error: '#ef4444',
      'error-50': '#fef2f2',
      'error-500': '#ef4444',
      'error-600': '#dc2626',
      info: '#3b82f6',
      'info-50': '#eff6ff',
      'info-500': '#3b82f6',
      'info-600': '#2563eb',
      
      // Surface and background colors
      background: mode === 'light' ? '#ffffff' : '#0f0f0f',
      'background-secondary': mode === 'light' ? '#f8fafc' : '#1a1a1a',
      surface: mode === 'light' ? '#ffffff' : '#171717',
      'surface-secondary': mode === 'light' ? '#f1f5f9' : '#262626',
      'surface-tertiary': mode === 'light' ? '#e2e8f0' : '#404040',
      
      // Text colors
      'text-primary': mode === 'light' ? '#0f172a' : '#f8fafc',
      'text-secondary': mode === 'light' ? '#475569' : '#cbd5e1',
      'text-tertiary': mode === 'light' ? '#94a3b8' : '#64748b',
      'text-on-primary': mode === 'light' ? '#ffffff' : '#0f172a',
      'text-on-secondary': mode === 'light' ? '#ffffff' : '#0f172a',
      
      // Border colors
      border: mode === 'light' ? '#e2e8f0' : '#374151',
      'border-secondary': mode === 'light' ? '#cbd5e1' : '#4b5563',
      'border-focus': primaryScale[5],
      
      // Interactive states
      hover: mode === 'light' ? '#f1f5f9' : '#374151',
      active: mode === 'light' ? '#e2e8f0' : '#4b5563',
      disabled: mode === 'light' ? '#f8fafc' : '#1f2937',
      'disabled-text': mode === 'light' ? '#cbd5e1' : '#6b7280'
    };
    
    return {
      id: `generated-${Date.now()}`,
      name: `Generated ${mode} theme`,
      mode,
      colors,
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '5rem',
        '5xl': '6rem',
        '6xl': '8rem'
      },
      typography: {
        'font-family-primary': 'Inter, system-ui, sans-serif',
        'font-family-secondary': 'Inter, system-ui, sans-serif',
        'font-family-mono': 'JetBrains Mono, Monaco, Consolas, monospace',
        'font-size-xs': '0.75rem',
        'font-size-sm': '0.875rem',
        'font-size-base': '1rem',
        'font-size-lg': '1.125rem',
        'font-size-xl': '1.25rem',
        'font-size-2xl': '1.5rem',
        'font-size-3xl': '1.875rem',
        'font-size-4xl': '2.25rem',
        'font-weight-light': '300',
        'font-weight-normal': '400',
        'font-weight-medium': '500',
        'font-weight-semibold': '600',
        'font-weight-bold': '700',
        'line-height-tight': '1.25',
        'line-height-normal': '1.5',
        'line-height-relaxed': '1.75',
        'letter-spacing-tight': '-0.025em',
        'letter-spacing-normal': '0',
        'letter-spacing-wide': '0.025em'
      },
      shadows: {
        'shadow-xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'shadow-sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'shadow-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'shadow-inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'shadow-none': '0 0 #0000'
      },
      radius: {
        'radius-none': '0',
        'radius-sm': '0.125rem',
        'radius-md': '0.375rem',
        'radius-lg': '0.5rem',
        'radius-xl': '0.75rem',
        'radius-2xl': '1rem',
        'radius-3xl': '1.5rem',
        'radius-full': '9999px'
      },
      transitions: {
        'transition-fast': '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        'transition-normal': '200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'transition-slow': '300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    };
  }
}

// Default themes
const defaultThemes: Theme[] = [
  ThemeGenerator.generateFromColor('#3b82f6', 'light'), // Blue light theme
  ThemeGenerator.generateFromColor('#3b82f6', 'dark'),  // Blue dark theme
  ThemeGenerator.generateFromColor('#10b981', 'light'), // Green light theme
  ThemeGenerator.generateFromColor('#f59e0b', 'light'), // Orange light theme
  ThemeGenerator.generateFromColor('#8b5cf6', 'light'), // Purple light theme
];

// Update theme names
defaultThemes[0].name = 'Blue Light';
defaultThemes[0].id = 'blue-light';
defaultThemes[1].name = 'Blue Dark';
defaultThemes[1].id = 'blue-dark';
defaultThemes[2].name = 'Green Light';
defaultThemes[2].id = 'green-light';
defaultThemes[3].name = 'Orange Light';
defaultThemes[3].id = 'orange-light';
defaultThemes[4].name = 'Purple Light';
defaultThemes[4].id = 'purple-light';

// Theme context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Theme provider component
export const AdvancedThemeProvider: React.FC<{
  children: React.ReactNode;
  initialTheme?: string;
  initialMode?: 'light' | 'dark' | 'auto';
}> = ({ children, initialTheme = 'blue-light', initialMode = 'auto' }) => {
  const [availableThemes, setAvailableThemes] = useState<Theme[]>(defaultThemes);
  const [currentThemeId, setCurrentThemeId] = useState<string>(initialTheme);
  const [mode, setMode] = useState<'light' | 'dark' | 'auto'>(initialMode);
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(false);

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Get current theme based on mode
  const currentTheme = React.useMemo(() => {
    let theme = availableThemes.find(t => t.id === currentThemeId) || availableThemes[0];
    
    // Auto mode: switch between light/dark variants
    if (mode === 'auto') {
      const preferredMode = systemPrefersDark ? 'dark' : 'light';
      const autoTheme = availableThemes.find(t => 
        t.id.includes(theme.id.split('-')[0]) && t.mode === preferredMode
      );
      if (autoTheme) theme = autoTheme;
    }
    
    return theme;
  }, [availableThemes, currentThemeId, mode, systemPrefersDark]);

  // Apply theme to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply colors
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Apply spacing
    Object.entries(currentTheme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // Apply typography
    Object.entries(currentTheme.typography).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Apply shadows
    Object.entries(currentTheme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Apply radius
    Object.entries(currentTheme.radius).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Apply transitions
    Object.entries(currentTheme.transitions).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Apply custom properties
    if (currentTheme.custom) {
      Object.entries(currentTheme.custom).forEach(([key, value]) => {
        root.style.setProperty(`--custom-${key}`, String(value));
      });
    }
    
    // Add theme class to body
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .concat(` theme-${currentTheme.id}`);
      
  }, [currentTheme]);

  const setTheme = useCallback((themeId: string) => {
    setCurrentThemeId(themeId);
  }, []);

  const createCustomTheme = useCallback((baseTheme: string, overrides: Partial<Theme>): Theme => {
    const base = availableThemes.find(t => t.id === baseTheme) || availableThemes[0];
    const customTheme: Theme = {
      ...base,
      ...overrides,
      id: overrides.id || `custom-${Date.now()}`,
      name: overrides.name || `Custom ${base.name}`,
      colors: { ...base.colors, ...overrides.colors },
      spacing: { ...base.spacing, ...overrides.spacing },
      typography: { ...base.typography, ...overrides.typography },
      shadows: { ...base.shadows, ...overrides.shadows },
      radius: { ...base.radius, ...overrides.radius },
      transitions: { ...base.transitions, ...overrides.transitions }
    };
    
    setAvailableThemes(prev => [...prev, customTheme]);
    return customTheme;
  }, [availableThemes]);

  const generateThemeFromColor = useCallback((primaryColor: string, themeMode?: 'light' | 'dark'): Theme => {
    const theme = ThemeGenerator.generateFromColor(primaryColor, themeMode);
    setAvailableThemes(prev => [...prev, theme]);
    return theme;
  }, []);

  const exportTheme = useCallback((theme: Theme): string => {
    return JSON.stringify(theme, null, 2);
  }, []);

  const importTheme = useCallback((themeJson: string): Theme => {
    try {
      const theme = JSON.parse(themeJson) as Theme;
      setAvailableThemes(prev => [...prev, theme]);
      return theme;
    } catch (error) {
      throw new Error('Invalid theme JSON');
    }
  }, []);

  const value: ThemeContextValue = {
    currentTheme,
    availableThemes,
    mode,
    setTheme,
    setMode,
    createCustomTheme,
    generateThemeFromColor,
    exportTheme,
    importTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within an AdvancedThemeProvider');
  }
  return context;
};

// Theme selector component
export const ThemeSelector: React.FC<{
  showColorPicker?: boolean;
  showModeToggle?: boolean;
  className?: string;
}> = ({ showColorPicker = true, showModeToggle = true, className = '' }) => {
  const { currentTheme, availableThemes, mode, setTheme, setMode, generateThemeFromColor } = useTheme();
  const [customColor, setCustomColor] = useState('#3b82f6');

  const handleGenerateTheme = () => {
    const newTheme = generateThemeFromColor(customColor, mode === 'auto' ? 'light' : mode);
    setTheme(newTheme.id);
  };

  return (
    <div className={`space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      <div>
        <label className="block text-sm font-medium mb-2">Theme</label>
        <select
          value={currentTheme.id}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {availableThemes.map(theme => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
      </div>

      {showModeToggle && (
        <div>
          <label className="block text-sm font-medium mb-2">Mode</label>
          <div className="flex space-x-2">
            {(['light', 'dark', 'auto'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  mode === m
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {showColorPicker && (
        <div>
          <label className="block text-sm font-medium mb-2">Generate from Color</label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="#3b82f6"
            />
            <button
              onClick={handleGenerateTheme}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Generate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedThemeProvider;