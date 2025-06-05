// Common components - organized by category

// Core System Components
export { default as AdvancedThemeProvider, useTheme, ThemeSelector } from './AdvancedThemeProvider';
export { default as ErrorBoundary } from './ErrorBoundary';

// Buttons
export * from './buttons';

// Inputs  
export * from './inputs';

// Display
export * from './display';

// Feedback
export * from './feedback';

// Overlays
export * from './overlays';

// Re-export popular components for convenience
export { default as Button } from './buttons/Button';
export { default as IconButton } from './buttons/IconButton';
export { default as InputField } from './inputs/InputField';
export { default as Modal } from './overlays/Modal';
export { default as ToastNotification } from './feedback/ToastNotification';

// Re-export theme types for convenience
export type { 
  Theme, 
  ThemeColors, 
  ThemeContextValue 
} from './AdvancedThemeProvider';