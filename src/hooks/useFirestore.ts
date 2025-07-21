
'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, setDoc, onSnapshot, type DocumentData } from 'firebase/firestore';

// This hook manages both a local state (for speed and offline access)
// and syncs it with Firestore for cloud backup and multi-device access.
export function useFirestore<T>(collectionName: string, initialValue: T) {
  const { user, isFirebaseConfigured } = useAuth();
  const [localValue, setLocalValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  const docId = collectionName; // We use one document per collection for this user's data

  // Memoize the document reference
  const docRef = user && isFirebaseConfigured ? doc(db, 'users', user.uid, 'data', docId) : null;

  // Effect to load initial data and set up listener
  useEffect(() => {
    if (!user || !isFirebaseConfigured || !docRef) {
      // If no user or firebase, we just use the local state.
      // Attempt to load from localStorage as a fallback for non-logged-in state.
      try {
        const item = window.localStorage.getItem(docId);
        if (item) {
          setLocalValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Could not load from localStorage for key ${docId}:`, error);
      }
      setIsLoading(false);
      return;
    }

    // Set up the real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data().value as T;
        setLocalValue(firestoreData);
        // Also update localStorage for offline access
        window.localStorage.setItem(docId, JSON.stringify(firestoreData));
      } else {
        // Doc doesn't exist, maybe it's the first time.
        // Let's check localStorage first.
        try {
            const item = window.localStorage.getItem(docId);
            if (item) {
                const localData = JSON.parse(item);
                setLocalValue(localData);
                // And write it to Firestore
                setDoc(docRef, { value: localData });
            } else {
                // Not in localStorage either, use initialValue and write to Firestore
                 setDoc(docRef, { value: initialValue });
            }
        } catch (error) {
            console.warn(`Could not sync from localStorage to Firestore for key ${docId}:`, error);
        }
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore listener error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, isFirebaseConfigured, docId, docRef]);


  // The setter function that updates both local state and Firestore
  const setSyncedValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
        const valueToStore = newValue instanceof Function ? newValue(localValue) : newValue;
        
        // Update local state immediately for responsiveness
        setLocalValue(valueToStore);
        // Update localStorage for offline persistence
        window.localStorage.setItem(docId, JSON.stringify(valueToStore));

        // Update Firestore if available
        if (docRef) {
            setDoc(docRef, { value: valueToStore }, { merge: true })
            .catch(error => {
                console.error("Error writing to Firestore:", error);
                // Optional: Implement a retry mechanism or user notification
            });
        }
    },
    [localValue, docRef, docId]
  );

  return [localValue, setSyncedValue, isLoading] as const;
}
