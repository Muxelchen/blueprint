import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

export interface ResizableWidgetProps {
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
  onResize?: (width: number, height: number) => void;
  disabled?: boolean;
  showHandles?: boolean;
}

const ResizableWidget: React.FC<ResizableWidgetProps> = ({
  children,
  initialWidth = 300,
  initialHeight = 200,
  minWidth = 120,  // Increased from 150 for better mobile support
  minHeight = 100,
  maxWidth = 1200, // Increased from 800 for better large screen support
  maxHeight = 800, // Increased from 600
  className = '',
  onResize,
  disabled = false,
  showHandles = true
}) => {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const widgetRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  // Save size to localStorage with improved key generation
  useEffect(() => {
    const key = `resizable-widget-${className}-${initialWidth}x${initialHeight}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const savedSize = JSON.parse(saved);
        // Validate saved size is within bounds
        const validatedSize = constrainSize(savedSize.width, savedSize.height);
        setSize(validatedSize);
      } catch (e) {
        console.warn('Failed to parse saved widget size');
      }
    }
  }, [className, initialWidth, initialHeight]);

  // Save size when it changes
  useEffect(() => {
    const key = `resizable-widget-${className}-${initialWidth}x${initialHeight}`;
    localStorage.setItem(key, JSON.stringify(size));
    onResize?.(size.width, size.height);
  }, [size, className, onResize, initialWidth, initialHeight]);

  const constrainSize = useCallback((width: number, height: number) => {
    // Enhanced constraint logic with aspect ratio preservation option
    const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, width));
    const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, height));
    
    // Ensure minimum viable content area
    const finalWidth = Math.max(constrainedWidth, 120);
    const finalHeight = Math.max(constrainedHeight, 80);
    
    return {
      width: finalWidth,
      height: finalHeight
    };
  }, [minWidth, minHeight, maxWidth, maxHeight]);

  const handleMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeDirection(direction);
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { ...size };
    
    document.body.style.cursor = getCursor(direction);
    document.body.style.userSelect = 'none';
  }, [disabled, size]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    
    let newWidth = startSize.current.width;
    let newHeight = startSize.current.height;

    if (resizeDirection.includes('right')) {
      newWidth = startSize.current.width + deltaX;
    }
    if (resizeDirection.includes('left')) {
      newWidth = startSize.current.width - deltaX;
    }
    if (resizeDirection.includes('bottom')) {
      newHeight = startSize.current.height + deltaY;
    }
    if (resizeDirection.includes('top')) {
      newHeight = startSize.current.height - deltaY;
    }

    const constrainedSize = constrainSize(newWidth, newHeight);
    setSize(constrainedSize);
  }, [isResizing, resizeDirection, constrainSize]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeDirection('');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const getCursor = (direction: string) => {
    switch (direction) {
      case 'top':
      case 'bottom':
        return 'ns-resize';
      case 'left':
      case 'right':
        return 'ew-resize';
      case 'top-left':
      case 'bottom-right':
        return 'nw-resize';
      case 'top-right':
      case 'bottom-left':
        return 'ne-resize';
      default:
        return 'default';
    }
  };

  const handleStyle = 'absolute bg-blue-500 opacity-0 hover:opacity-100 transition-opacity duration-200 z-10';

  return (
    <div
      ref={widgetRef}
      className={`relative bg-white border border-gray-200 rounded-lg shadow-sm ${
        isResizing ? 'select-none' : ''
      } ${className}`}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isResizing ? getCursor(resizeDirection) : 'default'
      }}
    >
      {/* Content */}
      <div className="w-full h-full overflow-auto p-4">
        {children}
      </div>

      {/* Resize Handles */}
      {showHandles && !disabled && (
        <>
          {/* Corner handles */}
          <div
            className={`${handleStyle} w-3 h-3 -top-1 -left-1 cursor-nw-resize`}
            onMouseDown={(e) => handleMouseDown(e, 'top-left')}
          />
          <div
            className={`${handleStyle} w-3 h-3 -top-1 -right-1 cursor-ne-resize`}
            onMouseDown={(e) => handleMouseDown(e, 'top-right')}
          />
          <div
            className={`${handleStyle} w-3 h-3 -bottom-1 -left-1 cursor-ne-resize`}
            onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
          />
          <div
            className={`${handleStyle} w-3 h-3 -bottom-1 -right-1 cursor-nw-resize`}
            onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
          />

          {/* Edge handles */}
          <div
            className={`${handleStyle} h-1 -top-1 left-3 right-3 cursor-ns-resize`}
            onMouseDown={(e) => handleMouseDown(e, 'top')}
          />
          <div
            className={`${handleStyle} h-1 -bottom-1 left-3 right-3 cursor-ns-resize`}
            onMouseDown={(e) => handleMouseDown(e, 'bottom')}
          />
          <div
            className={`${handleStyle} w-1 -left-1 top-3 bottom-3 cursor-ew-resize`}
            onMouseDown={(e) => handleMouseDown(e, 'left')}
          />
          <div
            className={`${handleStyle} w-1 -right-1 top-3 bottom-3 cursor-ew-resize`}
            onMouseDown={(e) => handleMouseDown(e, 'right')}
          />

          {/* Resize indicator */}
          <div className="absolute bottom-0 right-0 p-1 text-gray-400">
            <GripVertical className="w-4 h-4 transform rotate-45" />
          </div>
        </>
      )}

      {/* Size indicator (show during resize) */}
      {isResizing && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {size.width} × {size.height}
        </div>
      )}
    </div>
  );
};

export default ResizableWidget;