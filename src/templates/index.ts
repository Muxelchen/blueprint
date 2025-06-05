// Template exports for rapid app generation
export { default as DashboardTemplate } from './DashboardTemplate';
export { default as AnalyticsTemplate } from './AnalyticsTemplate';
export { default as DataTableTemplate } from './DataTableTemplate';
export { default as MapDashboardTemplate } from './MapDashboardTemplate';

// Template metadata for the CLI generator
export const templateMetadata = {
  dashboard: {
    name: 'Dashboard Template',
    description: 'General-purpose dashboard with KPIs, charts, and data tables',
    component: 'DashboardTemplate',
    dependencies: ['recharts', 'zustand'],
    features: ['KPI Cards', 'Charts', 'Data Tables', 'Quick Actions']
  },
  analytics: {
    name: 'Analytics Template',
    description: 'Advanced analytics dashboard with real-time charts and metrics',
    component: 'AnalyticsTemplate',
    dependencies: ['recharts', 'chart.js', 'date-fns'],
    features: ['Real-time Charts', 'Goal Tracking', 'Advanced Metrics', 'Heat Maps']
  },
  'data-table': {
    name: 'Data Table Template',
    description: 'Data management with CRUD operations, search, and filtering',
    component: 'DataTableTemplate',
    dependencies: ['react-router-dom'],
    features: ['Advanced Tables', 'Search & Filter', 'CRUD Operations', 'Bulk Actions']
  },
  map: {
    name: 'Map Dashboard Template',
    description: 'Location-based dashboard with interactive maps and geospatial data',
    component: 'MapDashboardTemplate',
    dependencies: ['leaflet', 'react-leaflet'],
    features: ['Interactive Maps', 'Location Tracking', 'Route Optimization', 'Geospatial Analytics']
  }
};

// Template registry for component selection
export const TEMPLATE_REGISTRY = {
  dashboard: {
    name: 'Dashboard Template',
    component: 'DashboardTemplate',
    description: 'General-purpose dashboard with KPIs, charts, and data tables',
    category: 'dashboard'
  },
  analytics: {
    name: 'Analytics Template', 
    component: 'AnalyticsTemplate',
    description: 'Advanced analytics dashboard with real-time charts and metrics',
    category: 'analytics'
  },
  'data-table': {
    name: 'Data Table Template',
    component: 'DataTableTemplate', 
    description: 'Data management with CRUD operations, search, and filtering',
    category: 'data'
  },
  map: {
    name: 'Map Dashboard Template',
    component: 'MapDashboardTemplate',
    description: 'Location-based dashboard with interactive maps and geospatial data',
    category: 'maps'
  }
};