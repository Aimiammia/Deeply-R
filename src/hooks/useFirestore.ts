
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  DocumentReference,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export function useFirestore<T>(
  collectionName: string,
  initialValue: T
): readonly [T, (value: T | ((val: T) => T)) => void, boolean] {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  const docRef = useRef<DocumentReference | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || authLoading) {
      // If firebase is not configured or auth is still loading, don't do anything.
      // The loading state will be true until auth resolves.
      return;
    }
    
    if (user) {
      // User is logged in, use their specific document in Firestore
      docRef.current = doc(db, 'users', user.uid, 'data', collectionName);
      setIsLoading(true);

      const unsubscribe = onSnapshot(
        docRef.current,
        (docSnap) => {
          if (docSnap.exists()) {
            const serverData = docSnap.data()?.value as T;
            setData(serverData);
          } else {
            // Document doesn't exist, so we set the initial value in Firestore
            setDoc(docRef.current, { value: initialValue }).catch(error => {
                console.error("Error setting initial document in Firestore:", error);
            });
            setData(initialValue);
          }
          setIsLoading(false);
        },
        (error) => {
          console.error(`Error listening to Firestore document ${collectionName}:`, error);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      // No user, reset to initial state and stop loading. Do not touch Firestore.
      setData(initialValue);
      setIsLoading(false);
      docRef.current = null;
    }
  }, [user, authLoading, collectionName]); // initialValue is stable, safe to include if needed but not necessary

  const setFirestoreData = useCallback(
    (newValue: T | ((val: T) => T)) => {
      if (docRef.current && user) {
        // We have a user and a document reference, update Firestore
        const valueToStore = newValue instanceof Function ? newValue(data) : newValue;
        
        setData(valueToStore); // Optimistic update
        
        setDoc(docRef.current, { value: valueToStore }, { merge: true }).catch(
          (error) => {
            console.error(`Error writing to Firestore document ${collectionName}:`, error);
            // Optionally revert optimistic update here or show a toast
          }
        );
      } else if (!isFirebaseConfigured || !user) {
          // Firebase is not set up or user is logged out. We fall back to a non-persistent state update.
          // This allows the UI to remain responsive but data won't be saved.
          console.warn("Attempted to set data without a logged-in user or Firebase config. State will not be persisted.");
          const valueToStore = newValue instanceof Function ? newValue(data) : newValue;
          setData(valueToStore);
      }
    },
    [data, user, collectionName]
  );

  return [data, setFirestoreData, isLoading || authLoading] as const;
}
