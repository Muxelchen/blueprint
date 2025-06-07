// Complete notification types and interfaces
import { BaseComponent, ComponentSize } from './index';

// Base notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type NotificationPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center';

// Core notification interface
export interface BaseNotification extends BaseComponent {
  id?: string;
  type?: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  dismissible?: boolean;
  showProgress?: boolean;
  icon?: React.ReactNode;
  actions?: NotificationAction[];
  onDismiss?: (id: string) => void;
  onClick?: (notification: BaseNotification) => void;
}

// Notification actions
export interface NotificationAction {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick: (notification: BaseNotification) => void;
  disabled?: boolean;
  loading?: boolean;
}

// Toast notification types
export interface ToastNotificationProps extends BaseNotification {
  position?: NotificationPosition;
  showCloseButton?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocusLoss?: boolean;
  newestOnTop?: boolean;
  preventDuplicates?: boolean;
  limit?: number;
  transition?: 'slide' | 'fade' | 'zoom' | 'bounce';
  containerClassName?: string;
  toastClassName?: string;
}

export interface ToastManager {
  add: (notification: Omit<ToastNotificationProps, 'id'>) => string;
  remove: (id: string) => void;
  removeAll: () => void;
  update: (id: string, updates: Partial<ToastNotificationProps>) => void;
  notifications: ToastNotificationProps[];
}

// Push notification types
export interface PushNotificationProps extends Omit<BaseNotification, 'actions'> {
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  renotify?: boolean;
  timestamp?: number;
  vibrate?: number[];
  image?: string;
  actions?: PushNotificationAction[];
}

export interface PushNotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface PushNotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export interface PushNotificationManager {
  requestPermission: () => Promise<NotificationPermission>;
  getPermission: () => NotificationPermission;
  isSupported: () => boolean;
  show: (notification: PushNotificationProps) => Promise<void>;
  close: (tag?: string) => void;
  onShow?: (event: Event) => void;
  onError?: (event: Event) => void;
  onClick?: (event: Event) => void;
  onClose?: (event: Event) => void;
}

// Alert banner types
export interface AlertBannerProps extends BaseNotification {
  variant?: 'filled' | 'outlined' | 'subtle';
  size?: ComponentSize;
  closable?: boolean;
  showIcon?: boolean;
  fullWidth?: boolean;
  centered?: boolean;
  border?: boolean;
  rounded?: boolean;
}

// Progress notification types
export interface ProgressNotificationProps extends BaseNotification {
  progress: number;
  showPercentage?: boolean;
  animated?: boolean;
  striped?: boolean;
  color?: string;
  height?: number;
  indeterminate?: boolean;
  buffer?: number;
  segments?: ProgressSegment[];
}

export interface ProgressSegment {
  value: number;
  color?: string;
  label?: string;
}

// Snackbar types
export interface SnackbarProps extends BaseNotification {
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  autoHideDuration?: number;
  resumeHideDuration?: number;
  disableWindowBlurListener?: boolean;
  TransitionComponent?: React.ComponentType<any>;
  transitionDuration?: number | { appear?: number; enter?: number; exit?: number };
}

// Modal notification types
export interface ModalNotificationProps extends BaseNotification {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  focus?: boolean;
  restoreFocus?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  onBackdropClick?: () => void;
  onEscapeKey?: () => void;
}

// Inline notification types
export interface InlineNotificationProps extends BaseNotification {
  inline?: boolean;
  compact?: boolean;
  showTimestamp?: boolean;
  timestamp?: Date;
  avatar?: React.ReactNode;
  subtitle?: string;
  metadata?: Record<string, any>;
}

// Notification group types
export interface NotificationGroup {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  priority: number;
  maxNotifications?: number;
  defaultDuration?: number;
  position?: NotificationPosition;
  sound?: boolean;
  vibration?: boolean;
}

export interface NotificationGroupManager {
  groups: NotificationGroup[];
  addGroup: (group: Omit<NotificationGroup, 'id'>) => string;
  updateGroup: (id: string, updates: Partial<NotificationGroup>) => void;
  removeGroup: (id: string) => void;
  getGroup: (id: string) => NotificationGroup | undefined;
  enableGroup: (id: string) => void;
  disableGroup: (id: string) => void;
}

// Notification preferences
export interface NotificationPreferences {
  enabled: boolean;
  types: {
    [K in NotificationType]: boolean;
  };
  positions: {
    [K in NotificationPosition]: boolean;
  };
  sounds: {
    enabled: boolean;
    volume: number;
    custom?: string;
  };
  vibration: {
    enabled: boolean;
    pattern: number[];
  };
  doNotDisturb: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    days: number[];
  };
  grouping: boolean;
  maxVisible: number;
  autoHide: boolean;
  defaultDuration: number;
}

// Notification history
export interface NotificationHistoryItem extends BaseNotification {
  createdAt: Date;
  readAt?: Date;
  dismissedAt?: Date;
  clickedAt?: Date;
  groupId?: string;
  metadata?: Record<string, any>;
}

export interface NotificationHistory {
  items: NotificationHistoryItem[];
  total: number;
  unread: number;
  add: (notification: NotificationHistoryItem) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  remove: (id: string) => void;
  clear: () => void;
  getUnread: () => NotificationHistoryItem[];
  search: (query: string) => NotificationHistoryItem[];
  filter: (predicate: (item: NotificationHistoryItem) => boolean) => NotificationHistoryItem[];
}

// Notification templates
export interface NotificationTemplate {
  id: string;
  name: string;
  description?: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: React.ReactNode;
  duration?: number;
  actions?: NotificationAction[];
  variables?: string[];
  category?: string;
  tags?: string[];
}

export interface NotificationTemplateManager {
  templates: NotificationTemplate[];
  addTemplate: (template: Omit<NotificationTemplate, 'id'>) => string;
  updateTemplate: (id: string, updates: Partial<NotificationTemplate>) => void;
  removeTemplate: (id: string) => void;
  getTemplate: (id: string) => NotificationTemplate | undefined;
  renderTemplate: (templateId: string, variables: Record<string, any>) => BaseNotification;
  searchTemplates: (query: string) => NotificationTemplate[];
  getByCategory: (category: string) => NotificationTemplate[];
}

// Real-time notifications
export interface RealTimeNotification extends BaseNotification {
  channel?: string;
  userId?: string;
  groupId?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  expiry?: Date;
  deliveryMethod: 'push' | 'email' | 'sms' | 'in-app';
  metadata?: Record<string, any>;
}

export interface RealTimeNotificationManager {
  connect: (userId: string, options?: ConnectionOptions) => void;
  disconnect: () => void;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  send: (notification: RealTimeNotification) => Promise<void>;
  onNotification: (callback: (notification: RealTimeNotification) => void) => void;
  onConnectionChange: (callback: (connected: boolean) => void) => void;
  isConnected: () => boolean;
}

export interface ConnectionOptions {
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  timeout?: number;
}

// Notification analytics
export interface NotificationAnalytics {
  sent: number;
  delivered: number;
  read: number;
  clicked: number;
  dismissed: number;
  failed: number;
  deliveryRate: number;
  readRate: number;
  clickRate: number;
  dismissRate: number;
  averageTimeToRead: number;
  averageTimeToClick: number;
  typeBreakdown: Record<NotificationType, number>;
  channelBreakdown: Record<string, number>;
  timeBreakdown: Record<string, number>;
}

export interface NotificationMetrics {
  trackSent: (notification: BaseNotification) => void;
  trackDelivered: (notificationId: string) => void;
  trackRead: (notificationId: string) => void;
  trackClicked: (notificationId: string) => void;
  trackDismissed: (notificationId: string) => void;
  trackFailed: (notificationId: string, error: string) => void;
  getAnalytics: (timeRange?: { start: Date; end: Date }) => NotificationAnalytics;
  reset: () => void;
}

// Notification scheduling
export interface ScheduledNotification extends BaseNotification {
  scheduledFor: Date;
  timezone?: string;
  repeat?: {
    interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: Date;
    count?: number;
  };
  conditions?: NotificationCondition[];
}

export interface NotificationCondition {
  type: 'time' | 'location' | 'user_activity' | 'custom';
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
  field?: string;
}

export interface NotificationScheduler {
  schedule: (notification: ScheduledNotification) => string;
  cancel: (id: string) => void;
  update: (id: string, updates: Partial<ScheduledNotification>) => void;
  getScheduled: () => ScheduledNotification[];
  getUpcoming: (hours?: number) => ScheduledNotification[];
  onScheduled: (callback: (notification: ScheduledNotification) => void) => void;
}

// Notification context and provider types
export interface NotificationContextValue {
  notifications: BaseNotification[];
  add: (notification: Omit<BaseNotification, 'id'>) => string;
  remove: (id: string) => void;
  removeAll: () => void;
  update: (id: string, updates: Partial<BaseNotification>) => void;
  preferences: NotificationPreferences;
  updatePreferences: (updates: Partial<NotificationPreferences>) => void;
  history: NotificationHistory;
  templates: NotificationTemplateManager;
  scheduler: NotificationScheduler;
  analytics: NotificationMetrics;
  realTime: RealTimeNotificationManager;
}

export interface NotificationProviderProps {
  children: React.ReactNode;
  defaultPreferences?: Partial<NotificationPreferences>;
  maxNotifications?: number;
  persistHistory?: boolean;
  enableAnalytics?: boolean;
  enableRealTime?: boolean;
  realTimeConfig?: ConnectionOptions;
}

// Notification hooks return types
export interface UseNotificationsReturn {
  notifications: BaseNotification[];
  add: (notification: Omit<BaseNotification, 'id'>) => string;
  remove: (id: string) => void;
  removeAll: () => void;
  update: (id: string, updates: Partial<BaseNotification>) => void;
}

export interface UseToastReturn {
  toast: (message: string, options?: Partial<ToastNotificationProps>) => string;
  success: (message: string, options?: Partial<ToastNotificationProps>) => string;
  error: (message: string, options?: Partial<ToastNotificationProps>) => string;
  warning: (message: string, options?: Partial<ToastNotificationProps>) => string;
  info: (message: string, options?: Partial<ToastNotificationProps>) => string;
  loading: (message: string, options?: Partial<ToastNotificationProps>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export interface UseNotificationPermissionReturn {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  isSupported: boolean;
  isGranted: boolean;
  isDenied: boolean;
  isDefault: boolean;
}
