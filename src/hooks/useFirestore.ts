
'use client';

import {useState, useEffect, useCallback} from 'react';
import {useToast} from './use-toast';

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

// This hook now uses a local API route to persist data,
// making it accessible across devices on the same local network.
export function useFirestore<T>(collectionName: string, initialValue: T) {
  const {toast} = useToast();
  const [localValue, setLocalValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. Load initial data from the local API ---
  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/data/${collectionName}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        if (data.value) {
          setLocalValue(data.value);
        } else {
          setLocalValue(initialValue);
        }
      })
      .catch(error => {
        console.error('Failed to fetch initial data:', error);
        toast({
          title: 'خطا در بارگذاری اطلاعات',
          description:
            'نتوانستیم اطلاعات را از سرور محلی دریافت کنیم. لطفاً از روشن بودن سرور مطمئن شوید.',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [collectionName, initialValue, toast]);

  // --- 2. Debounced write to the local API ---
  const debouncedSetDoc = useCallback(
    debounce((key: string, data: {value: T}) => {
      fetch(`/api/data/${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).catch(error => {
        console.error('Failed to save to local API:', error);
        toast({
          title: 'خطای ذخیره‌سازی',
          description: 'اطلاعات شما در سرور محلی ذخیره نشد.',
          variant: 'destructive',
        });
      });
    }, 1500), // Wait 1.5 seconds after the last change to save
    [toast]
  );

  // --- 3. Function to update state ---
  const setSyncedValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      const valueToStore =
        newValue instanceof Function ? newValue(localValue) : newValue;

      // Update local state immediately for a responsive UI
      setLocalValue(valueToStore);

      // Persist to the local API
      debouncedSetDoc(collectionName, {value: valueToStore});
    },
    [localValue, debouncedSetDoc, collectionName]
  );

  return [localValue, setSyncedValue, isLoading] as const;
}
