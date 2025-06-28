
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { encrypt, decrypt } from '@/lib/crypto';

// Keys that should NOT be encrypted, e.g., for styling the lock screen itself.
const UNENCRYPTED_KEYS = ['theme', 'color-theme', 'deeply-auth-check'];

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<T>(initialValue);
  const auth = useAuth(); // Use the hook to get auth context

  // Load data from localStorage on mount
  useEffect(() => {
    // We should not attempt to load data until the auth state is determined
    if (auth.isLocked && !UNENCRYPTED_KEYS.includes(key)) {
      // If the app is locked and the key is sensitive, don't load anything yet.
      // The state will be updated once unlocked.
      setIsLoading(false); // We consider it "loaded" with the initial value for now.
      return;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        if (!UNENCRYPTED_KEYS.includes(key) && auth.passwordKey) {
          // It's an encrypted key and we have the password
          const decryptedItem = decrypt(item, auth.passwordKey);
          if (decryptedItem) {
            setValue(JSON.parse(decryptedItem));
          }
        } else {
          // It's an unencrypted key or we don't have a password (e.g., first setup)
          setValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    setIsLoading(false);
  // We need to re-run this effect when the app is unlocked
  }, [key, auth.isLocked, auth.passwordKey]);


  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      // Create a function to get the latest state value to prevent stale closures
      const getValueToStore = (currentValue: T) => {
          return newValue instanceof Function ? newValue(currentValue) : newValue;
      };
      
      setValue(prevValue => {
          const valueToStore = getValueToStore(prevValue);
          try {
            if (typeof window !== 'undefined') {
              const stringifiedValue = JSON.stringify(valueToStore);
              
              if (!UNENCRYPTED_KEYS.includes(key) && auth.passwordKey) {
                // Encrypt if it's a sensitive key and we have the password
                const encryptedValue = encrypt(stringifiedValue, auth.passwordKey);
                window.localStorage.setItem(key, encryptedValue);
              } else if (UNENCRYPTED_KEYS.includes(key)) {
                // Store as plaintext if it is a non-sensitive key
                window.localStorage.setItem(key, stringifiedValue);
              }
              // If key is sensitive and there's no password, we don't save.
            }
          } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
          }
          return valueToStore;
      });
    },
    [key, auth.passwordKey]
  );

  return [value, setStoredValue, isLoading] as const;
}
