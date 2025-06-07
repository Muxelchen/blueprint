// Core types and interfaces - organized by category

// Base component interfaces
export interface BaseComponent {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  testId?: string;
}

export interface WithChildren {
  children: React.ReactNode;
}

// Component property types
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type ComponentState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';

// Type modules - organized by component categories
export * from './forms'; // Form-related types
export * from './navigation'; // Navigation component types
export * from './layout'; // Layout component types
export * from './widgets'; // Widget component types
export * from './charts'; // Chart component types
export * from './maps'; // Map component types
export * from './notifications'; // Notification types
