'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from './use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { app, isFirebaseConfigured } from '@/lib/firebase';


// Debounce function to prevent rapid writes
const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: NodeJS.Timeout | null = null;
  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
  return debounced as (...args: Parameters<F>) => void;
};


export function useFirestore<T>(collectionName: string, initialValue: T) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [localValue, setLocalValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  const db = isFirebaseConfigured ? getFirestore(app) : null;
  
  // Memoize the debounced setDoc function
  const debouncedSetDocRef = useRef(
    debounce((dbInstance, docRef, data) => {
      setDoc(docRef, data, { merge: true }).catch(error => {
        console.error("Error writing document: ", error);
        toast({
          title: 'خطای ذخیره‌سازی',
          description: 'اطلاعات شما در فضای ابری ذخیره نشد.',
          variant: 'destructive',
        });
      });
    }, 1500) // Wait 1.5 seconds after the last change to save
  );

  // --- 1. Load initial data and set up real-time listener ---
  useEffect(() => {
    if (!user || !db) {
      setIsLoading(false);
      // If user logs out, reset to initial value.
      if (!user) setLocalValue(initialValue);
      return;
    }

    setIsLoading(true);
    const docRef = doc(db, `users/${user.uid}/${collectionName}`, 'data');
    
    // Set up the real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setLocalValue(data.value);
        } else {
            // Document doesn't exist, maybe it's the first time
            // Or data was deleted. We'll set it to the initial value.
            setLocalValue(initialValue);
        }
        setIsLoading(false);
    }, (error) => {
        console.error("Firestore snapshot error:", error);
        toast({
          title: 'خطا در همگام‌سازی',
          description: 'ارتباط با دیتابیس برای به‌روزرسانی زنده قطع شد.',
          variant: 'destructive',
        });
        setIsLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [collectionName, user, db]); // Rerun if user or collection changes

  // --- 2. Function to update state ---
  const setSyncedValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      if (!user || !db) {
         toast({
          title: 'خطای ذخیره‌سازی',
          description: 'برای ذخیره اطلاعات باید وارد حساب کاربری خود شوید.',
          variant: 'destructive',
        });
        return;
      }
      
      const valueToStore = newValue instanceof Function ? newValue(localValue) : newValue;

      // Update local state immediately for a responsive UI
      setLocalValue(valueToStore);

      // Persist to Firestore via the debounced function
      const docRef = doc(db, `users/${user.uid}/${collectionName}`, 'data');
      debouncedSetDocRef.current(db, docRef, { value: valueToStore });
    },
    [user, db, collectionName, localValue, toast]
  );

  return [localValue, setSyncedValue, isLoading] as const;
}