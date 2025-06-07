import React, { useState, useRef, useEffect, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface DraggableWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: any;
  position: { x: number; y: number; z?: number };
  size: { width: number; height: number };
  constraints?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    snapToGrid?: boolean;
    boundToContainer?: boolean;
  };
  dragConfig?: {
    enabled?: boolean;
    handle?: string; // CSS selector for drag handle
    cancel?: string; // CSS selector for drag cancel areas
    dragThreshold?: number;
    magneticFields?: MagneticField[];
  };
  resizeConfig?: {
    enabled?: boolean;
    handles?: ResizeHandle[];
    aspectRatio?: number;
    maintainAspectRatio?: boolean;
  };
  category?: string;
  locked?: boolean;
}

export interface MagneticField {
  id: string;
  type: 'snap' | 'align' | 'distribute';
  strength: number; // 1-10
  distance: number; // pixels
  target: 'grid' | 'widget' | 'container';
  targetId?: string;
}

export interface ResizeHandle {
  position:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
  cursor?: string;
  size?: number;
}

export interface DragDropLayoutManagerProps {
  widgets: DraggableWidget[];
  containerWidth: number;
  containerHeight: number;
  gridSize?: number;
  snapToGrid?: boolean;
  showGrid?: boolean;
  enableMagneticFields?: boolean;
  enableCollisionDetection?: boolean;
  enableMultiSelect?: boolean;
  onWidgetMove?: (widgetId: string, position: { x: number; y: number }) => void;
  onWidgetResize?: (widgetId: string, size: { width: number; height: number }) => void;
  onWidgetSelect?: (widgetIds: string[]) => void;
  onLayoutChange?: (widgets: DraggableWidget[]) => void;
  className?: string;
}

// Sortable Widget Component with enhanced drag functionality
const SortableWidget: React.FC<{
  widget: DraggableWidget;
  isSelected: boolean;
  isMultiSelected: boolean;
  gridSize: number;
  snapToGrid: boolean;
  containerWidth: number;
  containerHeight: number;
  onSelect: (id: string, multiSelect: boolean) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
}> = ({
  widget,
  isSelected,
  isMultiSelected,
  gridSize,
  snapToGrid,
  containerWidth,
  containerHeight,
  onSelect,
  onMove,
  onResize,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  const widgetRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({
    id: widget.id,
    disabled: widget.locked || !widget.dragConfig?.enabled,
  });

  const style = {
    position: 'absolute' as const,
    left: widget.position.x,
    top: widget.position.y,
    width: widget.size.width,
    height: widget.size.height,
    zIndex: widget.position.z || (isSelected ? 1000 : 1),
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  // Snap to grid function
  const snapToGridValue = useCallback(
    (value: number) => {
      if (!snapToGrid) return value;
      return Math.round(value / gridSize) * gridSize;
    },
    [snapToGrid, gridSize]
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (widget.locked || !widget.dragConfig?.enabled) return;

      setIsDragging(true);
      setStartPos({ x: e.clientX, y: e.clientY });

      // Select widget if not already selected
      if (!isSelected) {
        onSelect(widget.id, e.ctrlKey || e.metaKey);
      }
    },
    [widget.locked, widget.dragConfig?.enabled, isSelected, onSelect, widget.id]
  );

  // Handle drag move
  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      const newX = snapToGridValue(widget.position.x + deltaX);
      const newY = snapToGridValue(widget.position.y + deltaY);

      // Check constraints
      if (widget.constraints?.boundToContainer) {
        const maxX = Math.max(0, containerWidth - widget.size.width);
        const maxY = Math.max(0, containerHeight - widget.size.height);

        onMove(widget.id, {
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      } else {
        onMove(widget.id, { x: newX, y: newY });
      }
    },
    [isDragging, startPos, widget, snapToGridValue, onMove]
  );

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, handle: string) => {
      if (widget.locked || !widget.resizeConfig?.enabled) return;

      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);
      setResizeHandle(handle);
      setStartPos({ x: e.clientX, y: e.clientY });
      setStartSize({ width: widget.size.width, height: widget.size.height });
    },
    [widget.locked, widget.resizeConfig?.enabled, widget.size]
  );

  // Handle resize move
  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      let newWidth = startSize.width;
      let newHeight = startSize.height;

      // Calculate new size based on resize handle
      if (resizeHandle.includes('right')) {
        newWidth = startSize.width + deltaX;
      }
      if (resizeHandle.includes('left')) {
        newWidth = startSize.width - deltaX;
      }
      if (resizeHandle.includes('bottom')) {
        newHeight = startSize.height + deltaY;
      }
      if (resizeHandle.includes('top')) {
        newHeight = startSize.height - deltaY;
      }

      // Apply constraints
      const constraints = widget.constraints;
      if (constraints) {
        newWidth = Math.max(constraints.minWidth || 50, newWidth);
        newWidth = Math.min(constraints.maxWidth || Infinity, newWidth);
        newHeight = Math.max(constraints.minHeight || 50, newHeight);
        newHeight = Math.min(constraints.maxHeight || Infinity, newHeight);
      }

      // Maintain aspect ratio if required
      if (widget.resizeConfig?.maintainAspectRatio && widget.resizeConfig.aspectRatio) {
        const ratio = widget.resizeConfig.aspectRatio;
        if (resizeHandle.includes('right') || resizeHandle.includes('left')) {
          newHeight = newWidth / ratio;
        } else {
          newWidth = newHeight * ratio;
        }
      }

      // Snap to grid
      if (snapToGrid) {
        newWidth = snapToGridValue(newWidth);
        newHeight = snapToGridValue(newHeight);
      }

      onResize(widget.id, { width: newWidth, height: newHeight });
    },
    [isResizing, startPos, startSize, resizeHandle, widget, snapToGrid, snapToGridValue, onResize]
  );

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeHandle('');
  }, []);

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Render resize handles
  const renderResizeHandles = () => {
    if (!widget.resizeConfig?.enabled || widget.locked || !isSelected) return null;

    const defaultHandles: ResizeHandle[] = [
      { position: 'top-left', cursor: 'nw-resize' },
      { position: 'top-right', cursor: 'ne-resize' },
      { position: 'bottom-left', cursor: 'sw-resize' },
      { position: 'bottom-right', cursor: 'se-resize' },
      { position: 'top', cursor: 'n-resize' },
      { position: 'bottom', cursor: 's-resize' },
      { position: 'left', cursor: 'w-resize' },
      { position: 'right', cursor: 'e-resize' },
    ];

    const handles = widget.resizeConfig.handles || defaultHandles;

    return handles.map(handle => {
      const handleSize = handle.size || 8;
      const isCorner = handle.position.includes('-');

      let positionStyle: React.CSSProperties = {
        position: 'absolute',
        width: isCorner
          ? handleSize
          : handle.position === 'top' || handle.position === 'bottom'
            ? '100%'
            : handleSize,
        height: isCorner
          ? handleSize
          : handle.position === 'left' || handle.position === 'right'
            ? '100%'
            : handleSize,
        cursor: handle.cursor || 'resize',
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        border: '1px solid #3b82f6',
        borderRadius: isCorner ? '2px' : '0',
      };

      // Position the handle
      switch (handle.position) {
        case 'top-left':
          positionStyle = { ...positionStyle, top: -handleSize / 2, left: -handleSize / 2 };
          break;
        case 'top-right':
          positionStyle = { ...positionStyle, top: -handleSize / 2, right: -handleSize / 2 };
          break;
        case 'bottom-left':
          positionStyle = { ...positionStyle, bottom: -handleSize / 2, left: -handleSize / 2 };
          break;
        case 'bottom-right':
          positionStyle = { ...positionStyle, bottom: -handleSize / 2, right: -handleSize / 2 };
          break;
        case 'top':
          positionStyle = { ...positionStyle, top: -handleSize / 2, left: 0, height: handleSize };
          break;
        case 'bottom':
          positionStyle = {
            ...positionStyle,
            bottom: -handleSize / 2,
            left: 0,
            height: handleSize,
          };
          break;
        case 'left':
          positionStyle = { ...positionStyle, left: -handleSize / 2, top: 0, width: handleSize };
          break;
        case 'right':
          positionStyle = { ...positionStyle, right: -handleSize / 2, top: 0, width: handleSize };
          break;
      }

      return (
        <div
          key={handle.position}
          style={positionStyle}
          onMouseDown={e => handleResizeStart(e, handle.position)}
          className="resize-handle opacity-0 hover:opacity-100 transition-opacity duration-200"
        />
      );
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`widget-container border-2 rounded-lg transition-all duration-200 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-300'
      } ${isMultiSelected ? 'ring-2 ring-blue-300' : ''} ${
        sortableIsDragging ? 'opacity-50' : ''
      } ${widget.locked ? 'cursor-not-allowed opacity-75' : ''}`}
      onClick={e => {
        e.stopPropagation();
        onSelect(widget.id, e.ctrlKey || e.metaKey);
      }}
      {...attributes}
      {...listeners}
      onMouseDown={handleDragStart}
    >
      {/* Widget Header */}
      {isSelected && (
        <div className="absolute -top-6 left-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t flex items-center justify-between">
          <span className="truncate">{widget.title}</span>
          <span className="text-blue-200">
            {widget.size.width}×{widget.size.height}
          </span>
        </div>
      )}

      {/* Widget Content */}
      <div className="w-full h-full overflow-hidden rounded-lg">
        <widget.component {...widget.props} title={widget.title} />
      </div>

      {/* Resize Handles */}
      {renderResizeHandles()}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
      )}
    </div>
  );
};

// Main Drag & Drop Layout Manager
const DragDropLayoutManager: React.FC<DragDropLayoutManagerProps> = ({
  widgets,
  containerWidth,
  containerHeight,
  gridSize = 20,
  snapToGrid = true,
  showGrid = true,
  enableMagneticFields = true,
  enableCollisionDetection = true,
  enableMultiSelect = true,
  onWidgetMove,
  onWidgetResize,
  onWidgetSelect,
  onLayoutChange,
  className = '',
}) => {
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Handle widget selection
  const handleWidgetSelect = useCallback(
    (widgetId: string, multiSelect: boolean) => {
      setSelectedWidgets(prev => {
        if (multiSelect && enableMultiSelect) {
          if (prev.includes(widgetId)) {
            return prev.filter(id => id !== widgetId);
          } else {
            return [...prev, widgetId];
          }
        } else {
          return [widgetId];
        }
      });

      onWidgetSelect?.(selectedWidgets);
    },
    [selectedWidgets, enableMultiSelect, onWidgetSelect]
  );

  // Handle container click (deselect all)
  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setSelectedWidgets([]);
        onWidgetSelect?.([]);
      }
    },
    [onWidgetSelect]
  );

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDraggedWidget(event.active.id as string);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setDraggedWidget(null);

      const { active, over } = event;

      if (active.id !== over?.id) {
        // Handle widget reordering or repositioning
        onLayoutChange?.(widgets);
      }
    },
    [widgets, onLayoutChange]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedWidgets([]);
        onWidgetSelect?.([]);
      }

      if (e.key === 'Delete' && selectedWidgets.length > 0) {
        // Handle widget deletion
        const remainingWidgets = widgets.filter(w => !selectedWidgets.includes(w.id));
        onLayoutChange?.(remainingWidgets);
        setSelectedWidgets([]);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        const allWidgetIds = widgets.map(w => w.id);
        setSelectedWidgets(allWidgetIds);
        onWidgetSelect?.(allWidgetIds);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedWidgets, widgets, onWidgetSelect, onLayoutChange]);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        ref={containerRef}
        className={`relative overflow-hidden select-none ${className}`}
        style={{ width: containerWidth, height: containerHeight }}
        onClick={handleContainerClick}
      >
        {/* Grid Background */}
        {showGrid && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: `${gridSize}px ${gridSize}px`,
            }}
          />
        )}

        {/* Widgets */}
        <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
          {widgets.map(widget => (
            <SortableWidget
              key={widget.id}
              widget={widget}
              isSelected={selectedWidgets.includes(widget.id)}
              isMultiSelected={selectedWidgets.length > 1 && selectedWidgets.includes(widget.id)}
              gridSize={gridSize}
              snapToGrid={snapToGrid}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
              onSelect={handleWidgetSelect}
              onMove={onWidgetMove || (() => {})}
              onResize={onWidgetResize || (() => {})}
            />
          ))}
        </SortableContext>

        {/* Selection Rectangle (for multi-select) */}
        {/* TODO: Implement selection rectangle for drag-to-select */}

        {/* Status Bar */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs px-3 py-1 rounded">
          {selectedWidgets.length > 0 ? (
            <span>
              {selectedWidgets.length} widget{selectedWidgets.length > 1 ? 's' : ''} selected
            </span>
          ) : (
            <span>Click to select • Ctrl+Click for multi-select • Drag to move</span>
          )}
        </div>
      </div>
    </DndContext>
  );
};

export default DragDropLayoutManager;
