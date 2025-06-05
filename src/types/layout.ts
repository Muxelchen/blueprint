// Complete layout types and interfaces
import { BaseComponent, ComponentSize, ComponentVariant } from './index';

// Header types
export interface HeaderProps extends BaseComponent {
  variant?: 'default' | 'minimal' | 'prominent' | 'sticky' | 'transparent';
  size?: ComponentSize;
  fixed?: boolean;
  elevated?: boolean;
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
  searchBar?: React.ReactNode;
  userMenu?: React.ReactNode;
  notifications?: React.ReactNode;
  onMenuToggle?: () => void;
  onSearch?: (query: string) => void;
}

// Layout container types
export interface LayoutContainerProps extends BaseComponent {
  type: 'grid' | 'flex' | 'stack' | 'sidebar' | 'header-footer' | 'dashboard';
  responsive?: boolean;
  spacing?: ComponentSize;
  padding?: ComponentSize;
  margin?: ComponentSize;
  breakpoints?: LayoutBreakpoints;
}

export interface LayoutBreakpoints {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

// Grid layout types
export interface GridLayoutProps extends LayoutContainerProps {
  columns?: number | 'auto' | string;
  rows?: number | 'auto' | string;
  gap?: ComponentSize;
  columnGap?: ComponentSize;
  rowGap?: ComponentSize;
  autoRows?: string;
  autoColumns?: string;
  autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
}

export interface GridItemProps extends BaseComponent {
  column?: number | string;
  row?: number | string;
  columnSpan?: number;
  rowSpan?: number;
  columnStart?: number;
  columnEnd?: number;
  rowStart?: number;
  rowEnd?: number;
  area?: string;
  justifySelf?: 'start' | 'end' | 'center' | 'stretch';
  alignSelf?: 'start' | 'end' | 'center' | 'stretch';
}

// Flex layout types
export interface FlexLayoutProps extends LayoutContainerProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: ComponentSize;
}

export interface FlexItemProps extends BaseComponent {
  flex?: number | string;
  grow?: number;
  shrink?: number;
  basis?: string | number;
  order?: number;
  alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'baseline' | 'stretch';
}

// Stack layout types
export interface StackLayoutProps extends LayoutContainerProps {
  direction?: 'vertical' | 'horizontal';
  spacing?: ComponentSize;
  divider?: React.ReactNode;
  wrap?: boolean;
}

// Footer layout types
export interface FooterProps extends BaseComponent {
  variant?: 'simple' | 'detailed' | 'minimal';
  links?: FooterLink[];
  socialLinks?: SocialLink[];
  copyright?: string;
  logo?: React.ReactNode;
  newsletter?: boolean;
  onNewsletterSubmit?: (email: string) => void;
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  group?: string;
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'github';
  url: string;
  icon?: string;
}

// Sidebar layout types
export interface SidebarProps extends BaseComponent {
  position?: 'left' | 'right';
  width?: number | string;
  collapsible?: boolean;
  collapsed?: boolean;
  overlay?: boolean;
  persistent?: boolean;
  onToggle?: (collapsed: boolean) => void;
  trigger?: React.ReactNode;
}

// Main content area types
export interface MainContentProps extends BaseComponent {
  maxWidth?: string | number;
  centered?: boolean;
  fullHeight?: boolean;
  scrollable?: boolean;
  padding?: ComponentSize;
}

// Page layout types
export interface PageLayoutProps extends BaseComponent {
  template: 'basic' | 'sidebar' | 'dashboard' | 'landing' | 'auth';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  meta?: PageMeta;
}

export interface PageMeta {
  title: string;
  description?: string;
  keywords?: string[];
  author?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

// Dashboard layout types
export interface DashboardLayoutProps extends BaseComponent {
  widgets: DashboardWidget[];
  layout: DashboardLayoutConfig;
  editable?: boolean;
  onLayoutChange?: (layout: DashboardLayoutConfig) => void;
  onWidgetAdd?: (widget: DashboardWidget) => void;
  onWidgetRemove?: (widgetId: string) => void;
  onWidgetUpdate?: (widgetId: string, updates: Partial<DashboardWidget>) => void;
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  component: React.ComponentType<any>;
  props: Record<string, any>;
  layout: DashboardWidgetLayout;
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  resizable?: boolean;
  draggable?: boolean;
}

export interface DashboardWidgetLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface DashboardLayoutConfig {
  columns: number;
  rowHeight: number;
  margin: number;
  containerPadding?: number;
  breakpoints: Record<string, number>;
  layouts: Record<string, DashboardWidgetLayout[]>;
}

// Search types
export interface SearchBarProps extends BaseComponent {
  placeholder?: string;
  value?: string;
  suggestions?: any[]; // Use any[] temporarily to avoid circular dependency
  variant?: 'default' | 'prominent' | 'minimal';
  size?: ComponentSize;
  showClearButton?: boolean;
  showSearchButton?: boolean;
  loading?: boolean;
  debounceMs?: number;
  maxSuggestions?: number;
  groupSuggestions?: boolean;
  onSearch?: (query: string) => void;
  onChange?: (value: string) => void;
  onSuggestionSelect?: (suggestion: any) => void; // Use any temporarily
  onFocus?: () => void;
  onBlur?: () => void;
}

// Section types
export interface SectionProps extends BaseComponent {
  title?: string;
  subtitle?: string;
  icon?: string;
  variant?: ComponentVariant;
  collapsible?: boolean;
  collapsed?: boolean;
  headerActions?: React.ReactNode;
  onToggle?: (collapsed: boolean) => void;
}

// Card layout types
export interface CardProps extends BaseComponent {
  title?: string;
  subtitle?: string;
  image?: string;
  imagePosition?: 'top' | 'bottom' | 'left' | 'right';
  actions?: React.ReactNode;
  variant?: ComponentVariant;
  hoverable?: boolean;
  clickable?: boolean;
  selected?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// Container types
export interface ContainerProps extends BaseComponent {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | number | string;
  centered?: boolean;
  fluid?: boolean;
  disableGutters?: boolean;
}

// Divider types
export interface DividerProps extends BaseComponent {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: number;
  color?: string;
  spacing?: ComponentSize;
  label?: string;
  labelPosition?: 'left' | 'center' | 'right';
}

// Spacer types
export interface SpacerProps extends BaseComponent {
  size?: ComponentSize | number;
  direction?: 'horizontal' | 'vertical' | 'both';
}

// Layout utilities
export interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
}

export type LayoutBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface MediaQuery {
  breakpoint: LayoutBreakpoint;
  condition: 'up' | 'down' | 'only';
  value: number;
}

// Layout context types
export interface LayoutContext {
  breakpoint: LayoutBreakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  theme: 'light' | 'dark';
  sidebar: {
    open: boolean;
    width: number;
    collapsed: boolean;
  };
  header: {
    height: number;
    fixed: boolean;
  };
  footer: {
    height: number;
  };
}

// Core utility types