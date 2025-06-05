import { useCallback, useMemo, useRef, useState, useEffect } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  componentName: string;
}

interface UsePerformanceOptimizationReturn {
  useVisibilityOptimization: (threshold?: number) => [React.RefObject<HTMLDivElement>, boolean];
  useRenderOptimization: (componentName: string) => {
    startMeasure: () => void;
    endMeasure: () => void;
    metrics: PerformanceMetrics | null;
  };
  useMemoryOptimization: () => {
    checkMemoryUsage: () => number;
    clearCache: () => void;
  };
  useFrameRateOptimization: () => {
    frameRate: number;
    shouldSkipRender: boolean;
  };
}

/**
 * Performance optimization hook for heavy chart components
 * Provides memoization, debouncing, and render optimization
 */
export function usePerformanceOptimization(): UsePerformanceOptimizationReturn {
  // Visibility optimization using Intersection Observer
  const useVisibilityOptimization = useCallback((threshold: number = 0.1): [React.RefObject<HTMLDivElement>, boolean] => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold }
      );

      const element = elementRef.current;
      if (element) {
        observer.observe(element);
      }

      return () => {
        if (element) {
          observer.unobserve(element);
        }
      };
    }, [threshold]);

    return [elementRef, isVisible];
  }, []);

  // Render performance measurement
  const useRenderOptimization = useCallback((componentName: string) => {
    const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
    const startTimeRef = useRef<number>(0);

    const startMeasure = useCallback(() => {
      startTimeRef.current = performance.now();
    }, []);

    const endMeasure = useCallback(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTimeRef.current;
      
      // Get memory usage if available
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0;

      setMetrics({
        renderTime,
        memoryUsage,
        frameRate: 60, // Will be updated by frame rate optimization
        componentName
      });

      // Log performance warnings
      if (renderTime > 16.67) { // More than one frame at 60fps
        console.warn(`⚠️ ${componentName}: Slow render detected: ${renderTime.toFixed(2)}ms`);
      }
    }, [componentName]);

    return { startMeasure, endMeasure, metrics };
  }, []);

  // Memory optimization
  const useMemoryOptimization = useCallback(() => {
    const cache = useRef(new Map());

    const checkMemoryUsage = useCallback((): number => {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        const usedMB = memoryInfo.usedJSHeapSize / 1024 / 1024;
        const limitMB = memoryInfo.jsHeapSizeLimit / 1024 / 1024;
        const usage = (usedMB / limitMB) * 100;
        
        // Clear cache if memory usage is high
        if (usage > 80) {
          console.warn('🧠 High memory usage detected, clearing cache...');
          cache.current.clear();
        }
        
        return usage;
      }
      return 0;
    }, []);

    const clearCache = useCallback(() => {
      cache.current.clear();
    }, []);

    return { checkMemoryUsage, clearCache };
  }, []);

  // Frame rate optimization
  const useFrameRateOptimization = useCallback(() => {
    const [frameRate, setFrameRate] = useState(60);
    const [shouldSkipRender, setShouldSkipRender] = useState(false);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());

    useEffect(() => {
      let animationId: number;

      const measureFrameRate = () => {
        const now = performance.now();
        frameCountRef.current++;

        if (now - lastTimeRef.current >= 1000) {
          const currentFrameRate = frameCountRef.current;
          setFrameRate(currentFrameRate);
          
          // Skip renders if frame rate is too low
          setShouldSkipRender(currentFrameRate < 30);
          
          frameCountRef.current = 0;
          lastTimeRef.current = now;
        }

        animationId = requestAnimationFrame(measureFrameRate);
      };

      animationId = requestAnimationFrame(measureFrameRate);

      return () => {
        cancelAnimationFrame(animationId);
      };
    }, []);

    return { frameRate, shouldSkipRender };
  }, []);

  return {
    useVisibilityOptimization,
    useRenderOptimization,
    useMemoryOptimization,
    useFrameRateOptimization
  };
}

/**
 * Specialized hook for chart data optimization
 */
export function useChartOptimization<T extends Record<string, any>>(
  data: T[],
  maxDataPoints: number = 100
) {
  return useMemo(() => {
    // Downsample data if it exceeds maxDataPoints
    let optimizedData = data;
    if (data.length > maxDataPoints) {
      const step = Math.ceil(data.length / maxDataPoints);
      optimizedData = data.filter((_, index) => index % step === 0);
    }

    // Calculate statistics for numeric fields
    const statistics: Record<string, { min: number; max: number; avg: number; sum: number }> = {};
    
    if (optimizedData.length > 0) {
      const numericKeys = Object.keys(optimizedData[0]).filter(key => 
        typeof optimizedData[0][key] === 'number'
      );

      numericKeys.forEach(key => {
        const values = optimizedData.map(item => item[key] as number).filter(val => !isNaN(val));
        if (values.length > 0) {
          statistics[key] = {
            min: Math.min(...values),
            max: Math.max(...values),
            avg: values.reduce((sum, val) => sum + val, 0) / values.length,
            sum: values.reduce((sum, val) => sum + val, 0)
          };
        }
      });
    }

    return { optimizedData, statistics };
  }, [data, maxDataPoints]);
}