
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { encrypt, decrypt } from '@/lib/crypto';

// Keys that should NOT be encrypted.
const UNENCRYPTED_KEYS = ['theme', 'color-theme', 'deeply-auth-check'];

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<T>(initialValue);
  const { isLocked, getEncryptionKey } = useAuth();

  // Effect to load data from localStorage
  useEffect(() => {
    // Don't load anything until the auth state is resolved.
    if (isLocked && !UNENCRYPTED_KEYS.includes(key)) {
      // If locked and key is sensitive, use initial value.
      // Data will be re-loaded by components re-mounting or this effect re-running once unlocked.
      setValue(initialValue);
      setIsLoading(false);
      return;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const encryptionKey = getEncryptionKey();
        if (!UNENCRYPTED_KEYS.includes(key) && encryptionKey) {
          const decryptedItem = decrypt(item, encryptionKey);
          if (decryptedItem) {
            setValue(JSON.parse(decryptedItem));
          } else {
             // Decryption failed. Could be due to a password change or data corruption.
             // We stick with the initial value to prevent app crash.
             console.warn(`Decryption failed for key "${key}". Using initial value.`);
             setValue(initialValue);
          }
        } else {
          setValue(JSON.parse(item));
        }
      } else {
        setValue(initialValue);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setValue(initialValue);
    }
    setIsLoading(false);
  // Re-run this effect when the app is unlocked to load the data.
  }, [key, isLocked, getEncryptionKey, initialValue]);


  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      setValue(currentValue => {
        const valueToStore = newValue instanceof Function ? newValue(currentValue) : newValue;
        
        try {
          if (typeof window !== 'undefined') {
            const stringifiedValue = JSON.stringify(valueToStore);
            const encryptionKey = getEncryptionKey();
            
            if (!UNENCRYPTED_KEYS.includes(key) && encryptionKey) {
              const encryptedValue = encrypt(stringifiedValue, encryptionKey);
              window.localStorage.setItem(key, encryptedValue);
            } else if (UNENCRYPTED_KEYS.includes(key)) {
              window.localStorage.setItem(key, stringifiedValue);
            }
          }
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
        
        return valueToStore;
      });
    },
    [key, getEncryptionKey]
  );

  return [value, setStoredValue, isLoading] as const;
}
