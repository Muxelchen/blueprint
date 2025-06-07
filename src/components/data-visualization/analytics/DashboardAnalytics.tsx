import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, Users, Clock, Eye, Download, RefreshCw } from 'lucide-react';
import Button from '../../common/buttons/Button';
import Modal from '../../common/overlays/Modal';

export interface AnalyticsEvent {
  id: string;
  type: 'widget_view' | 'widget_interact' | 'export' | 'navigation' | 'search' | 'error';
  timestamp: number;
  duration?: number;
  metadata?: Record<string, any>;
  userId?: string;
  sessionId: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  benchmark?: number;
}

export interface DashboardAnalyticsProps {
  className?: string;
  trackingEnabled?: boolean;
  onEventCapture?: (event: AnalyticsEvent) => void;
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  className = '',
  trackingEnabled = true,
  onEventCapture,
}) => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  // Track performance metrics
  const trackPerformance = useCallback(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    const metrics: PerformanceMetric[] = [
      {
        name: 'Page Load Time',
        value: Math.round(navigation.loadEventEnd - navigation.fetchStart),
        unit: 'ms',
        trend: 'stable',
        benchmark: 3000,
      },
      {
        name: 'Time to Interactive',
        value: Math.round(navigation.domInteractive - navigation.fetchStart),
        unit: 'ms',
        trend: 'stable',
        benchmark: 2000,
      },
      {
        name: 'First Paint',
        value: Math.round(paint.find(p => p.name === 'first-paint')?.startTime || 0),
        unit: 'ms',
        trend: 'stable',
        benchmark: 1000,
      },
      {
        name: 'Memory Usage',
        value: Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0),
        unit: 'MB',
        trend: 'up',
      },
      {
        name: 'Active Widgets',
        value: document.querySelectorAll('[data-widget-active="true"]').length,
        unit: 'count',
        trend: 'stable',
      },
    ];

    setPerformanceMetrics(metrics);
  }, []);

  // Generate insights based on analytics data
  const generateInsights = useCallback(() => {
    const newInsights: string[] = [];

    // Widget usage insights
    const widgetEvents = events.filter(e => e.type === 'widget_view');
    const widgetCounts = widgetEvents.reduce(
      (acc, event) => {
        const widgetType = event.metadata?.widgetType || 'unknown';
        acc[widgetType] = (acc[widgetType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostUsedWidget = Object.entries(widgetCounts).sort(([, a], [, b]) => b - a)[0];
    if (mostUsedWidget) {
      newInsights.push(`Most popular widget: ${mostUsedWidget[0]} (${mostUsedWidget[1]} views)`);
    }

    // Performance insights
    const loadTime = performanceMetrics.find(m => m.name === 'Page Load Time');
    if (loadTime && loadTime.benchmark && loadTime.value > loadTime.benchmark) {
      newInsights.push(
        `Page load time (${loadTime.value}ms) exceeds benchmark (${loadTime.benchmark}ms)`
      );
    }

    // User behavior insights
    const avgSessionDuration =
      events.length > 0 ? (Date.now() - Math.min(...events.map(e => e.timestamp))) / 1000 / 60 : 0;
    if (avgSessionDuration > 5) {
      newInsights.push(
        `High engagement: ${avgSessionDuration.toFixed(1)} minutes session duration`
      );
    }

    // Error insights
    const errorEvents = events.filter(e => e.type === 'error');
    if (errorEvents.length > 0) {
      newInsights.push(`${errorEvents.length} errors detected in current session`);
    }

    setInsights(newInsights);
  }, [events, performanceMetrics]);

  // Track an analytics event
  const trackEvent = useCallback(
    (type: AnalyticsEvent['type'], metadata?: Record<string, any>, duration?: number) => {
      if (!trackingEnabled) return;

      const event: AnalyticsEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        timestamp: Date.now(),
        duration,
        metadata,
        sessionId,
        userId: localStorage.getItem('userId') || undefined,
      };

      setEvents(prev => [...prev, event]);
      onEventCapture?.(event);
    },
    [trackingEnabled, sessionId, onEventCapture]
  );

  // Auto-track widget interactions
  useEffect(() => {
    if (!trackingEnabled) return;

    const handleWidgetClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const widget = target.closest('[data-widget-type]');
      if (widget) {
        trackEvent('widget_interact', {
          widgetType: widget.getAttribute('data-widget-type'),
          widgetId: widget.getAttribute('data-widget-id'),
          action: 'click',
        });
      }
    };

    const handleExport = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.textContent?.includes('Export') || target.closest('.export-functions')) {
        trackEvent('export', {
          type: target.textContent?.toLowerCase().includes('csv') ? 'csv' : 'unknown',
        });
      }
    };

    document.addEventListener('click', handleWidgetClick);
    document.addEventListener('click', handleExport);

    return () => {
      document.removeEventListener('click', handleWidgetClick);
      document.removeEventListener('click', handleExport);
    };
  }, [trackingEnabled, trackEvent]);

  // Track page visibility
  useEffect(() => {
    if (!trackingEnabled) return;

    const handleVisibilityChange = () => {
      trackEvent('navigation', {
        action: document.hidden ? 'page_hidden' : 'page_visible',
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [trackingEnabled, trackEvent]);

  // Load saved events and track performance on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('dashboard-analytics-events');
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        setEvents(parsed.slice(-1000)); // Keep last 1000 events
      } catch (e) {
        console.warn('Failed to parse saved analytics events');
      }
    }

    trackPerformance();
    trackEvent('navigation', { action: 'page_load' });
  }, [trackPerformance, trackEvent]);

  // Save events to localStorage
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('dashboard-analytics-events', JSON.stringify(events));
      generateInsights();
    }
  }, [events, generateInsights]);

  // Export analytics data
  const exportAnalytics = () => {
    const data = {
      events,
      performanceMetrics,
      insights,
      sessionId,
      exportDate: new Date().toISOString(),
      summary: {
        totalEvents: events.length,
        sessionDuration:
          events.length > 0 ? Date.now() - Math.min(...events.map(e => e.timestamp)) : 0,
        eventTypes: events.reduce(
          (acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Clear analytics data
  const clearAnalytics = () => {
    if (window.confirm('Are you sure you want to clear all analytics data?')) {
      setEvents([]);
      localStorage.removeItem('dashboard-analytics-events');
    }
  };

  // Get event counts by type
  const eventCounts = events.reduce(
    (acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <>
      {/* Analytics Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        leftIcon={<BarChart3 />}
        className={className}
      >
        Analytics
        {events.length > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
            {events.length}
          </span>
        )}
      </Button>

      {/* Analytics Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Dashboard Analytics"
        size="xl"
      >
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {performanceMetrics.map(metric => (
                <div key={metric.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                    {metric.trend && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          metric.trend === 'up'
                            ? 'bg-red-100 text-red-800'
                            : metric.trend === 'down'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {metric.trend}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}{' '}
                    <span className="text-sm font-normal text-gray-500">{metric.unit}</span>
                  </div>
                  {metric.benchmark && (
                    <div className="text-xs text-gray-500 mt-1">
                      Benchmark: {metric.benchmark} {metric.unit}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Event Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Event Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(eventCounts).map(([type, count]) => (
                <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500 capitalize">{type.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Insights
              </h3>
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg"
                  >
                    <p className="text-sm text-blue-800">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Events */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Events
            </h3>
            <div className="max-h-64 overflow-y-auto">
              {events
                .slice(-10)
                .reverse()
                .map(event => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 border-b border-gray-100"
                  >
                    <div>
                      <span className="font-medium capitalize">{event.type.replace('_', ' ')}</span>
                      {event.metadata && (
                        <span className="ml-2 text-sm text-gray-500">
                          {JSON.stringify(event.metadata)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => trackPerformance()}
              leftIcon={<RefreshCw />}
            >
              Refresh Metrics
            </Button>
            <Button variant="outline" size="sm" onClick={exportAnalytics} leftIcon={<Download />}>
              Export Data
            </Button>
            <Button variant="danger" size="sm" onClick={clearAnalytics}>
              Clear Data
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Hook for tracking analytics events
export const useAnalytics = () => {
  const trackEvent = useCallback(
    (type: AnalyticsEvent['type'], metadata?: Record<string, any>, duration?: number) => {
      // This would integrate with the global analytics context
      const event = new CustomEvent('analytics-track', {
        detail: { type, metadata, duration },
      });
      window.dispatchEvent(event);
    },
    []
  );

  return { trackEvent };
};

export default DashboardAnalytics;
