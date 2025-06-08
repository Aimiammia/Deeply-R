
'use client';

import { useState, useEffect, useCallback } from 'react';

// Helper to safely parse JSON
function safeJsonParse<T>(item: string | null, defaultValue: T): T {
  if (item === null) return defaultValue;
  try {
    // Ensure the item is not "undefined" as a string, which can happen
    if (item === "undefined") return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Error parsing JSON from localStorage for item: ${item}, returning default value. Error:`, error);
    return defaultValue;
  }
}


export function useDebouncedLocalStorage<T>(
  key: string,
  initialValue: T,
  delay: number = 750
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? safeJsonParse(item, initialValue) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handler = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [key, storedValue, delay]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(value);
  }, []);

  return [storedValue, setValue] as const;
}
