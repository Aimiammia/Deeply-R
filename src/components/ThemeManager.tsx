
'use client';

import { useState, useEffect } from 'react';

// List of all possible theme classes that are not the default.
const THEME_CLASSES = ['theme-jungle', 'theme-crimson'];

// Custom hook to manage state in localStorage
function usePersistentState<T>(key: string, initialValue: T): readonly [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [state, setState] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setState(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const setAndPersistState = (value: T | ((val: T) => T)) => {
    try {
        const valueToStore = value instanceof Function ? value(state) : value;
        setState(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
  };

  return [state, setAndPersistState, isLoading] as const;
}


export function useColorTheme() {
    const [theme, setTheme, isLoading] = usePersistentState<string>('color-theme', 'default');
    
    useEffect(() => {
        // Only run on the client and after initial value has been loaded from localStorage
        if (!isLoading) {
            const root = document.documentElement;
            // Remove all possible theme classes to ensure a clean slate
            root.classList.remove(...THEME_CLASSES);
            
            // Add the new theme class if it's not the default one
            if (theme !== 'default') {
                root.classList.add(theme);
            }
        }
    }, [theme, isLoading]);
    
    return [theme, setTheme, isLoading] as const;
}

// This component's sole purpose is to be included in the layout to activate the theme management logic.
// It doesn't render any visible UI itself.
export function ThemeManager() {
    useColorTheme();
    return null;
}
