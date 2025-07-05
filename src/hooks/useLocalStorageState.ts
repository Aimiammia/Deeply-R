
'use client';

import { useState, useEffect, useCallback } from 'react';

// NOTE: This hook is now primarily a fallback. 
// For cloud-synced data, use the `useFirestore` hook instead.
// This hook is still used for non-critical, device-specific settings like the theme.

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
  