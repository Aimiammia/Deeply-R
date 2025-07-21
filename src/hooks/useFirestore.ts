// This hook is deprecated. The app now uses useLocalStorageState for all data
// to ensure it works completely offline without a Firebase backend.
// This file is kept to prevent build errors from any lingering imports
// but should not be used for new features.

import { useState, useEffect } from 'react';

export function useFirestore<T>(collectionName: string, initialValue: T) {
  const [localValue, setLocalValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(collectionName);
      if (item) {
        setLocalValue(JSON.parse(item));
      }
    } catch (error) {
        console.warn(`Could not load from localStorage for key ${collectionName}:`, error);
    }
    setIsLoading(false);
  }, [collectionName]);
  
  const setSyncedValue = (newValue: T | ((val: T) => T)) => {
    const valueToStore = newValue instanceof Function ? newValue(localValue) : newValue;
    setLocalValue(valueToStore);
    try {
        window.localStorage.setItem(collectionName, JSON.stringify(valueToStore));
    } catch (error) {
        console.warn(`Could not write to localStorage for key ${collectionName}:`, error);
    }
  };

  return [localValue, setSyncedValue, isLoading] as const;
}

