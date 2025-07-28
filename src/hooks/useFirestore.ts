
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// A custom hook to write to localStorage, which will serve as our local, offline database.
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): readonly [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect to load from localStorage on initial component mount on the client.
  useEffect(() => {
    // This code runs only on the client side.
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        // If no value is in localStorage, set it with the initial value.
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error(`Error reading from localStorage for key “${key}”:`, error);
      setStoredValue(initialValue);
    } finally {
        setIsLoading(false);
    }
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error writing to localStorage for key “${key}”:`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isLoading] as const;
}

// Renaming the export for backward compatibility in case some components still import useFirestore
export const useFirestore = useLocalStorage;
