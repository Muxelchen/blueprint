import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { FixedSizeList as List, VariableSizeList, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Performance-optimierte Widget-Virtualisierung
interface VirtualizedWidget {
  id: string;
  component: React.ComponentType<any>;
  props: Record<string, any>;
  height: number;
  priority: 'high' | 'medium' | 'low';
  lazy?: boolean;
  preload?: boolean;
}

interface PerformanceMetrics {
  renderTime: number;
  frameDrops: number;
  memoryUsage: number;
  lastRender: number;
}

// Intelligent Widget Manager mit Virtualisierung
class WidgetVirtualizationManager {
  private widgets = new Map<string, VirtualizedWidget>();
  private metrics = new Map<string, PerformanceMetrics>();
  private visibilityCache = new Set<string>();
  private renderQueue: string[] = [];
  private intersectionObserver?: IntersectionObserver;

  constructor() {
    this.setupIntersectionObserver();
    this.startPerformanceMonitoring();
  }

  private setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const widgetId = entry.target.getAttribute('data-widget-id');
          if (widgetId) {
            if (entry.isIntersecting) {
              this.visibilityCache.add(widgetId);
              this.queueRender(widgetId);
            } else {
              this.visibilityCache.delete(widgetId);
            }
          }
        });
      },
      { 
        rootMargin: '100px',
        threshold: [0, 0.1, 0.5, 1]
      }
    );
  }

  private startPerformanceMonitoring() {
    if ('performance' in window && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'measure' && entry.name.startsWith('widget-render-')) {
            const widgetId = entry.name.replace('widget-render-', '');
            this.updateMetrics(widgetId, {
              renderTime: entry.duration,
              frameDrops: 0,
              memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
              lastRender: Date.now()
            });
          }
        });
      });
      observer.observe({ entryTypes: ['measure'] });
    }
  }

  registerWidget(widget: VirtualizedWidget) {
    this.widgets.set(widget.id, widget);
    if (widget.priority === 'high' || widget.preload) {
      this.queueRender(widget.id);
    }
  }

  private queueRender(widgetId: string) {
    if (!this.renderQueue.includes(widgetId)) {
      const widget = this.widgets.get(widgetId);
      if (widget) {
        // Prioritäts-basierte Einreihung
        const insertIndex = this.renderQueue.findIndex(id => {
          const queuedWidget = this.widgets.get(id);
          return queuedWidget && this.getPriorityValue(queuedWidget.priority) < this.getPriorityValue(widget.priority);
        });
        
        if (insertIndex === -1) {
          this.renderQueue.push(widgetId);
        } else {
          this.renderQueue.splice(insertIndex, 0, widgetId);
        }
      }
    }
  }

  private getPriorityValue(priority: 'high' | 'medium' | 'low'): number {
    return { high: 3, medium: 2, low: 1 }[priority];
  }

  private updateMetrics(widgetId: string, metrics: PerformanceMetrics) {
    this.metrics.set(widgetId, metrics);
  }

  isVisible(widgetId: string): boolean {
    return this.visibilityCache.has(widgetId);
  }

  getMetrics(widgetId: string): PerformanceMetrics | undefined {
    return this.metrics.get(widgetId);
  }

  observeWidget(element: HTMLElement, widgetId: string) {
    element.setAttribute('data-widget-id', widgetId);
    this.intersectionObserver?.observe(element);
  }

  unobserveWidget(element: HTMLElement) {
    this.intersectionObserver?.unobserve(element);
  }

  cleanup() {
    this.intersectionObserver?.disconnect();
  }
}

// Memoized Widget Component mit Performance-Tracking
const VirtualizedWidgetComponent = memo<{
  widget: VirtualizedWidget;
  manager: WidgetVirtualizationManager;
  style?: React.CSSProperties;
}>(({ widget, manager, style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(!widget.lazy);

  useEffect(() => {
    if (ref.current) {
      manager.observeWidget(ref.current, widget.id);
    }
    return () => {
      if (ref.current) {
        manager.unobserveWidget(ref.current);
      }
    };
  }, [widget.id, manager]);

  useEffect(() => {
    if (widget.lazy && manager.isVisible(widget.id) && !isLoaded) {
      setIsLoaded(true);
    }
  }, [widget.lazy, widget.id, manager, isLoaded]);

  const Component = widget.component;

  const handleRender = useCallback(() => {
    if ('performance' in window) {
      performance.mark(`widget-render-${widget.id}-start`);
      
      requestAnimationFrame(() => {
        performance.mark(`widget-render-${widget.id}-end`);
        performance.measure(
          `widget-render-${widget.id}`,
          `widget-render-${widget.id}-start`,
          `widget-render-${widget.id}-end`
        );
      });
    }
  }, [widget.id]);

  useEffect(() => {
    handleRender();
  });

  if (!isLoaded) {
    return (
      <div 
        ref={ref}
        style={{ ...style, height: widget.height }}
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
      >
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div ref={ref} style={style} className="widget-container">
      <Component {...widget.props} />
    </div>
  );
}, areEqual);

// Advanced Drag & Drop System
interface DragDropState {
  isDragging: boolean;
  draggedItem: Layout | null;
  dropZones: DOMRect[];
  ghostPosition: { x: number; y: number } | null;
}

interface AdvancedLayoutProps {
  widgets: VirtualizedWidget[];
  layouts: { [key: string]: Layout[] };
  onLayoutChange?: (layout: Layout[], layouts: { [key: string]: Layout[] }) => void;
  breakpoints?: { [key: string]: number };
  cols?: { [key: string]: number };
  enableVirtualization?: boolean;
  enableAdvancedDragDrop?: boolean;
  performanceMode?: 'high' | 'balanced' | 'battery';
  maxVisibleWidgets?: number;
}

export const AdvancedDashboardLayout: React.FC<AdvancedLayoutProps> = ({
  widgets,
  layouts,
  onLayoutChange,
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  enableVirtualization = true,
  enableAdvancedDragDrop = true,
  performanceMode = 'balanced',
  maxVisibleWidgets = 50
}) => {
  const [dragDropState, setDragDropState] = useState<DragDropState>({
    isDragging: false,
    draggedItem: null,
    dropZones: [],
    ghostPosition: null
  });

  const managerRef = useRef<WidgetVirtualizationManager>();
  
  useEffect(() => {
    if (enableVirtualization) {
      managerRef.current = new WidgetVirtualizationManager();
      
      // Register all widgets
      widgets.forEach(widget => {
        managerRef.current?.registerWidget(widget);
      });
    }

    return () => {
      managerRef.current?.cleanup();
    };
  }, [widgets, enableVirtualization]);

  // Intelligent layout optimization based on performance mode
  const optimizedLayouts = useMemo(() => {
    if (performanceMode === 'battery') {
      // Reduce animations and limit concurrent renders
      return Object.fromEntries(
        Object.entries(layouts).map(([breakpoint, layout]) => [
          breakpoint,
          layout.slice(0, Math.min(layout.length, maxVisibleWidgets / 2))
        ])
      );
    }
    
    if (performanceMode === 'high') {
      return layouts;
    }
    
    // Balanced mode - limit visible widgets
    return Object.fromEntries(
      Object.entries(layouts).map(([breakpoint, layout]) => [
        breakpoint,
        layout.slice(0, maxVisibleWidgets)
      ])
    );
  }, [layouts, performanceMode, maxVisibleWidgets]);

  // Advanced drag handlers with visual feedback
  const handleDragStart = useCallback((layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
    if (!enableAdvancedDragDrop) return;

    setDragDropState(prev => ({
      ...prev,
      isDragging: true,
      draggedItem: newItem,
      ghostPosition: { x: e.clientX, y: e.clientY }
    }));

    // Add visual feedback
    element.style.opacity = '0.7';
    element.style.transform = 'rotate(2deg)';
    
    // Calculate drop zones
    const gridElements = document.querySelectorAll('.react-grid-item');
    const dropZones = Array.from(gridElements).map(el => el.getBoundingClientRect());
    
    setDragDropState(prev => ({ ...prev, dropZones }));
  }, [enableAdvancedDragDrop]);

  const handleDrag = useCallback((layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent) => {
    if (!enableAdvancedDragDrop) return;

    setDragDropState(prev => ({
      ...prev,
      ghostPosition: { x: e.clientX, y: e.clientY }
    }));
  }, [enableAdvancedDragDrop]);

  const handleDragStop = useCallback((layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
    if (!enableAdvancedDragDrop) return;

    // Reset visual feedback
    element.style.opacity = '';
    element.style.transform = '';

    setDragDropState({
      isDragging: false,
      draggedItem: null,
      dropZones: [],
      ghostPosition: null
    });

    onLayoutChange?.(layout, { ...optimizedLayouts, [getCurrentBreakpoint()]: layout });
  }, [enableAdvancedDragDrop, optimizedLayouts, onLayoutChange]);

  const getCurrentBreakpoint = useCallback(() => {
    const width = window.innerWidth;
    for (const [breakpoint, minWidth] of Object.entries(breakpoints).sort(([,a], [,b]) => b - a)) {
      if (width >= minWidth) return breakpoint;
    }
    return 'xxs';
  }, [breakpoints]);

  // Render widgets with virtualization
  const renderWidget = useCallback((widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return null;

    if (enableVirtualization && managerRef.current) {
      return (
        <VirtualizedWidgetComponent
          key={widget.id}
          widget={widget}
          manager={managerRef.current}
        />
      );
    }

    const Component = widget.component;
    return <Component key={widget.id} {...widget.props} />;
  }, [widgets, enableVirtualization]);

  // Generate layout items
  const layoutItems = useMemo(() => {
    const currentBreakpoint = getCurrentBreakpoint();
    const currentLayout = optimizedLayouts[currentBreakpoint] || [];
    
    return currentLayout.map(item => (
      <div key={item.i} data-grid={item}>
        {renderWidget(item.i)}
      </div>
    ));
  }, [optimizedLayouts, getCurrentBreakpoint, renderWidget]);

  // Performance optimization: use requestIdleCallback for non-critical updates
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(() => {
        // Perform non-critical layout optimizations
        if (managerRef.current) {
          // Cleanup unused widgets from memory
          const visibleWidgetIds = new Set(
            Object.values(optimizedLayouts)
              .flat()
              .map(item => item.i)
          );
          
          // Remove widgets that are no longer in any layout
          widgets.forEach(widget => {
            if (!visibleWidgetIds.has(widget.id)) {
              // Cleanup widget resources if needed
            }
          });
        }
      });

      return () => cancelIdleCallback(handle);
    }
  }, [optimizedLayouts, widgets]);

  return (
    <div className="relative">
      {/* Drag Ghost Element */}
      {dragDropState.isDragging && dragDropState.ghostPosition && (
        <div
          className="fixed pointer-events-none z-50 bg-blue-500 bg-opacity-20 border-2 border-blue-500 border-dashed rounded-lg"
          style={{
            left: dragDropState.ghostPosition.x - 50,
            top: dragDropState.ghostPosition.y - 25,
            width: 100,
            height: 50,
            transform: 'rotate(5deg)',
            transition: 'all 0.1s ease-out'
          }}
        />
      )}

      {/* Drop Zone Indicators */}
      {dragDropState.isDragging && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {dragDropState.dropZones.map((zone, index) => (
            <div
              key={index}
              className="absolute border-2 border-green-400 border-dashed bg-green-100 bg-opacity-20 rounded-lg"
              style={{
                left: zone.left,
                top: zone.top,
                width: zone.width,
                height: zone.height
              }}
            />
          ))}
        </div>
      )}

      <ResponsiveGridLayout
        className="layout"
        layouts={optimizedLayouts}
        onLayoutChange={onLayoutChange}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={60}
        isDraggable={true}
        isResizable={true}
        useCSSTransforms={performanceMode !== 'battery'}
        compactType="vertical"
        preventCollision={false}
        margin={[16, 16]}
        containerPadding={[16, 16]}
        // Performance optimizations
        transformScale={performanceMode === 'high' ? 1 : 0.95}
        allowOverlap={false}
        isBounded={true}
      >
        {layoutItems}
      </ResponsiveGridLayout>

      {/* Performance Monitor (nur in Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs">
          <div>Performance Mode: {performanceMode}</div>
          <div>Widgets: {widgets.length}/{maxVisibleWidgets}</div>
          <div>Virtualization: {enableVirtualization ? 'ON' : 'OFF'}</div>
        </div>
      )}
    </div>
  );
};

// Hook für Layout-Management mit Persistence
export const useAdvancedLayout = (
  initialLayouts: { [key: string]: Layout[] },
  storageKey: string = 'dashboard-layouts'
) => {
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : initialLayouts;
    } catch {
      return initialLayouts;
    }
  });

  const [history, setHistory] = useState<{ [key: string]: Layout[] }[]>([initialLayouts]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateLayouts = useCallback((newLayouts: { [key: string]: Layout[] }) => {
    setLayouts(newLayouts);
    
    // Save to localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(newLayouts));
    } catch (error) {
      console.warn('Failed to save layouts to localStorage:', error);
    }

    // Update history for undo/redo
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newLayouts);
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [storageKey, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setLayouts(history[newIndex]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setLayouts(history[newIndex]);
    }
  }, [history, historyIndex]);

  const resetLayouts = useCallback(() => {
    setLayouts(initialLayouts);
    localStorage.removeItem(storageKey);
    setHistory([initialLayouts]);
    setHistoryIndex(0);
  }, [initialLayouts, storageKey]);

  return {
    layouts,
    updateLayouts,
    undo,
    redo,
    resetLayouts,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
};

export default AdvancedDashboardLayout;