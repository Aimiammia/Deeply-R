
'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<T>(initialValue);

  // This effect runs once on the client to load the initial state from localStorage.
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Only run on mount


  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, value]
  );

  return [value, setStoredValue, isLoading] as const;
}
