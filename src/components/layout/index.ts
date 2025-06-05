// Layout components - organized by category

// Core layout components
export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as Sidebar } from './Sidebar';
export { default as MainContent } from './MainContent';

// Navigation layout components
export { default as BreadcrumbNav } from './BreadcrumbNav';
export { default as SearchBar } from './SearchBar';

// Container components - advanced layout managers
export { 
  AdvancedDashboardLayout,
  DragDropLayoutManager,
  IntelligentLayoutManager,
  ResponsiveLayoutManager,
  VirtualizedLayoutManager,
  WidgetManager,
  ResizableWidget
} from './containers';

// Re-export container types for convenience
export type { 
  DraggableWidget,
  ResponsiveBreakpoints,
  VirtualizedWidget,
  LayoutAlgorithm 
} from './containers';