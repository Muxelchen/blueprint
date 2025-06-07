import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export type EventType = 'page_view' | 'click' | 'form_submit' | 'error' | 'custom';

export interface AnalyticsEvent {
  type: EventType;
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export interface AnalyticsConfig {
  enabled?: boolean;
  debug?: boolean;
  anonymizeIp?: boolean;
  excludePaths?: string[];
  userId?: string | null;
  sessionId?: string;
}

export interface UseAnalyticsReturn {
  trackEvent: (event: Omit<AnalyticsEvent, 'timestamp'>) => void;
  trackPageView: (name?: string, properties?: Record<string, any>) => void;
  trackError: (error: Error, context?: Record<string, any>) => void;
  trackInteraction: (elementId: string, action: string, properties?: Record<string, any>) => void;
  recentEvents: AnalyticsEvent[];
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  userId: string | null;
  setUserId: (userId: string | null) => void;
  clearEvents: () => void;
}

/**
 * A hook for tracking user interactions and page views
 *
 * @param config Analytics configuration
 * @returns Analytics tracking methods and state
 */
export const useAnalytics = (config: AnalyticsConfig = {}): UseAnalyticsReturn => {
  const [isEnabled, setIsEnabled] = useState(config.enabled ?? true);
  const [userId, setUserId] = useState<string | null>(config.userId ?? null);
  const [sessionId] = useState<string>(config.sessionId ?? generateSessionId());
  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([]);
  const location = useLocation();

  // Generate a unique session ID if not provided
  function generateSessionId(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }

  // Send analytics data to your collection endpoint
  const sendAnalyticsData = useCallback(
    (event: AnalyticsEvent) => {
      if (!isEnabled) return;

      // In a real implementation, you would send this to your analytics service
      // e.g., Google Analytics, Mixpanel, custom backend, etc.
      if (config.debug) {
        console.log('[Analytics]', event);
      }

      // Add to recent events for reference/debugging
      setRecentEvents(prev => [...prev.slice(-9), event]);

      // Example implementation for sending to a backend
      /*
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...event,
        userId: config.anonymizeIp ? null : userId,
        sessionId
      }),
    }).catch(err => console.error('Analytics error:', err));
    */
    },
    [isEnabled, userId, sessionId, config.debug, config.anonymizeIp]
  );

  // Track custom events
  const trackEvent = useCallback(
    (event: Omit<AnalyticsEvent, 'timestamp'>) => {
      sendAnalyticsData({
        ...event,
        timestamp: Date.now(),
      });
    },
    [sendAnalyticsData]
  );

  // Track page views
  const trackPageView = useCallback(
    (name?: string, properties?: Record<string, any>) => {
      sendAnalyticsData({
        type: 'page_view',
        name: name || location.pathname,
        properties: {
          path: location.pathname,
          search: location.search,
          ...properties,
        },
        timestamp: Date.now(),
      });
    },
    [sendAnalyticsData, location]
  );

  // Track errors
  const trackError = useCallback(
    (error: Error, context?: Record<string, any>) => {
      sendAnalyticsData({
        type: 'error',
        name: error.name,
        properties: {
          message: error.message,
          stack: error.stack,
          ...context,
        },
        timestamp: Date.now(),
      });
    },
    [sendAnalyticsData]
  );

  // Track user interactions (clicks, form submissions, etc.)
  const trackInteraction = useCallback(
    (elementId: string, action: string, properties?: Record<string, any>) => {
      sendAnalyticsData({
        type: 'click',
        name: `${action}:${elementId}`,
        properties: {
          elementId,
          action,
          ...properties,
        },
        timestamp: Date.now(),
      });
    },
    [sendAnalyticsData]
  );

  // Clear recent events (for privacy or memory management)
  const clearEvents = useCallback(() => {
    setRecentEvents([]);
  }, []);

  // Auto-track page views when location changes
  useEffect(() => {
    if (isEnabled) {
      // Skip excluded paths
      if (config.excludePaths?.includes(location.pathname)) {
        return;
      }

      trackPageView();
    }
  }, [isEnabled, location, trackPageView, config.excludePaths]);

  return {
    trackEvent,
    trackPageView,
    trackError,
    trackInteraction,
    recentEvents,
    isEnabled,
    setEnabled: setIsEnabled,
    userId,
    setUserId,
    clearEvents,
  };
};
