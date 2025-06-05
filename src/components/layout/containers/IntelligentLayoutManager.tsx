import React, { useMemo, useCallback } from 'react';

// Advanced layout algorithms for intelligent widget arrangement
export interface LayoutAlgorithm {
  id: string;
  name: string;
  description: string;
  apply: (widgets: LayoutWidget[], containerSize: { width: number; height: number }) => LayoutWidget[];
  priority: number;
  category: 'auto' | 'grid' | 'flow' | 'custom';
}

export interface LayoutWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  size: { width: number; height: number };
  position: { x: number; y: number };
  priority?: number;
  category?: string;
  constraints?: {
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    aspectRatio?: number;
    sticky?: boolean;
  };
}

export interface IntelligentLayoutManagerProps {
  widgets: LayoutWidget[];
  containerSize: { width: number; height: number };
  algorithm?: string;
  enableAutoLayout?: boolean;
  spacing?: number;
  padding?: number;
  onLayoutChange?: (widgets: LayoutWidget[]) => void;
  className?: string;
}

// Bin Packing Algorithm for optimal space utilization
class BinPacker {
  static pack(widgets: LayoutWidget[], containerWidth: number, containerHeight: number, spacing: number = 16): LayoutWidget[] {
    const sortedWidgets = [...widgets].sort((a, b) => {
      // Sort by area (largest first) then by height
      const aArea = a.size.width * a.size.height;
      const bArea = b.size.width * b.size.height;
      if (aArea !== bArea) return bArea - aArea;
      return b.size.height - a.size.height;
    });

    const packedWidgets: LayoutWidget[] = [];
    const freeRectangles: Rectangle[] = [{ x: 0, y: 0, width: containerWidth, height: containerHeight }];

    for (const widget of sortedWidgets) {
      const position = this.findBestPosition(widget.size, freeRectangles, spacing);
      
      if (position) {
        const packedWidget = {
          ...widget,
          position: { x: position.x, y: position.y }
        };
        packedWidgets.push(packedWidget);

        // Update free rectangles
        this.updateFreeRectangles(freeRectangles, {
          x: position.x,
          y: position.y,
          width: widget.size.width + spacing,
          height: widget.size.height + spacing
        });
      } else {
        // Widget doesn't fit, place at bottom
        const y = Math.max(0, ...packedWidgets.map(w => w.position.y + w.size.height)) + spacing;
        packedWidgets.push({
          ...widget,
          position: { x: 0, y }
        });
      }
    }

    return packedWidgets;
  }

  private static findBestPosition(
    size: { width: number; height: number },
    freeRectangles: Rectangle[],
    spacing: number
  ): { x: number; y: number } | null {
    let bestPosition: { x: number; y: number } | null = null;
    let bestScore = Infinity;

    for (const rect of freeRectangles) {
      if (rect.width >= size.width + spacing && rect.height >= size.height + spacing) {
        // Bottom-left scoring
        const score = rect.y + rect.x * 0.1;
        if (score < bestScore) {
          bestScore = score;
          bestPosition = { x: rect.x, y: rect.y };
        }
      }
    }

    return bestPosition;
  }

  private static updateFreeRectangles(freeRectangles: Rectangle[], usedRect: Rectangle): void {
    for (let i = freeRectangles.length - 1; i >= 0; i--) {
      const rect = freeRectangles[i];
      
      if (this.rectanglesOverlap(rect, usedRect)) {
        freeRectangles.splice(i, 1);
        
        // Create new rectangles from the split
        const newRects = this.splitRectangle(rect, usedRect);
        freeRectangles.push(...newRects);
      }
    }

    // Remove duplicate and contained rectangles
    this.cleanupRectangles(freeRectangles);
  }

  private static rectanglesOverlap(rect1: Rectangle, rect2: Rectangle): boolean {
    return !(rect1.x >= rect2.x + rect2.width ||
             rect1.x + rect1.width <= rect2.x ||
             rect1.y >= rect2.y + rect2.height ||
             rect1.y + rect1.height <= rect2.y);
  }

  private static splitRectangle(rect: Rectangle, usedRect: Rectangle): Rectangle[] {
    const newRects: Rectangle[] = [];

    // Left split
    if (usedRect.x > rect.x) {
      newRects.push({
        x: rect.x,
        y: rect.y,
        width: usedRect.x - rect.x,
        height: rect.height
      });
    }

    // Right split
    if (usedRect.x + usedRect.width < rect.x + rect.width) {
      newRects.push({
        x: usedRect.x + usedRect.width,
        y: rect.y,
        width: rect.x + rect.width - (usedRect.x + usedRect.width),
        height: rect.height
      });
    }

    // Top split
    if (usedRect.y > rect.y) {
      newRects.push({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: usedRect.y - rect.y
      });
    }

    // Bottom split
    if (usedRect.y + usedRect.height < rect.y + rect.height) {
      newRects.push({
        x: rect.x,
        y: usedRect.y + usedRect.height,
        width: rect.width,
        height: rect.y + rect.height - (usedRect.y + usedRect.height)
      });
    }

    return newRects.filter(r => r.width > 0 && r.height > 0);
  }

  private static cleanupRectangles(rectangles: Rectangle[]): void {
    for (let i = rectangles.length - 1; i >= 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (this.rectangleContains(rectangles[j], rectangles[i])) {
          rectangles.splice(i, 1);
          break;
        } else if (this.rectangleContains(rectangles[i], rectangles[j])) {
          rectangles.splice(j, 1);
          i--;
        }
      }
    }
  }

  private static rectangleContains(outer: Rectangle, inner: Rectangle): boolean {
    return outer.x <= inner.x &&
           outer.y <= inner.y &&
           outer.x + outer.width >= inner.x + inner.width &&
           outer.y + outer.height >= inner.y + inner.height;
  }
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Force-directed layout algorithm for organic arrangements
class ForceDirectedLayout {
  static arrange(
    widgets: LayoutWidget[],
    containerSize: { width: number; height: number },
    iterations: number = 100
  ): LayoutWidget[] {
    const nodes = widgets.map(widget => ({
      ...widget,
      position: { 
        x: widget.position.x || Math.random() * containerSize.width,
        y: widget.position.y || Math.random() * containerSize.height
      },
      velocity: { x: 0, y: 0 },
      force: { x: 0, y: 0 }
    }));

    const repulsionStrength = 1000;
    const attractionStrength = 0.1;
    const dampening = 0.9;

    for (let iteration = 0; iteration < iterations; iteration++) {
      // Reset forces
      nodes.forEach(node => {
        node.force = { x: 0, y: 0 };
      });

      // Calculate repulsion forces (nodes push away from each other)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const node1 = nodes[i];
          const node2 = nodes[j];
          
          const dx = node2.position.x - node1.position.x;
          const dy = node2.position.y - node1.position.y;
          const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          
          const force = repulsionStrength / (distance * distance);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          node1.force.x -= fx;
          node1.force.y -= fy;
          node2.force.x += fx;
          node2.force.y += fy;
        }
      }

      // Calculate attraction to center
      const centerX = containerSize.width / 2;
      const centerY = containerSize.height / 2;
      
      nodes.forEach(node => {
        const dx = centerX - node.position.x;
        const dy = centerY - node.position.y;
        node.force.x += dx * attractionStrength;
        node.force.y += dy * attractionStrength;
      });

      // Update velocities and positions
      nodes.forEach(node => {
        node.velocity.x = (node.velocity.x + node.force.x) * dampening;
        node.velocity.y = (node.velocity.y + node.force.y) * dampening;
        
        node.position.x += node.velocity.x;
        node.position.y += node.velocity.y;
        
        // Keep within bounds
        node.position.x = Math.max(0, Math.min(containerSize.width - node.size.width, node.position.x));
        node.position.y = Math.max(0, Math.min(containerSize.height - node.size.height, node.position.y));
      });
    }

    return nodes.map(node => ({
      ...node,
      position: { x: Math.round(node.position.x), y: Math.round(node.position.y) }
    }));
  }
}

// Golden ratio and Fibonacci-based layout
class GoldenRatioLayout {
  static arrange(widgets: LayoutWidget[], containerSize: { width: number; height: number }): LayoutWidget[] {
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const sortedWidgets = [...widgets].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    const arranged: LayoutWidget[] = [];
    let currentX = 0;
    let currentY = 0;
    let currentWidth = containerSize.width;
    let currentHeight = containerSize.height;
    
    for (let i = 0; i < sortedWidgets.length; i++) {
      const widget = sortedWidgets[i];
      const isHorizontalSplit = currentWidth > currentHeight * phi;
      
      if (isHorizontalSplit) {
        // Split horizontally
        const widgetWidth = Math.min(widget.size.width, currentWidth / phi);
        arranged.push({
          ...widget,
          position: { x: currentX, y: currentY },
          size: { width: widgetWidth, height: Math.min(widget.size.height, currentHeight) }
        });
        
        currentX += widgetWidth;
        currentWidth -= widgetWidth;
      } else {
        // Split vertically
        const widgetHeight = Math.min(widget.size.height, currentHeight / phi);
        arranged.push({
          ...widget,
          position: { x: currentX, y: currentY },
          size: { width: Math.min(widget.size.width, currentWidth), height: widgetHeight }
        });
        
        currentY += widgetHeight;
        currentHeight -= widgetHeight;
      }
    }
    
    return arranged;
  }
}

// Masonry layout algorithm
class MasonryLayout {
  static arrange(
    widgets: LayoutWidget[],
    containerWidth: number,
    columnCount: number = 3,
    spacing: number = 16
  ): LayoutWidget[] {
    const columnWidth = (containerWidth - (columnCount - 1) * spacing) / columnCount;
    const columnHeights = new Array(columnCount).fill(0);
    
    return widgets.map(widget => {
      // Find shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      const position = {
        x: shortestColumnIndex * (columnWidth + spacing),
        y: columnHeights[shortestColumnIndex]
      };
      
      const size = {
        width: Math.min(widget.size.width, columnWidth),
        height: widget.size.height
      };
      
      // Update column height
      columnHeights[shortestColumnIndex] += size.height + spacing;
      
      return {
        ...widget,
        position,
        size
      };
    });
  }
}

// Available layout algorithms
const layoutAlgorithms: LayoutAlgorithm[] = [
  {
    id: 'bin-packing',
    name: 'Optimal Packing',
    description: 'Maximizes space utilization using bin packing algorithm',
    apply: (widgets, containerSize) => BinPacker.pack(widgets, containerSize.width, containerSize.height),
    priority: 1,
    category: 'auto'
  },
  {
    id: 'force-directed',
    name: 'Organic Layout',
    description: 'Natural arrangement using force simulation',
    apply: (widgets, containerSize) => ForceDirectedLayout.arrange(widgets, containerSize),
    priority: 2,
    category: 'flow'
  },
  {
    id: 'golden-ratio',
    name: 'Golden Ratio',
    description: 'Aesthetically pleasing proportions based on golden ratio',
    apply: (widgets, containerSize) => GoldenRatioLayout.arrange(widgets, containerSize),
    priority: 3,
    category: 'grid'
  },
  {
    id: 'masonry',
    name: 'Masonry Grid',
    description: 'Pinterest-style masonry layout',
    apply: (widgets, containerSize) => MasonryLayout.arrange(widgets, containerSize.width),
    priority: 4,
    category: 'grid'
  },
  {
    id: 'priority-flow',
    name: 'Priority Flow',
    description: 'Arranges widgets by priority from top-left',
    apply: (widgets, containerSize) => {
      const sorted = [...widgets].sort((a, b) => (b.priority || 0) - (a.priority || 0));
      let currentX = 0;
      let currentY = 0;
      let rowHeight = 0;
      
      return sorted.map(widget => {
        if (currentX + widget.size.width > containerSize.width) {
          currentX = 0;
          currentY += rowHeight + 16;
          rowHeight = 0;
        }
        
        const position = { x: currentX, y: currentY };
        currentX += widget.size.width + 16;
        rowHeight = Math.max(rowHeight, widget.size.height);
        
        return { ...widget, position };
      });
    },
    priority: 5,
    category: 'flow'
  }
];

const IntelligentLayoutManager: React.FC<IntelligentLayoutManagerProps> = ({
  widgets,
  containerSize,
  algorithm = 'bin-packing',
  enableAutoLayout = true,
  spacing = 16,
  padding = 16,
  onLayoutChange,
  className = ''
}) => {
  // Apply selected layout algorithm
  const arrangedWidgets = useMemo(() => {
    if (!enableAutoLayout) return widgets;
    
    const selectedAlgorithm = layoutAlgorithms.find(alg => alg.id === algorithm);
    if (!selectedAlgorithm) return widgets;
    
    const adjustedContainerSize = {
      width: containerSize.width - padding * 2,
      height: containerSize.height - padding * 2
    };
    
    const arranged = selectedAlgorithm.apply(widgets, adjustedContainerSize);
    
    // Apply padding offset
    return arranged.map(widget => ({
      ...widget,
      position: {
        x: widget.position.x + padding,
        y: widget.position.y + padding
      }
    }));
  }, [widgets, algorithm, enableAutoLayout, containerSize, padding]);

  const detectOverlaps = useCallback((widgets: LayoutWidget[]) => {
    const overlaps: Array<{ widget1: string; widget2: string }> = [];
    
    for (let i = 0; i < widgets.length; i++) {
      for (let j = i + 1; j < widgets.length; j++) {
        const w1 = widgets[i];
        const w2 = widgets[j];
        
        if (!(w1.position.x >= w2.position.x + w2.size.width ||
              w1.position.x + w1.size.width <= w2.position.x ||
              w1.position.y >= w2.position.y + w2.size.height ||
              w1.position.y + w1.size.height <= w2.position.y)) {
          overlaps.push({ widget1: w1.id, widget2: w2.id });
        }
      }
    }
    
    return overlaps;
  }, []);

  // Calculate layout metrics
  const layoutMetrics = useMemo(() => {
    const totalArea = arrangedWidgets.reduce((sum, widget) => 
      sum + (widget.size.width * widget.size.height), 0
    );
    const containerArea = containerSize.width * containerSize.height;
    const efficiency = (totalArea / containerArea) * 100;
    
    const maxY = Math.max(...arrangedWidgets.map(w => w.position.y + w.size.height));
    const heightUtilization = (maxY / containerSize.height) * 100;
    
    const overlaps = detectOverlaps(arrangedWidgets);
    
    return {
      efficiency: Math.round(efficiency),
      heightUtilization: Math.round(heightUtilization),
      overlaps: overlaps.length,
      totalWidgets: arrangedWidgets.length
    };
  }, [arrangedWidgets, containerSize, detectOverlaps]);

  // Notify parent of layout changes
  React.useEffect(() => {
    onLayoutChange?.(arrangedWidgets);
  }, [arrangedWidgets, onLayoutChange]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Algorithm Selection */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-50">
        <div className="text-sm font-medium mb-2">Layout Algorithm</div>
        <select
          value={algorithm}
          onChange={(e) => {
            const newAlgorithm = layoutAlgorithms.find(alg => alg.id === e.target.value);
            if (newAlgorithm) {
              const newLayout = newAlgorithm.apply(widgets, containerSize);
              onLayoutChange?.(newLayout);
            }
          }}
          className="w-full text-sm border border-gray-300 rounded px-2 py-1"
        >
          {layoutAlgorithms.map(alg => (
            <option key={alg.id} value={alg.id}>
              {alg.name}
            </option>
          ))}
        </select>
        
        {/* Layout Metrics */}
        <div className="mt-3 text-xs text-gray-600 space-y-1">
          <div>Efficiency: {layoutMetrics.efficiency}%</div>
          <div>Height Usage: {layoutMetrics.heightUtilization}%</div>
          <div>Overlaps: {layoutMetrics.overlaps}</div>
          <div>Widgets: {layoutMetrics.totalWidgets}</div>
        </div>
      </div>

      {/* Widget Container */}
      <div
        className="relative w-full h-full overflow-auto"
        style={{ 
          minHeight: Math.max(containerSize.height, 
            Math.max(...arrangedWidgets.map(w => w.position.y + w.size.height)) + padding
          )
        }}
      >
        {arrangedWidgets.map(widget => (
          <div
            key={widget.id}
            className="absolute bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
            style={{
              left: widget.position.x,
              top: widget.position.y,
              width: widget.size.width,
              height: widget.size.height,
              transform: 'translateZ(0)' // GPU acceleration
            }}
          >
            <widget.component {...widget} />
          </div>
        ))}
      </div>

      {/* Auto-layout Toggle */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2">
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={enableAutoLayout}
            onChange={(e) => {
              // Toggle auto-layout
              if (e.target.checked) {
                const selectedAlgorithm = layoutAlgorithms.find(alg => alg.id === algorithm);
                if (selectedAlgorithm) {
                  const newLayout = selectedAlgorithm.apply(widgets, containerSize);
                  onLayoutChange?.(newLayout);
                }
              }
            }}
            className="rounded"
          />
          <span>Auto Layout</span>
        </label>
      </div>
    </div>
  );
};

export default IntelligentLayoutManager;
export { layoutAlgorithms, BinPacker, ForceDirectedLayout, GoldenRatioLayout, MasonryLayout };