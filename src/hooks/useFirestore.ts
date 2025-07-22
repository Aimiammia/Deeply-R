
'use client';

// This custom hook is a wrapper around useLocalStorageState.
// Its name is kept as 'useFirestore' to minimize changes in consuming components
// after migrating from a cloud-based solution to a local one.
// It effectively provides a localStorage-backed state management system.

import { useLocalStorageState } from './useLocalStorageState';

export function useFirestore<T>(collectionName: string, initialValue: T) {
    // The key for localStorage will be a combination of a prefix and the collectionName
    // to ensure uniqueness and avoid conflicts.
    const localStorageKey = `deeply-data-${collectionName}`;
    
    // Pass the key and initialValue directly to the localStorage hook.
    const [value, setValue, isLoading] = useLocalStorageState<T>(localStorageKey, initialValue);

    // Return the state, setter, and loading status, maintaining the same
    // function signature as the previous Firebase-based hook.
    return [value, setValue, isLoading] as const;
}
