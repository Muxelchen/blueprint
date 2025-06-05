// Complete navigation types and interfaces
import { BaseComponent, ComponentSize } from './index';

// Navigation container types
export interface NavigationProps extends BaseComponent {
  children?: React.ReactNode;
  variant?: 'horizontal' | 'vertical' | 'tree' | 'breadcrumb' | 'tabs' | 'pills';
  size?: ComponentSize;
  orientation?: 'horizontal' | 'vertical';
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

// Navigation item types
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  path?: string;
  icon?: string;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
  external?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  children?: NavigationItem[];
  metadata?: Record<string, any>;
  onClick?: (event: React.MouseEvent) => void;
  onHover?: (event: React.MouseEvent) => void;
}

// Menu types
export interface MenuProps extends BaseComponent {
  items: MenuItem[];
  variant?: 'dropdown' | 'context' | 'sidebar' | 'toolbar';
  trigger?: React.ReactNode;
  placement?: MenuPlacement;
  offset?: [number, number];
  closeOnSelect?: boolean;
  closeOnClickOutside?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onItemSelect?: (item: MenuItem) => void;
}

export interface MenuItem {
  id: string;
  label: string;
  type?: 'item' | 'divider' | 'group' | 'custom';
  icon?: string;
  shortcut?: string;
  badge?: string | number;
  disabled?: boolean;
  danger?: boolean;
  children?: MenuItem[];
  component?: React.ComponentType<any>;
  onClick?: (event: React.MouseEvent) => void;
  href?: string;
  target?: string;
}

export type MenuPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

// Tab navigation types
export interface TabNavigationProps extends BaseComponent {
  tabs: TabItem[];
  activeTab?: string;
  variant?: 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded' | 'unstyled';
  size?: ComponentSize;
  orientation?: 'horizontal' | 'vertical';
  fitted?: boolean;
  lazy?: boolean;
  keepMounted?: boolean;
  onChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
}

export interface TabItem {
  id: string;
  label: string;
  content?: React.ReactNode;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
  closable?: boolean;
  loading?: boolean;
  error?: boolean;
  component?: React.ComponentType<any>;
  props?: Record<string, any>;
}

// Breadcrumb navigation types
export interface BreadcrumbNavigationProps extends BaseComponent {
  items: BreadcrumbItem[];
  separator?: string | React.ReactNode;
  maxItems?: number;
  showHome?: boolean;
  homeIcon?: string;
  homeLabel?: string;
  truncateMiddle?: boolean;
  onItemClick?: (item: BreadcrumbItem) => void;
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  path?: string;
  active?: boolean;
  icon?: string;
  onClick?: (event: React.MouseEvent) => void;
}

// Pagination types
export interface PaginationProps extends BaseComponent {
  total: number;
  current: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean | ((total: number, range: [number, number]) => string);
  size?: ComponentSize;
  simple?: boolean;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  onChange?: (page: number, pageSize?: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
}

// Stepper navigation types
export interface StepperProps extends BaseComponent {
  steps: StepItem[];
  current: number;
  direction?: 'horizontal' | 'vertical';
  size?: ComponentSize;
  status?: 'wait' | 'process' | 'finish' | 'error';
  clickable?: boolean;
  onChange?: (step: number) => void;
  onFinish?: () => void;
}

export interface StepItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  status?: 'wait' | 'process' | 'finish' | 'error';
  disabled?: boolean;
  optional?: boolean;
  content?: React.ReactNode;
  subSteps?: StepItem[];
}

// Sidebar navigation types
export interface SidebarNavigationProps extends BaseComponent {
  items: SidebarNavigationItem[];
  collapsed?: boolean;
  collapsible?: boolean;
  width?: number | string;
  collapsedWidth?: number | string;
  theme?: 'light' | 'dark';
  onItemSelect?: (item: SidebarNavigationItem) => void;
  onToggle?: (collapsed: boolean) => void;
}

export interface SidebarNavigationItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  path?: string;
  active?: boolean;
  badge?: string | number;
  children?: SidebarNavigationItem[];
  level?: number;
  expanded?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

// Router types
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  sensitive?: boolean;
  strict?: boolean;
  children?: RouteConfig[];
  meta?: RouteMeta;
  guards?: RouteGuard[];
  redirect?: string;
  fallback?: React.ComponentType<any>;
}

export interface RouteMeta {
  title?: string;
  description?: string;
  requiresAuth?: boolean;
  roles?: string[];
  permissions?: string[];
  layout?: string;
  breadcrumb?: BreadcrumbItem[];
  keepAlive?: boolean;
  cache?: boolean;
}

export interface RouteGuard {
  name: string;
  guard: (route: RouteConfig, navigation: NavigationContext) => boolean | Promise<boolean>;
  redirectTo?: string;
  fallback?: React.ComponentType<any>;
}

export interface NavigationContext {
  currentRoute: RouteConfig;
  previousRoute?: RouteConfig;
  params: Record<string, string>;
  query: Record<string, string>;
  hash: string;
  user?: any;
  permissions: string[];
  navigate: (path: string, options?: NavigationOptions) => void;
  goBack: () => void;
  goForward: () => void;
  replace: (path: string) => void;
}

export interface NavigationOptions {
  replace?: boolean;
  state?: any;
  preserveQuery?: boolean;
  preserveHash?: boolean;
}

// Link types
export interface LinkProps extends BaseComponent {
  children?: React.ReactNode;
  href?: string;
  to?: string;
  external?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  download?: boolean | string;
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'unstyled';
  underline?: 'always' | 'hover' | 'none';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

// Navigation history types
export interface NavigationHistory {
  entries: NavigationHistoryEntry[];
  index: number;
  length: number;
  state: any;
  canGoBack: boolean;
  canGoForward: boolean;
  listen: (callback: (entry: NavigationHistoryEntry) => void) => () => void;
  push: (path: string, state?: any) => void;
  replace: (path: string, state?: any) => void;
  go: (delta: number) => void;
  back: () => void;
  forward: () => void;
}

export interface NavigationHistoryEntry {
  path: string;
  state?: any;
  key: string;
  timestamp: Date;
}

// Search navigation types
export interface SearchNavigationProps extends BaseComponent {
  placeholder?: string;
  value?: string;
  suggestions?: SearchSuggestion[];
  categories?: SearchCategory[];
  showCategories?: boolean;
  showHistory?: boolean;
  maxSuggestions?: number;
  debounceDelay?: number;
  onSearch?: (query: string, category?: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  onCategorySelect?: (category: SearchCategory) => void;
}

export interface SearchSuggestion {
  id: string;
  label: string;
  value: string;
  category?: string;
  icon?: string;
  badge?: string | number;
  metadata?: Record<string, any>;
  onClick?: () => void;
}

export interface SearchCategory {
  id: string;
  label: string;
  icon?: string;
  count?: number;
  active?: boolean;
}

// Drawer navigation types
export interface DrawerNavigationProps extends BaseComponent {
  children?: React.ReactNode;
  open: boolean;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: ComponentSize | number | string;
  overlay?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlay?: boolean;
  lockScroll?: boolean;
  preserveFocus?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

// Command palette types
export interface CommandPaletteProps extends BaseComponent {
  open: boolean;
  commands: Command[];
  placeholder?: string;
  maxHeight?: number | string;
  onCommandSelect?: (command: Command) => void;
  onClose?: () => void;
}

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string[];
  category?: string;
  disabled?: boolean;
  action: () => void | Promise<void>;
}

// Quick access types
export interface QuickAccessProps extends BaseComponent {
  items: QuickAccessItem[];
  maxItems?: number;
  showCategories?: boolean;
  onItemSelect?: (item: QuickAccessItem) => void;
}

export interface QuickAccessItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  category?: string;
  frequency?: number;
  lastUsed?: Date;
  href?: string;
  action?: () => void;
}