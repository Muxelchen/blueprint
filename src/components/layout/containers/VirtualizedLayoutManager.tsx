import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// Virtualized Widget System for better performance
export interface VirtualizedWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: any;
  size: { width: number; height: number };
  position: { x: number; y: number };
  visible?: boolean;
  priority?: 'high' | 'medium' | 'low';
  shouldVirtualize?: boolean;
  renderThreshold?: number; // Distance from viewport to start rendering
  minWidth?: number;
  minHeight?: number;
}

export interface VirtualizedLayoutManagerProps {
  widgets: VirtualizedWidget[];
  containerWidth: number;
  containerHeight: number;
  itemMargin?: number;
  overscan?: number; // Number of items to render outside visible area
  enableVirtualization?: boolean;
  onWidgetVisibilityChange?: (widgetId: string, visible: boolean) => void;
  className?: string;
}

// Memoized widget component to prevent unnecessary re-renders
const MemoizedWidget = React.memo<{
  widget: VirtualizedWidget;
  style: React.CSSProperties;
  isVisible: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}>(({ widget, style, isVisible, onVisibilityChange }) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Intersection Observer for precise visibility tracking
  useEffect(() => {
    const element = widgetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsIntersecting(visible);
        onVisibilityChange?.(visible);
      },
      {
        threshold: 0.1,
        rootMargin: '50px', // Start loading before widget enters viewport
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [onVisibilityChange]);

  // Render placeholder for non-visible widgets to maintain layout
  if (!isVisible && widget.shouldVirtualize) {
    return (
      <div
        ref={widgetRef}
        style={style}
        className="bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center"
      >
        <div className="text-sm text-gray-500">Loading {widget.title}...</div>
      </div>
    );
  }

  return (
    <div ref={widgetRef} style={style} className="widget-container transition-all duration-200">
      <widget.component {...widget.props} title={widget.title} />
    </div>
  );
});

// Custom hook for widget visibility calculation
const useVirtualizedWidgets = (
  widgets: VirtualizedWidget[],
  containerBounds: DOMRect | null,
  overscan: number = 2
) => {
  return useMemo(() => {
    if (!containerBounds) return widgets;

    const expandedBounds = {
      top: containerBounds.top - overscan * 100,
      bottom: containerBounds.bottom + overscan * 100,
      left: containerBounds.left - overscan * 100,
      right: containerBounds.right + overscan * 100,
    };

    return widgets.map(widget => {
      const widgetBounds = {
        top: widget.position.y,
        bottom: widget.position.y + widget.size.height,
        left: widget.position.x,
        right: widget.position.x + widget.size.width,
      };

      const isVisible = !(
        widgetBounds.bottom < expandedBounds.top ||
        widgetBounds.top > expandedBounds.bottom ||
        widgetBounds.right < expandedBounds.left ||
        widgetBounds.left > expandedBounds.right
      );

      return {
        ...widget,
        visible: isVisible,
      };
    });
  }, [widgets, containerBounds, overscan]);
};

// Performance monitoring hook
const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    widgetCount: 0,
    virtualizedCount: 0,
  });

  const measureRender = useCallback((fn: () => React.ReactNode): React.ReactNode => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    setMetrics(prev => ({
      ...prev,
      renderTime: end - start,
    }));

    return result;
  }, []);

  const updateMetrics = useCallback((widgets: VirtualizedWidget[]) => {
    const virtualizedCount = widgets.filter(w => w.shouldVirtualize && !w.visible).length;

    setMetrics(prev => ({
      ...prev,
      widgetCount: widgets.length,
      virtualizedCount,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
    }));
  }, []);

  return { metrics, measureRender, updateMetrics };
};

const VirtualizedLayoutManager: React.FC<VirtualizedLayoutManagerProps> = ({
  widgets,
  containerWidth,
  containerHeight,
  itemMargin = 8,
  overscan = 2,
  enableVirtualization = true,
  onWidgetVisibilityChange,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerBounds, setContainerBounds] = useState<DOMRect | null>(null);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const { metrics, measureRender, updateMetrics } = usePerformanceMonitor();

  // Update container bounds on resize
  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        setContainerBounds(containerRef.current.getBoundingClientRect());
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  // Optimize widget visibility calculation
  const virtualizedWidgets = useVirtualizedWidgets(widgets, containerBounds, overscan);

  // Update performance metrics
  useEffect(() => {
    updateMetrics(virtualizedWidgets);
  }, [virtualizedWidgets, updateMetrics]);

  // Scroll handler for better performance
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollPosition({
      x: target.scrollLeft,
      y: target.scrollTop,
    });
  }, []);

  // Enhanced grid-based layout calculation for better performance and widget fitting
  const gridLayout = useMemo(() => {
    const minWidgetWidth = 180; // Increased from 200 for better fitting
    const minWidgetHeight = 150; // Standard minimum height for content visibility
    const cols = Math.max(1, Math.floor(containerWidth / minWidgetWidth));
    const cellWidth = Math.floor(containerWidth / cols);
    const cellHeight = Math.max(minWidgetHeight, 200); // Ensure adequate height

    return virtualizedWidgets.map((widget, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      // Enhanced widget sizing with content-aware dimensions
      const widgetWidth = Math.max(cellWidth - itemMargin * 2, widget.minWidth || 160);
      const widgetHeight = Math.max(cellHeight - itemMargin, widget.minHeight || 120);

      return {
        ...widget,
        position: {
          x: col * cellWidth + itemMargin,
          y: row * cellHeight + itemMargin,
        },
        size: {
          width: widgetWidth,
          height: widgetHeight,
        },
      };
    });
  }, [virtualizedWidgets, containerWidth, itemMargin]);

  // Render widgets with virtualization
  const renderWidgets = useCallback((): React.ReactNode => {
    return measureRender(() => {
      return gridLayout.map(widget => {
        const style: React.CSSProperties = {
          position: 'absolute',
          left: widget.position.x,
          top: widget.position.y,
          width: widget.size.width,
          height: widget.size.height,
          transform: `translate3d(0, 0, 0)`, // GPU acceleration
          willChange: widget.visible ? 'auto' : 'transform', // Optimize for animations
        };

        return (
          <MemoizedWidget
            key={widget.id}
            widget={widget}
            style={style}
            isVisible={widget.visible || !enableVirtualization}
            onVisibilityChange={visible => {
              onWidgetVisibilityChange?.(widget.id, visible);
            }}
          />
        );
      });
    });
  }, [gridLayout, measureRender, enableVirtualization, onWidgetVisibilityChange]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Performance Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-50">
          <div>Render: {metrics.renderTime.toFixed(2)}ms</div>
          <div>Widgets: {metrics.widgetCount}</div>
          <div>Virtualized: {metrics.virtualizedCount}</div>
          <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</div>
        </div>
      )}

      {/* Virtualized Container */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto"
        onScroll={handleScroll}
        style={{
          contain: 'layout style paint', // CSS containment for better performance
          willChange: 'scroll-position',
        }}
      >
        <div
          className="relative"
          style={{
            width: containerWidth,
            height: Math.max(
              containerHeight,
              gridLayout.length > 0
                ? Math.max(...gridLayout.map(w => w.position.y + w.size.height)) + itemMargin
                : 0
            ),
          }}
        >
          {renderWidgets()}
        </div>
      </div>
    </div>
  );
};

// Utility function for throttling (simplified implementation)
function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

export default VirtualizedLayoutManager;
