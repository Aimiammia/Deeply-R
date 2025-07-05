'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// This hook replaces useLocalStorageState to sync data with Firestore
// for the currently authenticated user.

export function useFirestore<T>(collectionKey: string, initialValue: T) {
  const { user, isFirebaseConfigured } = useAuth();
  const [data, setData] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback to localStorage if Firebase is not configured or user is not logged in
  useEffect(() => {
    if (!isFirebaseConfigured) {
        const item = window.localStorage.getItem(collectionKey);
        if (item) {
            setData(JSON.parse(item));
        }
        setIsLoading(false);
    }
  }, [isFirebaseConfigured, collectionKey]);

  // Firestore effect
  useEffect(() => {
    if (!user || !isFirebaseConfigured || !db) {
      if (!isFirebaseConfigured) {
          // Already handled by the other effect
      } else {
        setIsLoading(false);
      }
      return;
    }
    
    setIsLoading(true);
    // Path: userData/{userId}/appData/{collectionKey}
    const docRef = doc(db, 'userData', user.uid, 'appData', collectionKey);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data().value);
      } else {
        // Doc doesn't exist for this user, set it with initialValue
        setData(initialValue);
        setDoc(docRef, { value: initialValue }).catch(e => console.error("Error creating initial Firestore doc", e));
      }
      setIsLoading(false);
    }, (error) => {
      console.error(`Firestore snapshot error for ${collectionKey}:`, error);
      setIsLoading(false);
    });

    return () => unsubscribe();
    
  }, [user, collectionKey, initialValue, isFirebaseConfigured]);

  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      const valueToStore = newValue instanceof Function ? newValue(data) : newValue;
      setData(valueToStore); // Optimistic update

      if (user && isFirebaseConfigured && db) {
        const docRef = doc(db, 'userData', user.uid, 'appData', collectionKey);
        setDoc(docRef, { value: valueToStore }).catch(error => {
          console.error(`Error setting Firestore document for ${collectionKey}:`, error);
          // Here you might want to add a toast or revert the optimistic update
        });
      } else if (!isFirebaseConfigured) {
        // Fallback to localStorage if Firebase is not set up
        window.localStorage.setItem(collectionKey, JSON.stringify(valueToStore));
      }
    },
    [data, user, isFirebaseConfigured, collectionKey]
  );
  
  return [data, setStoredValue, isLoading] as const;
}