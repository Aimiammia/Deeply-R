
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

// Debounce function to prevent rapid writes to Firestore
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
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
  const { user, isFirebaseConfigured } = useAuth();
  const { toast } = useToast();
  
  // Local state that is immediately updated for UI responsiveness
  const [localValue, setLocalValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Firestore document path (depends on the authenticated user)
  const docPath = user ? `users/${user.uid}/${collectionName}/data` : null;

  // --- 1. Load initial data ---
  useEffect(() => {
    // If not using Firebase, load from localStorage
    if (!isFirebaseConfigured) {
      try {
        const item = window.localStorage.getItem(collectionName);
        if (item) {
          setLocalValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Could not load from localStorage for key ${collectionName}:`, error);
      }
      setIsLoading(false);
      return;
    }

    // If using Firebase, but user is not logged in yet, do nothing.
    if (!docPath) {
      // If we know the user won't be logging in (e.g. auth is done loading and user is null),
      // we could set isLoading(false) here. For now, we wait.
      return;
    }

    // --- Firestore real-time listener ---
    const docRef = doc(db, docPath);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as { value: T };
        setLocalValue(data.value);
      } else {
        // Document doesn't exist, so we can initialize it with the initialValue
        setLocalValue(initialValue);
        // We might want to write this initial value to Firestore here,
        // but let's do that only on the first actual change to save writes.
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore snapshot error:", error);
      toast({ title: 'خطای همگام‌سازی', description: 'ارتباط با سرور برای همگام‌سازی اطلاعات قطع شد.', variant: 'destructive' });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, docPath, collectionName, initialValue, isFirebaseConfigured, toast]);

  // --- 2. Debounced write to Firestore ---
  const debouncedSetDoc = useCallback(
    debounce((path: string, data: { value: T }) => {
      if (!isFirebaseConfigured) return;
      const docRef = doc(db, path);
      setDoc(docRef, data).catch(error => {
        console.error("Failed to save to Firestore:", error);
        toast({ title: 'خطای ذخیره‌سازی', description: 'اطلاعات شما در سرور ذخیره نشد.', variant: 'destructive' });
      });
    }, 1500), // Wait 1.5 seconds after the last change to save
    [isFirebaseConfigured, toast] 
  );

  // --- 3. Function to update state ---
  const setSyncedValue = useCallback((newValue: T | ((val: T) => T)) => {
    // Determine the new value
    const valueToStore = newValue instanceof Function ? newValue(localValue) : newValue;
    
    // Update local state immediately for a responsive UI
    setLocalValue(valueToStore);

    // Persist to the appropriate storage
    if (isFirebaseConfigured && docPath) {
      debouncedSetDoc(docPath, { value: valueToStore });
    } else {
      // Fallback to localStorage if Firebase is not used
      try {
        window.localStorage.setItem(collectionName, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Could not write to localStorage for key ${collectionName}:`, error);
      }
    }
  }, [localValue, docPath, debouncedSetDoc, collectionName, isFirebaseConfigured]);

  return [localValue, setSyncedValue, isLoading] as const;
}
