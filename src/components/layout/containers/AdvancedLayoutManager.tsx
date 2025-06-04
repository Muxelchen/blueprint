import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Grid, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Settings, 
  Save, 
  Download, 
  Upload,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Move,
  Copy,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';

export interface LayoutWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: any;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  resizable?: boolean;
  movable?: boolean;
  removable?: boolean;
  collapsible?: boolean;
  visible?: boolean;
  locked?: boolean;
  category?: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface LayoutItem {
  id: string;
  widgetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  collapsed?: boolean;
  zIndex?: number;
}

export interface LayoutConfig {
  id: string;
  name: string;
  description?: string;
  items: LayoutItem[];
  gridSize: number;
  cols: number;
  rows: number;
  gap: number;
  locked?: boolean;
  created: Date;
  modified: Date;
}

export interface AdvancedLayoutManagerProps {
  widgets?: LayoutWidget[];
  initialLayout?: LayoutConfig;
  gridSize?: number;
  cols?: number;
  rows?: number;
  gap?: number;
  showGrid?: boolean;
  showToolbar?: boolean;
  showWidgetLibrary?: boolean;
  allowLayoutSave?: boolean;
  allowLayoutLoad?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
  snapToGrid?: boolean;
  enableCollisions?: boolean;
  onLayoutChange?: (layout: LayoutConfig) => void;
  onWidgetAdd?: (widget: LayoutWidget) => void;
  onWidgetRemove?: (widgetId: string) => void;
  onSaveLayout?: (layout: LayoutConfig) => void;
  onLoadLayout?: (layoutId: string) => void;
  className?: string;
}

// Sample widgets for demonstration
const sampleWidgets: LayoutWidget[] = [
  {
    id: 'analytics-chart',
    title: 'Analytics Chart',
    component: ({ title }: { title: string }) => (
      <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">{title}</h3>
        <div className="h-32 bg-blue-200 rounded animate-pulse"></div>
      </div>
    ),
    minWidth: 2,
    minHeight: 2,
    category: 'Analytics',
    icon: <Grid className="w-4 h-4" />,
    description: 'Interactive analytics chart widget'
  },
  {
    id: 'kpi-card',
    title: 'KPI Card',
    component: ({ title }: { title: string }) => (
      <div className="h-full bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">{title}</h3>
        <div className="text-2xl font-bold text-green-700">$12,345</div>
        <div className="text-sm text-green-600">+12% from last month</div>
      </div>
    ),
    minWidth: 1,
    minHeight: 1,
    category: 'Metrics',
    icon: <Grid className="w-4 h-4" />,
    description: 'Key performance indicator card'
  },
  {
    id: 'data-table',
    title: 'Data Table',
    component: ({ title }: { title: string }) => (
      <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-4 py-2 border-b border-gray-100">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    minWidth: 3,
    minHeight: 2,
    category: 'Data',
    icon: <Grid className="w-4 h-4" />,
    description: 'Sortable data table widget'
  }
];

const AdvancedLayoutManager: React.FC<AdvancedLayoutManagerProps> = ({
  widgets = sampleWidgets,
  initialLayout,
  gridSize = 50,
  cols = 12,
  rows = 8,
  gap = 8,
  showGrid = true,
  showToolbar = true,
  showWidgetLibrary = true,
  allowLayoutSave = true,
  allowLayoutLoad = true,
  autoSave = true,
  autoSaveInterval = 5000,
  snapToGrid = true,
  enableCollisions = true,
  onLayoutChange,
  onWidgetAdd,
  onWidgetRemove,
  onSaveLayout,
  onLoadLayout,
  className = ''
}) => {
  const [layout, setLayout] = useState<LayoutConfig>(
    initialLayout || {
      id: 'default',
      name: 'Default Layout',
      items: [
        {
          id: 'item-1',
          widgetId: 'analytics-chart',
          x: 0,
          y: 0,
          width: 4,
          height: 3
        },
        {
          id: 'item-2',
          widgetId: 'kpi-card',
          x: 4,
          y: 0,
          width: 2,
          height: 2
        },
        {
          id: 'item-3',
          widgetId: 'data-table',
          x: 0,
          y: 3,
          width: 6,
          height: 3
        }
      ],
      gridSize,
      cols,
      rows,
      gap,
      created: new Date(),
      modified: new Date()
    }
  );

  const [state, setState] = useState({
    selectedItem: null as string | null,
    draggedItem: null as string | null,
    dragOffset: { x: 0, y: 0 },
    resizingItem: null as string | null,
    resizeDirection: '',
    showLibrary: false,
    viewMode: 'edit' as 'edit' | 'preview',
    zoom: 1,
    savedLayouts: [] as LayoutConfig[],
    showSaveDialog: false,
    layoutName: ''
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

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

  const snapToGridSize = useCallback((value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  const checkCollision = useCallback((item: LayoutItem, newX: number, newY: number, newWidth?: number, newHeight?: number): boolean => {
    if (!enableCollisions) return false;

    const itemWidth = newWidth || item.width;
    const itemHeight = newHeight || item.height;

    return layout.items.some(otherItem => {
      if (otherItem.id === item.id) return false;
      
      return !(
        newX >= otherItem.x + otherItem.width ||
        newX + itemWidth <= otherItem.x ||
        newY >= otherItem.y + otherItem.height ||
        newY + itemHeight <= otherItem.y
      );
    });
  }, [layout.items, enableCollisions]);

  const updateLayoutItem = useCallback((itemId: string, updates: Partial<LayoutItem>) => {
    setLayout(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
      modified: new Date()
    }));
  }, []);

  const addWidget = useCallback((widgetId: string, x?: number, y?: number) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;

    const newItem: LayoutItem = {
      id: `item-${Date.now()}`,
      widgetId,
      x: x || 0,
      y: y || 0,
      width: widget.minWidth || 2,
      height: widget.minHeight || 2
    };

    // Find empty space if position not specified
    if (x === undefined || y === undefined) {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (!checkCollision(newItem, col, row)) {
            newItem.x = col;
            newItem.y = row;
            break;
          }
        }
        if (newItem.x !== undefined) break;
      }
    }

    setLayout(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      modified: new Date()
    }));

    onWidgetAdd?.(widget);
  }, [widgets, rows, cols, checkCollision, onWidgetAdd]);

  const removeWidget = useCallback((itemId: string) => {
    const item = layout.items.find(i => i.id === itemId);
    if (item) {
      setLayout(prev => ({
        ...prev,
        items: prev.items.filter(i => i.id !== itemId),
        modified: new Date()
      }));
      onWidgetRemove?.(item.widgetId);
    }
  }, [layout.items, onWidgetRemove]);

  const duplicateWidget = useCallback((itemId: string) => {
    const item = layout.items.find(i => i.id === itemId);
    if (!item) return;

    const newItem: LayoutItem = {
      ...item,
      id: `item-${Date.now()}`,
      x: Math.min(item.x + 1, cols - item.width),
      y: Math.min(item.y + 1, rows - item.height)
    };

    setLayout(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      modified: new Date()
    }));
  }, [layout.items, cols, rows]);

  const saveLayout = useCallback((name?: string) => {
    const layoutToSave = {
      ...layout,
      id: `layout-${Date.now()}`,
      name: name || state.layoutName || `Layout ${Date.now()}`,
      modified: new Date()
    };

    setState(prev => ({
      ...prev,
      savedLayouts: [...prev.savedLayouts, layoutToSave],
      showSaveDialog: false,
      layoutName: ''
    }));

    onSaveLayout?.(layoutToSave);
  }, [layout, state.layoutName, onSaveLayout]);

  const loadLayout = useCallback((layoutId: string) => {
    const savedLayout = state.savedLayouts.find(l => l.id === layoutId);
    if (savedLayout) {
      setLayout(savedLayout);
      onLoadLayout?.(layoutId);
    }
  }, [state.savedLayouts, onLoadLayout]);

  const resetLayout = useCallback(() => {
    setLayout(prev => ({
      ...prev,
      items: [],
      modified: new Date()
    }));
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, itemId: string, action: 'drag' | 'resize', direction?: string) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setState(prev => ({
      ...prev,
      selectedItem: itemId,
      ...(action === 'drag' && {
        draggedItem: itemId,
        dragOffset: { x: offsetX, y: offsetY }
      }),
      ...(action === 'resize' && {
        resizingItem: itemId,
        resizeDirection: direction || ''
      })
    }));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!state.draggedItem && !state.resizingItem) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (state.draggedItem) {
      const item = layout.items.find(i => i.id === state.draggedItem);
      if (!item) return;

      const newX = snapToGridSize(mouseX - state.dragOffset.x) / gridSize;
      const newY = snapToGridSize(mouseY - state.dragOffset.y) / gridSize;

      const boundedX = Math.max(0, Math.min(newX, cols - item.width));
      const boundedY = Math.max(0, Math.min(newY, rows - item.height));

      if (!checkCollision(item, boundedX, boundedY)) {
        updateLayoutItem(state.draggedItem, {
          x: boundedX,
          y: boundedY
        });
      }
    }

    if (state.resizingItem) {
      const item = layout.items.find(i => i.id === state.resizingItem);
      if (!item) return;

      const widget = widgets.find(w => w.id === item.widgetId);
      const minWidth = widget?.minWidth || 1;
      const minHeight = widget?.minHeight || 1;
      const maxWidth = widget?.maxWidth || cols;
      const maxHeight = widget?.maxHeight || rows;

      let newWidth = item.width;
      let newHeight = item.height;

      if (state.resizeDirection.includes('right')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, snapToGridSize(mouseX) / gridSize - item.x));
      }
      if (state.resizeDirection.includes('bottom')) {
        newHeight = Math.max(minHeight, Math.min(maxHeight, snapToGridSize(mouseY) / gridSize - item.y));
      }

      // Ensure item doesn't go out of bounds
      newWidth = Math.min(newWidth, cols - item.x);
      newHeight = Math.min(newHeight, rows - item.y);

      if (!checkCollision(item, item.x, item.y, newWidth, newHeight)) {
        updateLayoutItem(state.resizingItem, {
          width: newWidth,
          height: newHeight
        });
      }
    }
  }, [
    state.draggedItem,
    state.resizingItem,
    state.dragOffset,
    state.resizeDirection,
    layout.items,
    snapToGridSize,
    gridSize,
    cols,
    rows,
    checkCollision,
    updateLayoutItem,
    widgets
  ]);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({
      ...prev,
      draggedItem: null,
      resizingItem: null,
      resizeDirection: '',
      dragOffset: { x: 0, y: 0 }
    }));
  }, []);

  const renderWidget = (item: LayoutItem) => {
    const widget = widgets.find(w => w.id === item.widgetId);
    if (!widget || !widget.visible !== false) return null;

    const isSelected = state.selectedItem === item.id;
    const isDragging = state.draggedItem === item.id;
    const isResizing = state.resizingItem === item.id;
    const isLocked = widget.locked || layout.locked;

    const style = {
      left: item.x * gridSize,
      top: item.y * gridSize,
      width: item.width * gridSize - gap,
      height: item.height * gridSize - gap,
      zIndex: item.zIndex || 1,
      transform: state.viewMode === 'preview' ? `scale(${state.zoom})` : undefined
    };

    return (
      <div
        key={item.id}
        className={`absolute border-2 rounded-lg transition-all duration-200 ${
          isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
        } ${isDragging ? 'opacity-75 cursor-grabbing' : 'cursor-pointer'}
        ${isLocked ? 'opacity-75' : ''}
        ${item.collapsed ? 'h-10' : ''}`}
        style={style}
        onClick={() => setState(prev => ({ ...prev, selectedItem: item.id }))}
        onMouseDown={
          !isLocked && widget.movable !== false && state.viewMode === 'edit'
            ? (e) => handleMouseDown(e, item.id, 'drag')
            : undefined
        }
      >
        {/* Widget Header */}
        {state.viewMode === 'edit' && (
          <div className="absolute -top-8 left-0 right-0 flex items-center justify-between bg-white border border-gray-200 rounded-t px-2 py-1 text-xs">
            <div className="flex items-center space-x-1">
              {widget.icon && <div>{widget.icon}</div>}
              <span className="font-medium">{widget.title}</span>
              {isLocked && <Lock className="w-3 h-3 text-gray-400" />}
            </div>
            <div className="flex items-center space-x-1">
              {widget.collapsible && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateLayoutItem(item.id, { collapsed: !item.collapsed });
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {item.collapsed ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateWidget(item.id);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Copy className="w-3 h-3" />
              </button>
              {widget.removable !== false && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWidget(item.id);
                  }}
                  className="p-1 hover:bg-gray-100 rounded text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Widget Content */}
        {!item.collapsed && (
          <div className="h-full overflow-hidden">
            <widget.component title={widget.title} {...widget.props} />
          </div>
        )}

        {/* Resize Handles */}
        {state.viewMode === 'edit' && !isLocked && widget.resizable !== false && isSelected && !item.collapsed && (
          <>
            <div
              className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
              onMouseDown={(e) => handleMouseDown(e, item.id, 'resize', 'bottom-right')}
            />
            <div
              className="absolute bottom-0 right-1 left-1 h-1 bg-blue-300 cursor-s-resize"
              onMouseDown={(e) => handleMouseDown(e, item.id, 'resize', 'bottom')}
            />
            <div
              className="absolute top-1 bottom-1 right-0 w-1 bg-blue-300 cursor-e-resize"
              onMouseDown={(e) => handleMouseDown(e, item.id, 'resize', 'right')}
            />
          </>
        )}
      </div>
    );
  };

  const renderToolbar = () => {
    if (!showToolbar) return null;

    return (
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
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
            {state.viewMode === 'edit' && (
              <button
                onClick={() => setState(prev => ({ ...prev, showLibrary: !prev.showLibrary }))}
                className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition-colors"
              >
                Widget Library
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={resetLayout}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Reset Layout"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout(prev => ({ ...prev, locked: !prev.locked }))}
              className={`p-2 rounded transition-colors ${
                layout.locked
                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={layout.locked ? 'Unlock Layout' : 'Lock Layout'}
            >
              {layout.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {allowLayoutSave && (
            <button
              onClick={() => setState(prev => ({ ...prev, showSaveDialog: true }))}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Save Layout
            </button>
          )}
          {state.viewMode === 'preview' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setState(prev => ({ ...prev, zoom: Math.max(0.5, prev.zoom - 0.1) }))}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 min-w-[4rem] text-center">
                {Math.round(state.zoom * 100)}%
              </span>
              <button
                onClick={() => setState(prev => ({ ...prev, zoom: Math.min(2, prev.zoom + 0.1) }))}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWidgetLibrary = () => {
    if (!showWidgetLibrary || !state.showLibrary || state.viewMode !== 'edit') return null;

    const categories = [...new Set(widgets.map(w => w.category || 'General'))];

    return (
      <div className="absolute top-0 right-0 w-80 h-full bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Widget Library</h3>
            <button
              onClick={() => setState(prev => ({ ...prev, showLibrary: false }))}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">{category}</h4>
              <div className="grid grid-cols-2 gap-3">
                {widgets
                  .filter(w => (w.category || 'General') === category)
                  .map(widget => (
                    <div
                      key={widget.id}
                      onClick={() => addWidget(widget.id)}
                      className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center mb-2">
                        {widget.icon && <div className="mr-2">{widget.icon}</div>}
                        <div className="text-sm font-medium truncate">{widget.title}</div>
                      </div>
                      {widget.description && (
                        <div className="text-xs text-gray-500">{widget.description}</div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSaveDialog = () => {
    if (!state.showSaveDialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h3 className="text-lg font-semibold mb-4">Save Layout</h3>
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
              onClick={() => saveLayout()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col bg-gray-50 ${className}`}>
      {renderToolbar()}
      
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={containerRef}
          className="relative h-full overflow-auto"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid */}
          {showGrid && state.viewMode === 'edit' && (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: `${gridSize}px ${gridSize}px`
              }}
            />
          )}

          {/* Layout Container */}
          <div
            className="relative"
            style={{
              width: cols * gridSize,
              height: rows * gridSize,
              minHeight: '100%'
            }}
          >
            {layout.items.map(renderWidget)}
          </div>
        </div>

        {renderWidgetLibrary()}
      </div>

      {renderSaveDialog()}
    </div>
  );
};

export default AdvancedLayoutManager;