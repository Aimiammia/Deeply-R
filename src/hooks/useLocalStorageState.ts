// This hook is deprecated. Please use useFirestore for all application state
// to ensure data is synced across devices. This file is kept to prevent
// build errors from any lingering imports but should not be used for new features.

'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [isLoading, setIsLoading] = useState(true);

  const [value, setValue] = useState<T>(() => {
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

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
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
    [key]
  );

  return [value, setStoredValue, isLoading] as const;
}
