// Main components export file for easier imports

// Common Components - Buttons
export { default as Button } from './common/buttons/Button';
export { default as IconButton } from './common/buttons/IconButton';
export { default as PrintButton } from './common/buttons/PrintButton';

// Common Components - Inputs
export { default as Checkbox } from './common/inputs/Checkbox';
export { default as DateTimePicker } from './common/inputs/DateTimePicker';
export { default as DragDrop } from './common/inputs/DragDrop';
export { default as DropdownSelect } from './common/inputs/DropdownSelect';
export { default as FileUpload } from './common/inputs/FileUpload';
export { default as InputField } from './common/inputs/InputField';
export { default as LanguageSwitch } from './common/inputs/LanguageSwitch';
export { default as MultiSelect } from './common/inputs/MultiSelect';
export { default as RichTextEditor } from './common/inputs/RichTextEditor';
export { default as Slider } from './common/inputs/Slider';
export { default as ThemeToggle } from './common/inputs/ThemeToggle';
export { default as ToggleSwitch } from './common/inputs/ToggleSwitch';

// Common Components - Display
export { default as Accordion } from './common/display/Accordion';
export { default as BadgeCounter } from './common/display/BadgeCounter';
export { default as Pagination } from './common/display/Pagination';
export { default as StatusIndicator } from './common/display/StatusIndicator';
export { default as Stepper } from './common/display/Stepper';
export { default as TabNavigation } from './common/display/TabNavigation';

// Common Components - Feedback
export { default as AlertBanner } from './common/feedback/AlertBanner';
export { default as ProgressNotification } from './common/feedback/ProgressNotification';
export { default as PushNotification } from './common/feedback/PushNotification';
export { default as ToastNotification } from './common/feedback/ToastNotification';

// Common Components - Overlays
export { default as Dialog } from './common/overlays/Dialog';
export { default as DropdownMenu } from './common/overlays/DropdownMenu';
export { default as Modal } from './common/overlays/Modal';

// Forms - Direct exports from Form component
export { 
  default as Form,
  FormField,
  FormActions,
  FormStatus,
  useFormContext,
  useFormValidation,
  useFormState,
  useFormActions
} from './forms/Form';

// Navigation
export { default as DrawerNav } from './navigation/nav-components/DrawerNav';
export { default as NavBar } from './navigation/nav-components/NavBar';
export { default as NavigationSystem } from './navigation/nav-components/NavigationSystem';
export { default as RouteMapping } from './navigation/routing/RouteMapping';

// Data Visualization
export { default as DashboardAnalytics } from './data-visualization/analytics/DashboardAnalytics';
export { default as HeatmapOverlay } from './data-visualization/maps/HeatmapOverlay';
export { default as InteractiveMap } from './data-visualization/maps/InteractiveMap';
export { default as LocationFilter } from './data-visualization/maps/LocationFilter';
export { default as MapMarkers } from './data-visualization/maps/MapMarkers';

// Layout
export { default as BreadcrumbNav } from './layout/BreadcrumbNav';
export { default as Footer } from './layout/Footer';
export { default as Header } from './layout/Header';
export { default as MainContent } from './layout/MainContent';
export { default as SearchBar } from './layout/SearchBar';
export { default as Sidebar } from './layout/Sidebar';
export { default as AdvancedLayoutManager } from './layout/containers/AdvancedLayoutManager';
export { default as ResizableWidget } from './layout/containers/ResizableWidget';
export { default as WidgetManager } from './layout/containers/WidgetManager';

// Widgets - Direct exports
export { default as AreaChart } from './widgets/AreaChart';
export { default as BarChart } from './widgets/BarChart';
export { default as Calendar } from './widgets/Calendar';
export { default as DataTable } from './widgets/DataTable';
export { default as DonutChart } from './widgets/DonutChart';
export { default as GaugeChart } from './widgets/GaugeChart';
export { default as Heatmap } from './widgets/Heatmap';
export { default as KPICard } from './widgets/KPICard';
export { default as LineChart } from './widgets/LineChart';
export { default as PieChart } from './widgets/PieChart';
export { default as ProgressBar } from './widgets/ProgressBar';
export { default as RealtimeChart } from './widgets/RealtimeChart';
export { default as ScatterPlot } from './widgets/ScatterPlot';
export { default as Timeline } from './widgets/Timeline';
export { default as Treemap } from './widgets/Treemap';
export { default as WeatherWidget } from './widgets/WeatherWidget';