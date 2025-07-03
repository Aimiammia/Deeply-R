
'use client';

import { useState, useEffect, useCallback } from 'react';

// NOTE: This hook has been updated to remove local encryption.
// This is a preparatory step for migrating to a cloud-based database (like Firestore)
// where data will be secured by user authentication and server-side security rules.

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<T>(initialValue);

  // Effect to load data from localStorage
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      } else {
        setValue(initialValue);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setValue(initialValue);
    }
    setIsLoading(false);
  }, [key, initialValue]);


  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      setValue(currentValue => {
        const valueToStore = newValue instanceof Function ? newValue(currentValue) : newValue;
        
        try {
          if (typeof window !== 'undefined') {
            const stringifiedValue = JSON.stringify(valueToStore);
            window.localStorage.setItem(key, stringifiedValue);
          }
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
        
        return valueToStore;
      });
    },
    [key]
  );

  return [value, setStoredValue, isLoading] as const;
}
