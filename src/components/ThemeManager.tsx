'use client';

import { useEffect } from 'react';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';

// List of all possible theme classes that are not the default.
const THEME_CLASSES = ['theme-jungle', 'theme-crimson'];

export function useColorTheme() {
    const [theme, setTheme, isLoading] = useLocalStorageState<string>('color-theme', 'default');
    
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
