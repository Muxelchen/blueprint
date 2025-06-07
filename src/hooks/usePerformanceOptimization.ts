import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  componentName: string;
}

/**
 * Visibility optimization using Intersection Observer
 */
export function useVisibilityOptimization(
  threshold: number = 0.1
): [React.RefObject<HTMLDivElement>, boolean] {
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
}

/**
 * Render performance measurement
 */
export function useRenderOptimization(componentName: string) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const startTimeRef = useRef<number>(0);

  const startMeasure = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const endMeasure = useCallback(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;

    // Get memory usage if available
    const memoryInfo = (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory;
    const memoryUsage = memoryInfo?.usedJSHeapSize ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0;

    setMetrics({
      renderTime,
      memoryUsage,
      frameRate: 60, // Will be updated by frame rate optimization
      componentName,
    });

    // Log performance warnings in development only
    if (process.env.NODE_ENV === 'development' && renderTime > 16.67) {
      // More than one frame at 60fps
      console.warn(`⚠️ ${componentName}: Slow render detected: ${renderTime.toFixed(2)}ms`);
    }
  }, [componentName]);

  return { startMeasure, endMeasure, metrics };
}

/**
 * Memory optimization
 */
export function useMemoryOptimization() {
  const cache = useRef(new Map());

  const checkMemoryUsage = useCallback((): number => {
    const memoryInfo = (performance as unknown as { 
      memory?: { 
        usedJSHeapSize?: number;
        jsHeapSizeLimit?: number;
      } 
    }).memory;
    
    if (memoryInfo?.usedJSHeapSize && memoryInfo?.jsHeapSizeLimit) {
      const usedMB = memoryInfo.usedJSHeapSize / 1024 / 1024;
      const limitMB = memoryInfo.jsHeapSizeLimit / 1024 / 1024;
      const usage = (usedMB / limitMB) * 100;

      // Clear cache if memory usage is high
      if (usage > 80) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('🧠 High memory usage detected, clearing cache...');
        }
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
}

/**
 * Frame rate optimization
 */
export function useFrameRateOptimization() {
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
      const numericKeys = Object.keys(optimizedData[0]).filter(
        key => typeof optimizedData[0][key] === 'number'
      );

      numericKeys.forEach(key => {
        const values = optimizedData.map(item => item[key] as number).filter(val => !isNaN(val));
        if (values.length > 0) {
          statistics[key] = {
            min: Math.min(...values),
            max: Math.max(...values),
            avg: values.reduce((sum, val) => sum + val, 0) / values.length,
            sum: values.reduce((sum, val) => sum + val, 0),
          };
        }
      });
    }

    return { optimizedData, statistics };
  }, [data, maxDataPoints]);
}

/**
 * Main performance optimization hook that combines all optimizations
 */
export function usePerformanceOptimization() {
  return {
    useVisibilityOptimization,
    useRenderOptimization,
    useMemoryOptimization,
    useFrameRateOptimization,
  };
}
