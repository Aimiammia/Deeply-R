
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

async function fetchData<T>(key: string): Promise<T | null> {
  try {
    const response = await fetch(`/api/data/${key}`);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Data for key "${key}" not found on server.`);
        return null;
      }
      throw new Error(`Failed to fetch data for key ${key}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // Return null on error to let initialValue be used
  }
}

async function saveData<T>(key: string, data: T): Promise<boolean> {
  try {
    const response = await fetch(`/api/data/${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
}


export function useFirestore<T>(
  key: string,
  initialValue: T
): readonly [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Ref to store the latest value to avoid stale closures in debounced save
  const valueRef = useRef(value);
  valueRef.current = value;

  // Initial fetch from the server
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      const serverData = await fetchData<T>(key);
      if (isMounted) {
        if (serverData !== null) {
          setValue(serverData);
        } else {
          // If server has no data, use initialValue and don't try to save it back
          setValue(initialValue);
        }
        setIsLoading(false);
      }
    };
    loadData();

    return () => {
      isMounted = false;
    };
  }, [key]); // Intentionally not including initialValue to avoid re-fetching

  // Debounced save function
  const debouncedSave = useRef(
    debounce((newValue: T) => {
      saveData(key, newValue);
    }, 500) // 500ms debounce delay
  ).current;

  const setAndPersistValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      const resolvedValue = newValue instanceof Function ? newValue(valueRef.current) : newValue;
      setValue(resolvedValue);
      debouncedSave(resolvedValue);
    },
    [key, debouncedSave]
  );
  
  return [value, setAndPersistValue, isLoading] as const;
}

// Debounce utility function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}
