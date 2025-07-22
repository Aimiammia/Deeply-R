
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';

interface LockContextType {
  isUnlocked: boolean;
  isLoading: boolean;
  hasPassword: () => boolean;
  unlock: (password: string) => boolean;
  lock: () => void;
  setPassword: (password: string) => void;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

export function LockProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [storedPassword, setStoredPassword, isPasswordLoading] = useLocalStorageState<string | null>('app-lock-password', null);
  const router = useRouter();
  
  const hasPassword = useCallback(() => {
    return storedPassword !== null;
  }, [storedPassword]);

  const unlock = useCallback((password: string) => {
    if (password === storedPassword) {
      setIsUnlocked(true);
      sessionStorage.setItem('session-unlocked', 'true'); // Keep unlocked for the session
      router.push('/');
      return true;
    }
    return false;
  }, [storedPassword, router]);
  
  const lock = useCallback(() => {
    setIsUnlocked(false);
    sessionStorage.removeItem('session-unlocked');
    router.push('/lock');
  }, [router]);
  
  const setPassword = useCallback((password: string) => {
    setStoredPassword(password);
    unlock(password); // Automatically unlock after setting password
  }, [setStoredPassword, unlock]);
  
  // Check session storage on initial load
  useEffect(() => {
    const sessionUnlocked = sessionStorage.getItem('session-unlocked');
    if (sessionUnlocked === 'true' && hasPassword()) {
      setIsUnlocked(true);
    }
  }, [hasPassword]);

  const value = {
    isUnlocked,
    isLoading: isPasswordLoading,
    hasPassword,
    unlock,
    lock,
    setPassword,
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
