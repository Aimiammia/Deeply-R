
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface LockContextType {
  isUnlocked: boolean;
  isPasswordSet: boolean;
  isLoading: boolean;
  unlock: (password: string) => boolean;
  setPassword: (password: string) => void;
  lock: () => void;
  lockError: string | null;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

// A simple (and not cryptographically secure) way to "hash" a password for local storage.
// This is just to prevent plain-text storage. For a real app, use a proper library like bcrypt.
const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        const chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
};

export function LockProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const [storedPasswordHash, setStoredPasswordHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lockError, setLockError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const hash = localStorage.getItem('deeply_lock_hash');
      if (hash) {
        setStoredPasswordHash(hash);
        setIsPasswordSet(true);
      }
    } catch (error) {
      console.error("Could not access localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const unlock = (password: string): boolean => {
    setLockError(null);
    if (simpleHash(password) === storedPasswordHash) {
      setIsUnlocked(true);
      router.push('/');
      return true;
    }
    setLockError("رمز عبور اشتباه است.");
    return false;
  };

  const setPassword = (password: string) => {
    setLockError(null);
     if (password.length < 4) {
        setLockError("رمز عبور باید حداقل ۴ کاراکتر باشد.");
        return;
    }
    try {
      const hash = simpleHash(password);
      localStorage.setItem('deeply_lock_hash', hash);
      setStoredPasswordHash(hash);
      setIsPasswordSet(true);
      setIsUnlocked(true);
      router.push('/');
    } catch (error) {
      console.error("Could not set password in localStorage", error);
      setLockError("خطا در ذخیره رمز عبور.");
    }
  };

  const lock = () => {
    setIsUnlocked(false);
    router.push('/lock');
  };

  const value = {
    isUnlocked,
    isPasswordSet,
    isLoading,
    unlock,
    setPassword,
    lock,
    lockError,
  };

  return (
    <LockContext.Provider value={value}>
        {children}
    </LockContext.Provider>
  );
}

export function useLock() {
  const context = useContext(LockContext);
  if (context === undefined) {
    throw new Error('useLock must be used within a LockProvider');
  }
  return context;
}
