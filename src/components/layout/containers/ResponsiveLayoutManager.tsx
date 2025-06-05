import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Grid, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Lock,
  Unlock,
  Copy,
  Trash2,
  Plus,
  Minus,
  X,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';

// Enhanced responsive breakpoint system
export interface ResponsiveBreakpoints {
  xs: number;    // 0-575px
  sm: number;    // 576-767px  
  md: number;    // 768-991px
  lg: number;    // 992-1199px
  xl: number;    // 1200-1399px
  xxl: number;   // 1400px+
}

export interface ResponsiveLayoutConfig {
  xs?: LayoutConfig;
  sm?: LayoutConfig; 
  md?: LayoutConfig;
  lg?: LayoutConfig;
  xl?: LayoutConfig;
  xxl?: LayoutConfig;
}

export interface LayoutWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: any;
  // Enhanced responsive constraints
  constraints: {
    xs?: { minW: number; minH: number; maxW: number; maxH: number };
    sm?: { minW: number; minH: number; maxW: number; maxH: number };
    md?: { minW: number; minH: number; maxW: number; maxH: number };
    lg?: { minW: number; minH: number; maxW: number; maxH: number };
    xl?: { minW: number; minH: number; maxW: number; maxH: number };
    xxl?: { minW: number; minH: number; maxW: number; maxH: number };
  };
  resizable?: boolean;
  movable?: boolean;
  removable?: boolean;
  collapsible?: boolean;
  visible?: boolean;
  locked?: boolean;
  category?: string;
  icon?: React.ReactNode;
  description?: string;
  priority?: number; // For responsive reordering
}

export interface LayoutItem {
  id: string;
  widgetId: string;
  // Responsive positioning
  position: {
    xs?: { x: number; y: number; w: number; h: number };
    sm?: { x: number; y: number; w: number; h: number };
    md?: { x: number; y: number; w: number; h: number };
    lg?: { x: number; y: number; w: number; h: number };
    xl?: { x: number; y: number; w: number; h: number };
    xxl?: { x: number; y: number; w: number; h: number };
  };
  collapsed?: boolean;
  zIndex?: number;
  hidden?: {
    xs?: boolean;
    sm?: boolean;
    md?: boolean;
    lg?: boolean;
    xl?: boolean;
    xxl?: boolean;
  };
}

export interface LayoutConfig {
  id: string;
  name: string;
  description?: string;
  items: LayoutItem[];
  // Responsive grid configuration
  grid: {
    xs: { cols: number; rows: number; size: number; gap: number };
    sm: { cols: number; rows: number; size: number; gap: number };
    md: { cols: number; rows: number; size: number; gap: number };
    lg: { cols: number; rows: number; size: number; gap: number };
    xl: { cols: number; rows: number; size: number; gap: number };
    xxl: { cols: number; rows: number; size: number; gap: number };
  };
  locked?: boolean;
  created: Date;
  modified: Date;
}

export interface ResponsiveLayoutManagerProps {
  widgets?: LayoutWidget[];
  initialLayout?: ResponsiveLayoutConfig;
  breakpoints?: ResponsiveBreakpoints;
  showGrid?: boolean;
  showToolbar?: boolean;
  showWidgetLibrary?: boolean;
  allowLayoutSave?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
  snapToGrid?: boolean;
  enableCollisions?: boolean;
  containerPadding?: number;
  onLayoutChange?: (layout: ResponsiveLayoutConfig) => void;
  onWidgetAdd?: (widget: LayoutWidget) => void;
  onWidgetRemove?: (widgetId: string) => void;
  onSaveLayout?: (layout: ResponsiveLayoutConfig) => void;
  className?: string;
}

// Default responsive breakpoints
const defaultBreakpoints: ResponsiveBreakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

// Enhanced sample widgets with responsive constraints
const responsiveSampleWidgets: LayoutWidget[] = [
  {
    id: 'analytics-chart',
    title: 'Analytics Chart',
    component: ({ title }: { title: string }) => (
      <div className="h-full w-full bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-4 rounded-lg overflow-hidden">
        <h3 className="font-semibold text-blue-900 mb-2 sm:mb-4 text-sm sm:text-base">{title}</h3>
        <div className="h-full flex-1 bg-blue-200 rounded animate-pulse min-h-[120px] sm:min-h-[200px]"></div>
      </div>
    ),
    constraints: {
      xs: { minW: 2, minH: 2, maxW: 4, maxH: 4 },
      sm: { minW: 3, minH: 3, maxW: 6, maxH: 5 },
      md: { minW: 3, minH: 3, maxW: 8, maxH: 6 },
      lg: { minW: 4, minH: 3, maxW: 10, maxH: 7 },
      xl: { minW: 4, minH: 3, maxW: 12, maxH: 8 },
      xxl: { minW: 4, minH: 3, maxW: 12, maxH: 8 }
    },
    category: 'Analytics',
    icon: <Grid className="w-4 h-4" />,
    description: 'Responsive analytics chart widget',
    priority: 1
  },
  {
    id: 'kpi-card',
    title: 'KPI Card',
    component: ({ title }: { title: string }) => (
      <div className="h-full w-full bg-gradient-to-br from-green-50 to-green-100 p-2 sm:p-4 rounded-lg flex flex-col overflow-hidden">
        <h3 className="font-semibold text-green-900 mb-1 sm:mb-2 text-xs sm:text-sm truncate">{title}</h3>
        <div className="flex-1 flex flex-col justify-center min-h-0">
          <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-700 mb-1 truncate">$12,345</div>
          <div className="text-xs sm:text-sm text-green-600 truncate">+12% from last month</div>
        </div>
      </div>
    ),
    constraints: {
      xs: { minW: 1, minH: 1, maxW: 2, maxH: 2 },
      sm: { minW: 2, minH: 2, maxW: 3, maxH: 3 },
      md: { minW: 2, minH: 2, maxW: 4, maxH: 3 },
      lg: { minW: 2, minH: 2, maxW: 4, maxH: 3 },
      xl: { minW: 2, minH: 2, maxW: 4, maxH: 3 },
      xxl: { minW: 2, minH: 2, maxW: 4, maxH: 3 }
    },
    category: 'Metrics',
    icon: <Grid className="w-4 h-4" />,
    description: 'Key performance indicator card',
    priority: 2
  },
  {
    id: 'data-table',
    title: 'Data Table',
    component: ({ title }: { title: string }) => (
      <div className="h-full w-full bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        <div className="bg-gray-50 px-2 sm:px-4 py-2 sm:py-3 border-b flex-shrink-0">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{title}</h3>
        </div>
        <div className="flex-1 p-2 sm:p-4 overflow-auto min-h-0">
          <div className="space-y-1 sm:space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex space-x-2 sm:space-x-4 py-1 sm:py-2 border-b border-gray-100">
                <div className="w-12 sm:w-16 h-3 sm:h-4 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                <div className="w-16 sm:w-24 h-3 sm:h-4 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                <div className="flex-1 h-3 sm:h-4 bg-gray-200 rounded animate-pulse min-w-0"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    constraints: {
      xs: { minW: 2, minH: 3, maxW: 4, maxH: 6 },
      sm: { minW: 3, minH: 3, maxW: 6, maxH: 8 },
      md: { minW: 4, minH: 3, maxW: 8, maxH: 8 },
      lg: { minW: 4, minH: 3, maxW: 12, maxH: 8 },
      xl: { minW: 4, minH: 3, maxW: 12, maxH: 8 },
      xxl: { minW: 4, minH: 3, maxW: 12, maxH: 8 }
    },
    category: 'Data',
    icon: <Grid className="w-4 h-4" />,
    description: 'Responsive data table widget',
    priority: 3
  }
];

// Custom hook for responsive breakpoints
const useResponsiveBreakpoint = (breakpoints: ResponsiveBreakpoints) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<keyof ResponsiveBreakpoints>('lg');
  const [containerWidth, setContainerWidth] = useState<number>(1200);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setContainerWidth(width);
      
      if (width >= breakpoints.xxl) setCurrentBreakpoint('xxl');
      else if (width >= breakpoints.xl) setCurrentBreakpoint('xl');
      else if (width >= breakpoints.lg) setCurrentBreakpoint('lg');
      else if (width >= breakpoints.md) setCurrentBreakpoint('md');
      else if (width >= breakpoints.sm) setCurrentBreakpoint('sm');
      else setCurrentBreakpoint('xs');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, [breakpoints]);

  return { currentBreakpoint, containerWidth };
};

const ResponsiveLayoutManager: React.FC<ResponsiveLayoutManagerProps> = ({
  widgets = responsiveSampleWidgets,
  initialLayout,
  breakpoints = defaultBreakpoints,
  showGrid = true,
  showToolbar = true,
  showWidgetLibrary = true,
  allowLayoutSave = true,
  autoSave = true,
  autoSaveInterval = 5000,
  snapToGrid = true,
  enableCollisions = true,
  containerPadding = 16,
  onLayoutChange,
  onWidgetAdd,
  onWidgetRemove,
  onSaveLayout,
  className = ''
}) => {
  const { currentBreakpoint, containerWidth } = useResponsiveBreakpoint(breakpoints);
  
  // Default responsive layout configuration
  const defaultLayout: ResponsiveLayoutConfig = {
    xs: {
      id: 'default-xs',
      name: 'Mobile Layout',
      items: [
        {
          id: 'item-1',
          widgetId: 'kpi-card',
          position: { xs: { x: 0, y: 0, w: 2, h: 2 } }
        },
        {
          id: 'item-2', 
          widgetId: 'analytics-chart',
          position: { xs: { x: 0, y: 2, w: 4, h: 4 } }
        }
      ],
      grid: { 
        xs: { cols: 4, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 4), gap: 8 },
        sm: { cols: 6, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 6), gap: 10 },
        md: { cols: 8, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 8), gap: 12 },
        lg: { cols: 12, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 12), gap: 16 },
        xl: { cols: 12, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 12), gap: 16 },
        xxl: { cols: 12, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 12), gap: 16 }
      },
      created: new Date(),
      modified: new Date()
    },
    md: {
      id: 'default-md',
      name: 'Tablet Layout', 
      items: [
        {
          id: 'item-1',
          widgetId: 'analytics-chart',
          position: { md: { x: 0, y: 0, w: 4, h: 3 } }
        },
        {
          id: 'item-2',
          widgetId: 'kpi-card', 
          position: { md: { x: 4, y: 0, w: 2, h: 2 } }
        },
        {
          id: 'item-3',
          widgetId: 'data-table',
          position: { md: { x: 0, y: 3, w: 6, h: 3 } }
        }
      ],
      grid: {
        xs: { cols: 4, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 4), gap: 8 },
        sm: { cols: 6, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 6), gap: 10 },
        md: { cols: 8, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 8), gap: 12 },
        lg: { cols: 12, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 12), gap: 16 },
        xl: { cols: 12, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 12), gap: 16 },
        xxl: { cols: 12, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 12), gap: 16 }
      },
      created: new Date(),
      modified: new Date()
    },
    lg: {
      id: 'default-lg', 
      name: 'Desktop Layout',
      items: [
        {
          id: 'item-1',
          widgetId: 'analytics-chart',
          position: { lg: { x: 0, y: 0, w: 4, h: 3 } }
        },
        {
          id: 'item-2',
          widgetId: 'kpi-card',
          position: { lg: { x: 4, y: 0, w: 2, h: 2 } }
        },
        {
          id: 'item-3',
          widgetId: 'data-table', 
          position: { lg: { x: 0, y: 3, w: 6, h: 3 } }
        }
      ],
      grid: {
        xs: { cols: 4, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 4), gap: 8 },
        sm: { cols: 6, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 6), gap: 10 },
        md: { cols: 8, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 8), gap: 12 },
        lg: { cols: 12, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 12), gap: 16 },
        xl: { cols: 12, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 12), gap: 16 },
        xxl: { cols: 12, rows: 8, size: Math.floor((containerWidth - containerPadding * 2) / 12), gap: 16 }
      },
      created: new Date(),
      modified: new Date()
    }
  };

  const [layout, setLayout] = useState<ResponsiveLayoutConfig>(initialLayout || defaultLayout);
  const [state, setState] = useState({
    selectedItem: null as string | null,
    draggedItem: null as string | null,
    dragOffset: { x: 0, y: 0 },
    resizingItem: null as string | null,
    resizeDirection: '',
    showLibrary: false,
    viewMode: 'edit' as 'edit' | 'preview',
    zoom: 1,
    savedLayouts: [] as ResponsiveLayoutConfig[],
    showSaveDialog: false,
    layoutName: '',
    previewBreakpoint: currentBreakpoint
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Get current layout for breakpoint
  const currentLayout = useMemo(() => {
    const bp = state.viewMode === 'preview' ? state.previewBreakpoint : currentBreakpoint;
    return layout[bp] || layout.lg || layout.md || Object.values(layout)[0];
  }, [layout, currentBreakpoint, state.viewMode, state.previewBreakpoint]);

  // Get current grid config
  const currentGrid = useMemo(() => {
    const bp = state.viewMode === 'preview' ? state.previewBreakpoint : currentBreakpoint;
    return currentLayout?.grid?.[bp] || currentLayout?.grid?.lg || { cols: 12, rows: 8, size: 50, gap: 16 };
  }, [currentLayout, currentBreakpoint, state.viewMode, state.previewBreakpoint]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && onLayoutChange) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        onLayoutChange(layout);
      }, autoSaveInterval);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [layout, autoSave, autoSaveInterval, onLayoutChange]);

  // Update grid size when container width changes
  useEffect(() => {
    if (currentGrid && containerWidth && currentLayout) {
      const newSize = Math.floor((containerWidth - containerPadding * 2) / currentGrid.cols);
      if (Math.abs(newSize - currentGrid.size) > 2) {
        setLayout(prev => ({
          ...prev,
          [currentBreakpoint]: {
            ...currentLayout,
            grid: {
              ...currentLayout.grid,
              [currentBreakpoint]: {
                ...currentGrid,
                size: newSize
              }
            }
          }
        }));
      }
    }
  }, [containerWidth, currentGrid.cols, containerPadding, currentBreakpoint, currentLayout, currentGrid.size]); // Fixed: added missing dependencies

  const snapToGridSize = useCallback((value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / currentGrid.size) * currentGrid.size;
  }, [snapToGrid, currentGrid.size]);

  const checkCollision = useCallback((item: LayoutItem, newX: number, newY: number, newW?: number, newH?: number): boolean => {
    if (!enableCollisions || !currentLayout) return false;

    const bp = state.viewMode === 'preview' ? state.previewBreakpoint : currentBreakpoint;
    const itemPos = item.position[bp];
    if (!itemPos) return false;

    const itemWidth = newW || itemPos.w;
    const itemHeight = newH || itemPos.h;

    return currentLayout.items.some((otherItem: LayoutItem) => {
      if (otherItem.id === item.id) return false;
      
      const otherPos = otherItem.position[bp];
      if (!otherPos) return false;
      
      return !(
        newX >= otherPos.x + otherPos.w ||
        newX + itemWidth <= otherPos.x ||
        newY >= otherPos.y + otherPos.h ||
        newY + itemHeight <= otherPos.y
      );
    });
  }, [currentLayout, enableCollisions, currentBreakpoint, state.viewMode, state.previewBreakpoint]);

  // Enhanced responsive grid calculation with better widget fitting
  const getResponsiveContainerStyle = useCallback(() => {
    const availableWidth = containerWidth - containerPadding * 2;
    const minColumnWidth = 80; // Increased from 60px for better widget content fit
    const actualCols = Math.min(currentGrid.cols, Math.floor(availableWidth / minColumnWidth));
    const actualSize = Math.floor(availableWidth / actualCols);
    
    // Ensure minimum viable widget sizes
    const adjustedSize = Math.max(actualSize, 120); // Minimum 120px per grid unit
    const adjustedCols = Math.floor(availableWidth / adjustedSize);
    
    return {
      width: adjustedCols * adjustedSize,
      height: Math.max(currentGrid.rows * adjustedSize, 600), // Minimum container height
      gridSize: adjustedSize,
      cols: adjustedCols,
      gap: Math.max(currentGrid.gap, 12) // Minimum gap for better spacing
    };
  }, [containerWidth, containerPadding, currentGrid]);

  const containerStyle = getResponsiveContainerStyle();

  const renderResponsiveToolbar = () => {
    if (!showToolbar) return null;

    return (
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setState(prev => ({ ...prev, viewMode: prev.viewMode === 'edit' ? 'preview' : 'edit' }))}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                state.viewMode === 'edit'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {state.viewMode === 'edit' ? 'Edit Mode' : 'Preview Mode'}
            </button>
            
            {state.viewMode === 'preview' && (
              <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
                {(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const).map((bp) => (
                  <button
                    key={bp}
                    onClick={() => setState(prev => ({ ...prev, previewBreakpoint: bp }))}
                    className={`p-1 rounded text-xs transition-colors ${
                      state.previewBreakpoint === bp
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title={`${bp.toUpperCase()} (${breakpoints[bp]}px+)`}
                  >
                    {bp === 'xs' && <Smartphone className="w-3 h-3" />}
                    {(bp === 'sm' || bp === 'md') && <Tablet className="w-3 h-3" />}
                    {(bp === 'lg' || bp === 'xl' || bp === 'xxl') && <Monitor className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded">
            {currentBreakpoint.toUpperCase()} • {containerWidth}px • {containerStyle.cols}×{currentGrid.rows}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {allowLayoutSave && (
            <button
              onClick={() => setState(prev => ({ ...prev, showSaveDialog: true }))}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Save Layout
            </button>
          )}
          
          <button
            onClick={() => setLayout(defaultLayout)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Reset Layout"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderResponsiveWidget = (item: LayoutItem) => {
    const widget = widgets.find(w => w.id === item.widgetId);
    if (!widget) return null;

    const bp = state.viewMode === 'preview' ? state.previewBreakpoint : currentBreakpoint;
    const itemPos = item.position[bp];
    if (!itemPos) return null;

    // Check if widget should be hidden at this breakpoint
    if (item.hidden?.[bp]) return null;

    const isSelected = state.selectedItem === item.id;
    const isDragging = state.draggedItem === item.id;
    const isLocked = widget.locked || currentLayout?.locked;

    const style = {
      left: itemPos.x * containerStyle.gridSize,
      top: itemPos.y * containerStyle.gridSize,
      width: itemPos.w * containerStyle.gridSize - containerStyle.gap,
      height: itemPos.h * containerStyle.gridSize - containerStyle.gap,
      zIndex: item.zIndex || 1,
      transform: state.viewMode === 'preview' ? `scale(${state.zoom})` : undefined
    };

    return (
      <div
        key={`${item.id}-${bp}`}
        className={`absolute border-2 rounded-lg transition-all duration-200 bg-white ${
          isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
        } ${isDragging ? 'opacity-75 cursor-grabbing' : 'cursor-pointer'}
        ${isLocked ? 'opacity-75' : ''}
        ${item.collapsed ? 'h-10' : ''}`}
        style={style}
        onClick={() => setState(prev => ({ ...prev, selectedItem: item.id }))}
      >
        {/* Widget Header (Edit Mode) */}
        {state.viewMode === 'edit' && (
          <div className="absolute -top-8 left-0 right-0 flex items-center justify-between bg-white border border-gray-200 rounded-t px-2 py-1 text-xs z-10">
            <div className="flex items-center space-x-1">
              {widget.icon && <div>{widget.icon}</div>}
              <span className="font-medium truncate">{widget.title}</span>
              {isLocked && <Lock className="w-3 h-3 text-gray-400" />}
              <span className="text-gray-400">({itemPos.w}×{itemPos.h})</span>
            </div>
          </div>
        )}

        {/* Widget Content */}
        {!item.collapsed && (
          <div className="h-full overflow-hidden min-h-0">
            <widget.component title={widget.title} {...widget.props} />
          </div>
        )}

        {/* Resize Handles (Edit Mode) */}
        {state.viewMode === 'edit' && !isLocked && widget.resizable !== false && isSelected && !item.collapsed && (
          <>
            <div
              className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize z-20"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Handle resize start
              }}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col bg-gray-50 ${className}`}>
      {renderResponsiveToolbar()}
      
      <div className="flex-1 relative overflow-hidden" style={{ padding: containerPadding }}>
        <div
          ref={containerRef}
          className="relative h-full overflow-auto"
          style={{ maxWidth: '100%' }}
        >
          {/* Grid */}
          {showGrid && state.viewMode === 'edit' && (
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: `${containerStyle.gridSize}px ${containerStyle.gridSize}px`,
                width: containerStyle.width,
                height: containerStyle.height
              }}
            />
          )}

          {/* Layout Container */}
          <div
            className="relative mx-auto"
            style={{
              width: containerStyle.width,
              height: containerStyle.height,
              minHeight: '100%'
            }}
          >
            {currentLayout?.items.map(renderResponsiveWidget)}
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      {state.showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save Responsive Layout</h3>
            <input
              type="text"
              placeholder="Layout name"
              value={state.layoutName}
              onChange={(e) => setState(prev => ({ ...prev, layoutName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setState(prev => ({ ...prev, showSaveDialog: false, layoutName: '' }))}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const layoutToSave = {
                    ...layout,
                    id: `layout-${Date.now()}`,
                    name: state.layoutName || `Layout ${Date.now()}`
                  };
                  onSaveLayout?.(layoutToSave);
                  setState(prev => ({ ...prev, showSaveDialog: false, layoutName: '' }));
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveLayoutManager;