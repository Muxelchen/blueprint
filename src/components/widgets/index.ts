// Widget Components - Organized by Category
// Professional widget system for data visualization and user interaction

// =============================================================================
// 📊 CHART & VISUALIZATION WIDGETS
// =============================================================================
export { default as AreaChart } from './AreaChart';
export { default as BarChart } from './BarChart';
export { default as DonutChart } from './DonutChart';
export { default as GaugeChart } from './GaugeChart';
export { default as Heatmap } from './Heatmap';
export { default as LineChart } from './LineChart';
export { default as PieChart } from './PieChart';
export { default as RealtimeChart } from './RealtimeChart';
export { default as ScatterPlot } from './ScatterPlot';
export { default as Treemap } from './Treemap';

// =============================================================================
// 📋 DATA DISPLAY & METRICS WIDGETS
// =============================================================================
export { default as DataTable } from './DataTable';
export { default as KPICard } from './KPICard';
export { default as Timeline } from './Timeline';

// =============================================================================
// 🎛️ INTERACTIVE & UTILITY WIDGETS
// =============================================================================
export { default as Calendar } from './Calendar';
export { default as ProgressBar } from './ProgressBar';
export { default as WeatherWidget } from './WeatherWidget';

// =============================================================================
// 📦 WIDGET COLLECTIONS & UTILITIES
// =============================================================================

// Re-export common props and types for convenience
// Note: Widget types are available from @/types/widgets

// Widget categories for programmatic access
export const WIDGET_CATEGORIES = {
  CHARTS: ['AreaChart', 'BarChart', 'DonutChart', 'GaugeChart', 'Heatmap', 'LineChart', 'PieChart', 'RealtimeChart', 'ScatterPlot', 'Treemap'],
  DATA_DISPLAY: ['DataTable', 'KPICard', 'Timeline'],
  INTERACTIVE: ['Calendar', 'ProgressBar', 'WeatherWidget'],
} as const;

// Widget metadata for development tools
export const WIDGET_METADATA = {
  totalCount: 17,
  categories: Object.keys(WIDGET_CATEGORIES).length,
  lastUpdated: '2024-01-15', // Update when adding new widgets
} as const;
