
'use client';

import { useState, useEffect, useCallback } from 'react';

export function useFirestore<T>(
  key: string,
  initialValue: T
): readonly [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  const prefixedKey = `deeply_${key}`;

  useEffect(() => {
    // This effect runs only once on the client after the component mounts.
    try {
      const item = window.localStorage.getItem(prefixedKey);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error(`Error reading from localStorage key “${prefixedKey}”:`, error);
      setStoredValue(initialValue);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefixedKey]); // Only re-run if key changes

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error writing to localStorage key “${prefixedKey}”:`, error);
      }
    },
    [prefixedKey, storedValue]
  );

  return [storedValue, setValue, isLoading] as const;
}
