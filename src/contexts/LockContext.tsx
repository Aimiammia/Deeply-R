'use client';

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';

interface LockContextType {
  isUnlocked: boolean;
  isPasswordSet: boolean;
  isLoading: boolean;
  unlock: (password: string) => boolean;
  setPassword: (password: string) => void;
  lock: () => void;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

export function LockProvider({ children }: { children: ReactNode }) {
  const [storedPassword, setStoredPassword, isStorageLoading] = useLocalStorageState<string | null>('app_lock_pass', null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const isPasswordSet = storedPassword !== null;
  const isLoading = isStorageLoading;

  useEffect(() => {
    // If no password is set, the app is considered "unlocked" but needs setup.
    if (!isStorageLoading && !isPasswordSet) {
      setIsUnlocked(true);
    }
  }, [isPasswordSet, isStorageLoading]);


  const unlock = useCallback((password: string): boolean => {
    if (password === storedPassword) {
      setIsUnlocked(true);
      return true;
    }
    return false;
  }, [storedPassword]);

  const setPassword = useCallback((password: string) => {
    setStoredPassword(password);
    setIsUnlocked(true);
  }, [setStoredPassword]);

  const lock = useCallback(() => {
    setIsUnlocked(false);
  }, []);

  const value = {
    isUnlocked,
    isPasswordSet,
    isLoading,
    unlock,
    setPassword,
    lock,
  };

  return <LockContext.Provider value={value}>{children}</LockContext.Provider>;
}

export function useLock() {
  const context = useContext(LockContext);
  if (context === undefined) {
    throw new Error('useLock must be used within a LockProvider');
  }
  return context;
}
