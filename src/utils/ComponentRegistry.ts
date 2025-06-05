import { ComponentType, lazy } from 'react';

// Component registry type definitions with performance enhancements
interface ComponentEntry {
  component: ComponentType<any>;
  category: string;
  metadata?: {
    description?: string;
    version?: string;
    dependencies?: string[];
    preload?: boolean;
    priority?: 'high' | 'medium' | 'low';
    size?: 'small' | 'medium' | 'large';
  };
  preloadPromise?: Promise<ComponentType<any>>;
}

class ComponentRegistry {
  private components = new Map<string, ComponentEntry>();
  private preloadCache = new Map<string, Promise<ComponentType<any> | null>>();
  private loadedComponents = new Set<string>();

  // Enhanced registration with performance metadata
  register(
    name: string, 
    component: ComponentType<any>, 
    category: string,
    metadata: ComponentEntry['metadata'] = {}
  ) {
    const entry: ComponentEntry = {
      component,
      category,
      metadata: {
        preload: false,
        priority: 'medium',
        size: 'medium',
        ...metadata
      }
    };

    this.components.set(name, entry);

    // Auto-preload high priority components
    if (metadata.priority === 'high' || metadata.preload) {
      this.preloadComponent(name);
    }
  }

  // Preload components for better performance
  async preloadComponent(name: string): Promise<ComponentType<any> | null> {
    if (this.loadedComponents.has(name)) {
      return this.get(name);
    }

    if (this.preloadCache.has(name)) {
      return this.preloadCache.get(name)!;
    }

    const entry = this.components.get(name);
    if (!entry) return null;

    const preloadPromise = this.loadComponent(name);
    this.preloadCache.set(name, preloadPromise);
    
    try {
      const component = await preloadPromise;
      this.loadedComponents.add(name);
      return component;
    } catch (error) {
      console.error(`Failed to preload component ${name}:`, error);
      this.preloadCache.delete(name);
      return null;
    }
  }

  // Preload components by category
  async preloadCategory(category: string): Promise<void> {
    const categoryComponents = this.getByCategory(category);
    await Promise.all(
      categoryComponents.map(entry => this.preloadComponent(entry.name))
    );
  }

  // Get components by category with metadata
  getByCategory(category: string): Array<{name: string; entry: ComponentEntry}> {
    return Array.from(this.components.entries())
      .filter(([, entry]) => entry.category === category)
      .map(([name, entry]) => ({ name, entry }));
  }

  // Enhanced component loading with error boundaries
  async loadComponent(name: string): Promise<ComponentType<any> | null> {
    const entry = this.components.get(name);
    if (!entry) return null;

    try {
      const loadedComponent = entry.component;
      // Handle both default and named exports
      const component = (loadedComponent as any).default || loadedComponent;
      
      // Mark as loaded for performance tracking
      this.loadedComponents.add(name);
      
      return component;
    } catch (error) {
      console.error(`Failed to load component ${name}:`, error);
      return null;
    }
  }

  // Performance analytics
  getPerformanceMetrics() {
    return {
      totalComponents: this.components.size,
      loadedComponents: this.loadedComponents.size,
      preloadedComponents: this.preloadCache.size,
      loadRatio: this.loadedComponents.size / this.components.size,
      categoryBreakdown: this.getCategoryBreakdown()
    };
  }

  private getCategoryBreakdown() {
    const breakdown: Record<string, number> = {};
    this.components.forEach(entry => {
      breakdown[entry.category] = (breakdown[entry.category] || 0) + 1;
    });
    return breakdown;
  }

  // Get a component by name
  get(name: string): ComponentType<any> | null {
    const entry = this.components.get(name);
    return entry?.component || null;
  }

  // Get all components
  getAll(): ComponentEntry[] {
    return Array.from(this.components.values());
  }

  has(name: string): boolean {
    return this.components.has(name);
  }

  remove(name: string): boolean {
    this.loadedComponents.delete(name);
    this.preloadCache.delete(name);
    return this.components.delete(name);
  }

  clear(): void {
    this.components.clear();
    this.loadedComponents.clear();
    this.preloadCache.clear();
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