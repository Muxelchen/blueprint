// Core types and interfaces
export interface BaseComponent {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  testId?: string;
}

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type ComponentState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';

// Export WithChildren interface
export interface WithChildren {
  children: React.ReactNode;
}

// Export all type modules
export * from './widgets';
export * from './layout';
export * from './navigation';
export * from './forms';
export * from './notifications';
export * from './maps';
export * from './charts';