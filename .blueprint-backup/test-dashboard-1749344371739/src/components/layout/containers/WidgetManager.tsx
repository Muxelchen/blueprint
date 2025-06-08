import React, { useState, useEffect } from 'react';
import { Plus, X, Settings, Eye, EyeOff, Move } from 'lucide-react';
import Button from '../../common/buttons/Button';
import IconButton from '../../common/buttons/IconButton';

export interface Widget {
  id: string;
  type: string;
  title: string;
  visible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config?: Record<string, any>;
}

export interface WidgetType {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  defaultProps?: Record<string, any>;
}

export interface WidgetManagerProps {
  availableWidgets: WidgetType[];
  onWidgetAdd?: (widget: Widget) => void;
  onWidgetRemove?: (widgetId: string) => void;
  onWidgetUpdate?: (widget: Widget) => void;
  className?: string;
}

const WidgetManager: React.FC<WidgetManagerProps> = ({
  availableWidgets,
  onWidgetAdd,
  onWidgetRemove,
  onWidgetUpdate,
  className = '',
}) => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  // Load widgets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-widgets');
    if (saved) {
      try {
        const savedWidgets = JSON.parse(saved);
        setWidgets(savedWidgets);
      } catch (e) {
        console.warn('Failed to parse saved widgets');
      }
    }
  }, []);

  // Save widgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
  }, [widgets]);

  const addWidget = (widgetType: WidgetType) => {
    const newWidget: Widget = {
      id: `${widgetType.id}-${Date.now()}`,
      type: widgetType.id,
      title: widgetType.name,
      visible: true,
      position: { x: 20, y: 20 },
      size: { width: 300, height: 200 },
      config: widgetType.defaultProps || {},
    };

    setWidgets(prev => [...prev, newWidget]);
    onWidgetAdd?.(newWidget);
    setShowAddModal(false);
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
    onWidgetRemove?.(widgetId);
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev =>
      prev.map(widget => {
        if (widget.id === widgetId) {
          const updated = { ...widget, visible: !widget.visible };
          onWidgetUpdate?.(updated);
          return updated;
        }
        return widget;
      })
    );
  };

  const updateWidgetPosition = (widgetId: string, position: { x: number; y: number }) => {
    setWidgets(prev =>
      prev.map(widget => {
        if (widget.id === widgetId) {
          const updated = { ...widget, position };
          onWidgetUpdate?.(updated);
          return updated;
        }
        return widget;
      })
    );
  };

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedWidget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateWidgetPosition(draggedWidget, { x, y });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const resetLayout = () => {
    setWidgets(prev =>
      prev.map((widget, index) => ({
        ...widget,
        position: { x: 20 + (index % 3) * 320, y: 20 + Math.floor(index / 3) * 220 },
        size: { width: 300, height: 200 },
      }))
    );
  };

  const clearAllWidgets = () => {
    if (window.confirm('Are you sure you want to remove all widgets?')) {
      setWidgets([]);
    }
  };

  return (
    <div className={`widget-manager ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard Widgets</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {widgets.filter(w => w.visible).length} of {widgets.length} visible
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus />}
          >
            Add Widget
          </Button>
          <IconButton icon={<Settings />} tooltip="Reset Layout" onClick={resetLayout} size="sm" />
        </div>
      </div>

      {/* Widget List */}
      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
        {widgets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No widgets added yet</p>
            <Button variant="primary" onClick={() => setShowAddModal(true)} leftIcon={<Plus />}>
              Add Your First Widget
            </Button>
          </div>
        ) : (
          widgets.map(widget => {
            const widgetType = availableWidgets.find(w => w.id === widget.type);
            return (
              <div
                key={widget.id}
                className={`flex items-center p-3 bg-gray-50 rounded-lg border ${
                  draggedWidget === widget.id ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={e => handleDragStart(e, widget.id)}
                onDragEnd={handleDragEnd}
              >
                <Move className="w-4 h-4 text-gray-400 mr-3 cursor-move" />

                {widgetType && <div className="w-6 h-6 mr-3 text-gray-600">{widgetType.icon}</div>}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{widget.title}</p>
                  <p className="text-xs text-gray-500">
                    {widget.position.x}, {widget.position.y} • {widget.size.width}×
                    {widget.size.height}
                  </p>
                </div>

                <div className="flex items-center space-x-1">
                  <IconButton
                    icon={widget.visible ? <Eye /> : <EyeOff />}
                    tooltip={widget.visible ? 'Hide widget' : 'Show widget'}
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    size="sm"
                    variant={widget.visible ? 'ghost' : 'outline'}
                  />
                  <IconButton
                    icon={<X />}
                    tooltip="Remove widget"
                    onClick={() => removeWidget(widget.id)}
                    size="sm"
                    variant="ghost"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Actions */}
      {widgets.length > 0 && (
        <div className="p-4 border-t border-gray-200 space-y-2">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={resetLayout} fullWidth>
              Reset Layout
            </Button>
            <Button variant="danger" size="sm" onClick={clearAllWidgets} fullWidth>
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Add Widget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Widget</h3>
              <IconButton icon={<X />} onClick={() => setShowAddModal(false)} size="sm" />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableWidgets.map(widgetType => (
                <button
                  key={widgetType.id}
                  onClick={() => addWidget(widgetType)}
                  className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 mr-3 text-gray-600">{widgetType.icon}</div>
                  <div>
                    <p className="font-medium text-gray-900">{widgetType.name}</p>
                    <p className="text-sm text-gray-500">
                      Add {widgetType.name.toLowerCase()} to your dashboard
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {draggedWidget && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-20 border-2 border-dashed border-blue-400 pointer-events-auto">
            <div className="flex items-center justify-center h-full">
              <p className="text-blue-600 font-medium">Drop widget here to reposition</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetManager;
