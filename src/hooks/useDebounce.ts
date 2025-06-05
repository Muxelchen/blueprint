import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * A hook that returns a debounced value that only updates after the specified delay
 * has elapsed since the last change. Useful for expensive operations like API calls
 * that shouldn't be triggered on every keystroke.
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * // Effect only triggers when debouncedSearchTerm changes
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     searchApi(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if the value or delay changes (or on unmount)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * A hook that returns a debounced function that only executes after the specified
 * delay has elapsed since it was last called. Useful for event handlers like
 * window resize or scroll events.
 * 
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @param deps Optional dependencies array for the returned callback
 * @returns A debounced version of the function
 * 
 * @example
 * ```tsx
 * const handleResize = useDebounceCallback(() => {
 *   console.log('Window resized!');
 *   updateLayout();
 * }, 200);
 * 
 * useEffect(() => {
 *   window.addEventListener('resize', handleResize);
 *   return () => window.removeEventListener('resize', handleResize);
 * }, [handleResize]);
 * ```
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  deps: any[] = []
): (...args: Parameters<T>) => void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(fn, deps);
  
  const debounceRef = useRef<{
    timeoutId: ReturnType<typeof setTimeout> | null;
    latestArgs: Parameters<T> | null;
  }>({
    timeoutId: null,
    latestArgs: null
  });

  useEffect(() => {
    return () => {
      // Clear any existing timeout on unmount
      if (debounceRef.current.timeoutId) {
        clearTimeout(debounceRef.current.timeoutId);
      }
    };
  }, []);

  return useCallback((...args: Parameters<T>) => {
    // Store the latest arguments
    debounceRef.current.latestArgs = args;

    // Clear any existing timeout
    if (debounceRef.current.timeoutId) {
      clearTimeout(debounceRef.current.timeoutId);
    }

    // Set a new timeout
    debounceRef.current.timeoutId = setTimeout(() => {
      // Call the function with the most recent arguments
      if (debounceRef.current.latestArgs) {
        callback(...debounceRef.current.latestArgs);
      }
      debounceRef.current.timeoutId = null;
    }, delay);
  }, [callback, delay]);
}

/**
 * A hook that returns a throttled function that executes at most once per specified
 * interval, no matter how many times it's called. Useful for frequent events where
 * performance is critical.
 * 
 * @param fn The function to throttle
 * @param interval The minimum time between executions in milliseconds
 * @param deps Optional dependencies array for the returned callback
 * @returns A throttled version of the function
 * 
 * @example
 * ```tsx
 * const handleScroll = useThrottleCallback(() => {
 *   console.log('Scrolling!');
 *   updateScrollPosition();
 * }, 100);
 * 
 * useEffect(() => {
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, [handleScroll]);
 * ```
 */
export function useThrottleCallback<T extends (...args: any[]) => any>(
  fn: T,
  interval: number,
  deps: any[] = []
): (...args: Parameters<T>) => void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(fn, deps);
  
  const throttleRef = useRef<{
    lastCallTime: number;
    timeoutId: ReturnType<typeof setTimeout> | null;
    latestArgs: Parameters<T> | null;
  }>({
    lastCallTime: 0,
    timeoutId: null,
    latestArgs: null
  });

  useEffect(() => {
    return () => {
      // Clear any existing timeout on unmount
      if (throttleRef.current.timeoutId) {
        clearTimeout(throttleRef.current.timeoutId);
      }
    };
  }, []);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - throttleRef.current.lastCallTime;
    
    throttleRef.current.latestArgs = args;

    // If we haven't called the function recently, call it immediately
    if (timeSinceLastCall >= interval) {
      throttleRef.current.lastCallTime = now;
      callback(...args);
      return;
    }

    // Otherwise, set up a timeout to call it later if not already pending
    if (throttleRef.current.timeoutId === null) {
      throttleRef.current.timeoutId = setTimeout(() => {
        throttleRef.current.lastCallTime = Date.now();
        // Call the function with the most recent arguments
        if (throttleRef.current.latestArgs) {
          callback(...throttleRef.current.latestArgs);
        }
        throttleRef.current.timeoutId = null;
      }, interval - timeSinceLastCall);
    }
  }, [callback, interval]);
}