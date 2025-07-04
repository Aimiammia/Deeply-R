
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<T>(initialValue);
  const isInitialLoad = useRef(true);

  // Effect to load data from the correct source (Firestore or localStorage)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      if (user) {
        // User is logged in, try Firestore first
        const docRef = doc(db, 'userData', user.uid, 'appData', key);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setValue(docSnap.data().value);
          } else {
            // No data in Firestore, try localStorage as a fallback
            const localItem = window.localStorage.getItem(key);
            if (localItem) {
                const parsedLocal = JSON.parse(localItem);
                setValue(parsedLocal);
                // Sync this local data to Firestore for other devices
                await setDoc(docRef, { value: parsedLocal, updatedAt: serverTimestamp() });
            } else {
                setValue(initialValue);
            }
          }
        } catch (error) {
          console.error(`Error reading Firestore for key "${key}":`, error);
          const localItem = window.localStorage.getItem(key);
          if (localItem) setValue(JSON.parse(localItem));
          else setValue(initialValue);
        }
      } else {
        // User is not logged in, use localStorage only
        try {
          const item = window.localStorage.getItem(key);
          if (item) {
            setValue(JSON.parse(item));
          } else {
            setValue(initialValue);
          }
        } catch (error) {
          console.error(`Error reading localStorage key "${key}":`, error);
          setValue(initialValue);
        }
      }
      setIsLoading(false);
      isInitialLoad.current = false;
    };

    loadData();
  }, [key, user, initialValue]);


  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);

      // Save to localStorage immediately for instant UI feedback and offline access
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }

      // If user is logged in, also save to Firestore
      if (user) {
        const docRef = doc(db, 'userData', user.uid, 'appData', key);
        setDoc(docRef, { value: valueToStore, updatedAt: serverTimestamp() }).catch(error => {
          console.error(`Error writing to Firestore for key "${key}":`, error);
        });
      }
    },
    [key, user, value]
  );

  return [value, setStoredValue, isLoading] as const;
}
