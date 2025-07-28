
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';

export function useFirestore<T>(
  collectionName: string,
  initialValue: T
): readonly [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (!isFirebaseConfigured || !user) {
        console.warn('Firebase not configured or user not logged in. Cannot save to Firestore.');
        // Fallback to local state update if needed, but no persistence
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        return;
      }
      
      const docRef = doc(db, 'users', user.uid, collectionName, 'data');
      
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // We update the local state optimistically
      setStoredValue(valueToStore);
      
      // Then we save to Firestore
      setDoc(docRef, { value: valueToStore }, { merge: true }).catch((error) => {
        console.error(`Error writing to Firestore collection “${collectionName}”:`, error);
        // Optionally revert state or show an error toast
      });
    },
    [user, collectionName, storedValue]
  );
  
  useEffect(() => {
    // Cleanup previous listener
    if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
    }

    if (!isFirebaseConfigured || !user) {
      setIsLoading(false);
      // Reset to initial value if user logs out
      setStoredValue(initialValue);
      return;
    }

    const docRef = doc(db, 'users', user.uid, collectionName, 'data');

    const fetchInitialData = async () => {
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as DocumentData;
                setStoredValue(data.value as T);
            } else {
                // If doc doesn't exist, set it with the initial value
                await setDoc(docRef, { value: initialValue });
                setStoredValue(initialValue);
            }
        } catch (error) {
            console.error(`Error reading from Firestore collection “${collectionName}”:`, error);
            setStoredValue(initialValue); // Fallback to initial value on error
        } finally {
            setIsLoading(false);
        }
    };

    fetchInitialData();
    
    // Set up the real-time listener
    unsubscribeRef.current = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data() as DocumentData;
            setStoredValue(data.value as T);
        }
    }, (error) => {
        console.error(`Error with Firestore listener for “${collectionName}”:`, error);
    });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [user, collectionName]); // Re-run effect if user or collectionName changes

  return [storedValue, setValue, isLoading] as const;
}
