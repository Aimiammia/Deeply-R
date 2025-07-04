
'use client';

import { useState, useEffect, useCallback } from 'react';

// This is a simplified version of the hook that only uses localStorage.
// It is intended for a local-first, offline application without cloud sync.

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [isLoading, setIsLoading] = useState(true);

  // Use a function for useState's initial value to prevent re-running logic on every render.
  const [value, setValue] = useState<T>(() => {
    // This part now only runs on the client, once.
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  // This effect runs only once after the component mounts to set loading to false.
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        // By using the updater function form of `setValue`, we get the latest state
        // without needing `value` in the dependency array. This makes `setStoredValue`
        // a stable function, preventing infinite loops in consuming components.
        setValue(prevValue => {
          const valueToStore =
            newValue instanceof Function ? newValue(prevValue) : newValue;
          
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          
          return valueToStore;
        });
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key] // Now only depends on `key`, which is stable.
  );
  
  return [value, setStoredValue, isLoading] as const;
}
