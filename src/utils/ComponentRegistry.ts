import { ComponentType, lazy } from 'react';

// Component registry type definitions
interface ComponentEntry {
  name: string;
  component: ComponentType<any>;
  category: string;
  description?: string;
  props?: Record<string, any>;
  lazy?: boolean;
}

class ComponentRegistry {
  private components: Map<string, ComponentEntry> = new Map();
  private categories: Set<string> = new Set();

  // Register a component
  register(name: string, component: ComponentType<any>, category: string, options?: {
    description?: string;
    props?: Record<string, any>;
    lazy?: boolean;
  }): void {
    this.components.set(name, {
      name,
      component,
      category,
      description: options?.description,
      props: options?.props,
      lazy: options?.lazy
    });
    this.categories.add(category);
  }

  // Get a component by name
  get(name: string): ComponentType<any> | null {
    const entry = this.components.get(name);
    if (!entry) return null;
    
    return entry.component;
  }

  // Get all components in a category
  getByCategory(category: string): ComponentEntry[] {
    return Array.from(this.components.values()).filter(
      entry => entry.category === category
    );
  }

  // Get all categories
  getCategories(): string[] {
    return Array.from(this.categories);
  }

  // Get all components
  getAll(): ComponentEntry[] {
    return Array.from(this.components.values());
  }

  // Load component dynamically
  async loadComponent(name: string): Promise<ComponentType<any> | null> {
    const entry = this.components.get(name);
    if (!entry) return null;

    const loadedComponent = entry.component;
    // Handle both default and named exports
    return (loadedComponent as any).default || loadedComponent;
  }
}

// Create global registry instance
export const componentRegistry = new ComponentRegistry();

// Register common components
const registerCommonComponents = () => {
  // Buttons
  componentRegistry.register(
    'Button',
    lazy(() => import('../components/common/buttons/Button')),
    'buttons',
    { description: 'Basic button component' }
  );

  componentRegistry.register(
    'IconButton', 
    lazy(() => import('../components/common/buttons/IconButton')),
    'buttons',
    { description: 'Icon button component' }
  );

  componentRegistry.register(
    'PrintButton',
    lazy(() => import('../components/common/buttons/PrintButton')),
    'buttons',
    { description: 'Button for printing functionality' }
  );

  // Inputs
  componentRegistry.register(
    'InputField',
    lazy(() => import('../components/common/inputs/InputField')),
    'inputs', 
    { description: 'Text input field' }
  );

  componentRegistry.register(
    'Checkbox',
    lazy(() => import('../components/common/inputs/Checkbox')),
    'inputs',
    { description: 'Checkbox input' }
  );

  componentRegistry.register(
    'DropdownSelect',
    lazy(() => import('../components/common/inputs/DropdownSelect')),
    'inputs',
    { description: 'Dropdown selection component' }
  );

  componentRegistry.register(
    'MultiSelect',
    lazy(() => import('../components/common/inputs/MultiSelect')),
    'inputs',
    { description: 'Multi-select dropdown component' }
  );

  componentRegistry.register(
    'DateTimePicker',
    lazy(() => import('../components/common/inputs/DateTimePicker')),
    'inputs',
    { description: 'Date and time picker component' }
  );

  componentRegistry.register(
    'FileUpload',
    lazy(() => import('../components/common/inputs/FileUpload')),
    'inputs',
    { description: 'File upload component' }
  );

  componentRegistry.register(
    'RichTextEditor',
    lazy(() => import('../components/common/inputs/RichTextEditor')),
    'inputs',
    { description: 'Rich text editor component' }
  );

  componentRegistry.register(
    'Slider',
    lazy(() => import('../components/common/inputs/Slider')),
    'inputs',
    { description: 'Slider input component' }
  );

  componentRegistry.register(
    'ToggleSwitch',
    lazy(() => import('../components/common/inputs/ToggleSwitch')),
    'inputs',
    { description: 'Toggle switch component' }
  );

  componentRegistry.register(
    'ThemeToggle',
    lazy(() => import('../components/common/inputs/ThemeToggle')),
    'inputs',
    { description: 'Theme toggle switch' }
  );

  componentRegistry.register(
    'LanguageSwitch',
    lazy(() => import('../components/common/inputs/LanguageSwitch')),
    'inputs',
    { description: 'Language switcher component' }
  );

  componentRegistry.register(
    'DragDrop',
    lazy(() => import('../components/common/inputs/DragDrop')),
    'inputs',
    { description: 'Drag and drop file upload' }
  );

  componentRegistry.register(
    'KeyboardNav',
    lazy(() => import('../components/common/inputs/KeyboardNav')),
    'inputs',
    { description: 'Keyboard navigation support' }
  );

  componentRegistry.register(
    'AccessibilitySupport',
    lazy(() => import('../components/common/inputs/AccessibilitySupport')),
    'inputs',
    { description: 'Accessibility support features' }
  );

  // Display
  componentRegistry.register(
    'Accordion',
    lazy(() => import('../components/common/display/Accordion')),
    'display',
    { description: 'Accordion component for collapsible content' }
  );

  componentRegistry.register(
    'Badge',
    lazy(() => import('../components/common/display/BadgeCounter')),
    'display',
    { description: 'Badge/counter component' }
  );

  componentRegistry.register(
    'Pagination',
    lazy(() => import('../components/common/display/Pagination')),
    'display',
    { description: 'Pagination component for lists' }
  );

  componentRegistry.register(
    'StatusIndicator',
    lazy(() => import('../components/common/display/StatusIndicator')),
    'display',
    { description: 'Status indicator component' }
  );

  componentRegistry.register(
    'Stepper',
    lazy(() => import('../components/common/display/Stepper')),
    'display',
    { description: 'Stepper component for multi-step processes' }
  );

  componentRegistry.register(
    'TabNavigation',
    lazy(() => import('../components/common/display/TabNavigation')),
    'display',
    { description: 'Tab navigation component' }
  );

  // Feedback
  componentRegistry.register(
    'AlertBanner',
    lazy(() => import('../components/common/feedback/AlertBanner')),
    'feedback',
    { description: 'Alert banner component' }
  );

  componentRegistry.register(
    'ErrorPage',
    lazy(() => import('../components/common/feedback/ErrorPage')),
    'feedback',
    { description: 'Error page component' }
  );

  componentRegistry.register(
    'LoadingState',
    lazy(() => import('../components/common/feedback/LoadingState')),
    'feedback',
    { description: 'Loading state indicator' }
  );

  componentRegistry.register(
    'ProgressNotification',
    lazy(() => import('../components/common/feedback/ProgressNotification')),
    'feedback',
    { description: 'Progress notification component' }
  );

  componentRegistry.register(
    'PushNotification',
    lazy(() => import('../components/common/feedback/PushNotification')),
    'feedback',
    { description: 'Push notification component' }
  );

  componentRegistry.register(
    'SkeletonScreen',
    lazy(() => import('../components/common/feedback/SkeletonScreen')),
    'feedback',
    { description: 'Skeleton screen for loading states' }
  );

  componentRegistry.register(
    'ToastNotification',
    lazy(() => import('../components/common/feedback/ToastNotification')),
    'feedback',
    { description: 'Toast notification component' }
  );

  // Overlays
  componentRegistry.register(
    'Dialog',
    lazy(() => import('../components/common/overlays/Dialog')),
    'overlays',
    { description: 'Dialog component for modal windows' }
  );

  componentRegistry.register(
    'DropdownMenu',
    lazy(() => import('../components/common/overlays/DropdownMenu')),
    'overlays',
    { description: 'Dropdown menu component' }
  );

  componentRegistry.register(
    'Modal',
    lazy(() => import('../components/common/overlays/Modal')),
    'overlays',
    { description: 'Modal component for overlays' }
  );

  // Layout
  componentRegistry.register(
    'Header',
    lazy(() => import('../components/layout/Header')),
    'layout',
    { description: 'Header component' }
  );

  componentRegistry.register(
    'Footer',
    lazy(() => import('../components/layout/Footer')),
    'layout',
    { description: 'Footer component' }
  );

  componentRegistry.register(
    'Sidebar',
    lazy(() => import('../components/layout/Sidebar')),
    'layout',
    { description: 'Sidebar component' }
  );

  componentRegistry.register(
    'MainContent',
    lazy(() => import('../components/layout/MainContent')),
    'layout',
    { description: 'Main content area' }
  );

  componentRegistry.register(
    'SearchBar',
    lazy(() => import('../components/layout/SearchBar')),
    'layout',
    { description: 'Search bar component' }
  );

  componentRegistry.register(
    'BreadcrumbNav',
    lazy(() => import('../components/layout/BreadcrumbNav')),
    'layout',
    { description: 'Breadcrumb navigation component' }
  );

  // Forms
  componentRegistry.register(
    'Form',
    lazy(() => import('../components/forms/Form')),
    'forms',
    { description: 'Form component with validation' }
  );

  // Widgets
  componentRegistry.register(
    'AreaChart',
    lazy(() => import('../components/widgets/AreaChart')),
    'widgets',
    { description: 'Area chart for data visualization' }
  );

  componentRegistry.register(
    'BarChart',
    lazy(() => import('../components/widgets/BarChart')),
    'widgets',
    { description: 'Bar chart for categorical data' }
  );

  componentRegistry.register(
    'LineChart',
    lazy(() => import('../components/widgets/LineChart')),
    'widgets',
    { description: 'Line chart for time series data' }
  );

  componentRegistry.register(
    'PieChart',
    lazy(() => import('../components/widgets/PieChart')),
    'widgets',
    { description: 'Pie chart for proportion data' }
  );

  componentRegistry.register(
    'DonutChart',
    lazy(() => import('../components/widgets/DonutChart')),
    'widgets',
    { description: 'Donut chart for data visualization' }
  );

  componentRegistry.register(
    'ScatterPlot',
    lazy(() => import('../components/widgets/ScatterPlot')),
    'widgets',
    { description: 'Scatter plot for correlation analysis' }
  );

  componentRegistry.register(
    'GaugeChart',
    lazy(() => import('../components/widgets/GaugeChart')),
    'widgets',
    { description: 'Gauge chart for KPI monitoring' }
  );

  componentRegistry.register(
    'Heatmap',
    lazy(() => import('../components/widgets/Heatmap')),
    'widgets',
    { description: 'Heatmap for data density visualization' }
  );

  componentRegistry.register(
    'Treemap',
    lazy(() => import('../components/widgets/Treemap')),
    'widgets',
    { description: 'Treemap for hierarchical data' }
  );

  componentRegistry.register(
    'RealtimeChart',
    lazy(() => import('../components/widgets/RealtimeChart')),
    'widgets',
    { description: 'Real-time data chart' }
  );

  componentRegistry.register(
    'KPICard',
    lazy(() => import('../components/widgets/KPICard')),
    'widgets',
    { description: 'Key Performance Indicator card' }
  );

  componentRegistry.register(
    'DataTable',
    lazy(() => import('../components/widgets/DataTable')),
    'widgets',
    { description: 'Data table with sorting and filtering' }
  );

  componentRegistry.register(
    'Calendar',
    lazy(() => import('../components/widgets/Calendar')),
    'widgets',
    { description: 'Calendar component for date visualization' }
  );

  componentRegistry.register(
    'Timeline',
    lazy(() => import('../components/widgets/Timeline')),
    'widgets',
    { description: 'Timeline component for event tracking' }
  );

  componentRegistry.register(
    'ProgressBar',
    lazy(() => import('../components/widgets/ProgressBar')),
    'widgets',
    { description: 'Progress bar component' }
  );

  componentRegistry.register(
    'WeatherWidget',
    lazy(() => import('../components/widgets/WeatherWidget')),
    'widgets',
    { description: 'Weather forecast widget' }
  );

  // Maps
  componentRegistry.register(
    'InteractiveMap',
    lazy(() => import('../components/data-visualization/maps/InteractiveMap')),
    'maps',
    { description: 'Interactive map component with markers' }
  );

  componentRegistry.register(
    'MapMarkers',
    lazy(() => import('../components/data-visualization/maps/MapMarkers')),
    'maps',
    { description: 'Map markers component' }
  );

  componentRegistry.register(
    'HeatmapOverlay',
    lazy(() => import('../components/data-visualization/maps/HeatmapOverlay')),
    'maps',
    { description: 'Heatmap overlay for maps' }
  );

  componentRegistry.register(
    'LocationFilter',
    lazy(() => import('../components/data-visualization/maps/LocationFilter')),
    'maps',
    { description: 'Location filter component for maps' }
  );

  // Analytics
  componentRegistry.register(
    'DashboardAnalytics',
    lazy(() => import('../components/data-visualization/analytics/DashboardAnalytics')),
    'analytics',
    { description: 'Dashboard analytics component' }
  );

  componentRegistry.register(
    'DashboardSettings',
    lazy(() => import('../components/data-visualization/analytics/DashboardSettings')),
    'analytics',
    { description: 'Dashboard settings component' }
  );

  // Add more component registrations as needed
};

// Initialize registry
registerCommonComponents();

export default componentRegistry;