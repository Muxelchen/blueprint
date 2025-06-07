import { useState, useEffect } from 'react';

// Widget type for dashboard
interface DashboardWidget {
  id: string | number;
  type: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config?: Record<string, any>;
}

// Dashboard settings interface
interface DashboardSettings {
  theme: 'light' | 'dark';
  autoRefresh: boolean;
  refreshInterval: number;
}

// Local storage hook with automatic JSON parsing
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}

// Dashboard state management hook
export function useDashboard() {
  const [layout, setLayout] = useLocalStorage<Record<string, any>>('dashboard-layout', {});
  const [widgets, setWidgets] = useLocalStorage<DashboardWidget[]>('dashboard-widgets', []);
  const [settings, setSettings] = useLocalStorage<DashboardSettings>('dashboard-settings', {
    theme: 'light',
    autoRefresh: true,
    refreshInterval: 30000,
  });

  const addWidget = (widget: Partial<DashboardWidget>) => {
    setWidgets(prev => [...prev, { ...widget, id: Date.now() } as DashboardWidget]);
  };

  const removeWidget = (id: string | number) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const resetDashboard = () => {
    setLayout({});
    setWidgets([]);
  };

  return {
    layout,
    setLayout,
    widgets,
    setWidgets,
    settings,
    setSettings,
    addWidget,
    removeWidget,
    resetDashboard,
  };
}

// API hook with loading states
export function useApi<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [url]);

  return { data, loading, error, refetch };
}
