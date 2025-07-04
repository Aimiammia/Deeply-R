
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

const PASSWORD_KEY = 'deeply-app-password';

interface LockContextType {
  isUnlocked: boolean;
  isPasswordSet: boolean;
  unlock: (password: string) => boolean;
  lock: () => void;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

export function LockProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if a password is set on initial load
    const storedPassword = localStorage.getItem(PASSWORD_KEY);
    setIsPasswordSet(!!storedPassword);
  }, []);

  const lock = () => {
    setIsUnlocked(false);
  };
  
  const unlock = useCallback((password: string): boolean => {
    const storedPassword = localStorage.getItem(PASSWORD_KEY);
    if (storedPassword) {
      // Password exists, check if it matches
      if (password === storedPassword) {
        setIsUnlocked(true);
        return true;
      } else {
        toast({
            title: "رمز عبور نامعتبر",
            description: "رمز عبور وارد شده صحیح نیست.",
            variant: "destructive",
        });
        return false;
      }
    } else {
      // No password set, so this is the first time. Set the password.
      localStorage.setItem(PASSWORD_KEY, password);
      setIsPasswordSet(true);
      setIsUnlocked(true);
      toast({
          title: "رمز عبور تنظیم شد",
          description: "این رمز برای ورودهای بعدی استفاده خواهد شد. آن را به خاطر بسپارید.",
      });
      return true;
    }
  }, [toast]);
  

  return (
    <LockContext.Provider value={{ isUnlocked, isPasswordSet, unlock, lock }}>
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
