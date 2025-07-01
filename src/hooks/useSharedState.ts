
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// This custom hook manages state that is persisted on the server via API calls.
// It's a replacement for `useDebouncedLocalStorage` to allow data sharing across devices.
export function useSharedState<T>(
  key: string,
  initialValue: T,
  delay: number = 750
) {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialMount = useRef(true);

  // Fetch initial data from the server when the component mounts.
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/data/${key}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data for key: ${key}, status: ${response.status}`);
        }
        const data = await response.json();
        // Use fetched data if available, otherwise stick to initialValue.
        if (data !== null && data !== undefined) {
            setValue(data);
        } else {
            setValue(initialValue);
        }
      } catch (error) {
        console.error(error);
        setValue(initialValue); // Fallback to initial value on error
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Debounce saving the state back to the server.
  useEffect(() => {
    // Don't save on the initial render until data is loaded.
    if (isInitialMount.current) {
        if (!isLoading) {
            isInitialMount.current = false;
        }
        return;
    }
    
    const handler = setTimeout(() => {
      async function saveData() {
        try {
          const response = await fetch(`/api/data/${key}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(value),
          });
          // Also check if the save operation was successful on the server
          if (!response.ok) {
              console.error(`Error saving data for key “${key}”. Status: ${response.status}`);
              try {
                  const errorBody = await response.json();
                  console.error("Server error response:", errorBody);
              } catch {
                  // Ignore cases where the error body isn't JSON
              }
          }
        } catch (error) {
          console.error(`Network error while saving data for key “${key}”:`, error);
        }
      }
      saveData();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [key, value, delay, isLoading]);

  return [value, setValue, isLoading] as const;
}
