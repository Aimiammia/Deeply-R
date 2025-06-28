
'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { encrypt, decrypt } from '@/lib/crypto';
import { useToast } from '@/hooks/use-toast';

const PASSWORD_CHECK_KEY = 'deeply-auth-check';
const PASSWORD_CHECK_VALUE = 'deeply-password-is-correct';

interface AuthContextType {
  isLocked: boolean;
  isPasswordSet: boolean;
  passwordKey: string | null;
  setPassword: (password: string) => void;
  unlock: (password: string) => boolean;
  lock: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const [passwordKey, setPasswordKey] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if a password has been set on initial load
    const checkValue = localStorage.getItem(PASSWORD_CHECK_KEY);
    setIsPasswordSet(!!checkValue);
    setIsLocked(!!checkValue); // Lock if password is set
  }, []);

  const setPassword = useCallback((password: string) => {
    if (password.length < 6) {
      toast({
        title: "رمز عبور ضعیف",
        description: "رمز عبور باید حداقل ۶ کاراکتر باشد.",
        variant: "destructive",
      });
      return;
    }
    const encryptedCheck = encrypt(PASSWORD_CHECK_VALUE, password);
    localStorage.setItem(PASSWORD_CHECK_KEY, encryptedCheck);
    setPasswordKey(password);
    setIsPasswordSet(true);
    setIsLocked(false);
    toast({
      title: "رمز عبور تنظیم شد",
      description: "برنامه شما اکنون با رمز عبور محافظت می‌شود.",
    });
  }, [toast]);

  const unlock = useCallback((password: string) => {
    const checkValue = localStorage.getItem(PASSWORD_CHECK_KEY);
    if (!checkValue) return false;

    const decryptedCheck = decrypt(checkValue, password);
    if (decryptedCheck === PASSWORD_CHECK_VALUE) {
      setPasswordKey(password);
      setIsLocked(false);
      return true;
    }
    return false;
  }, []);

  const lock = useCallback(() => {
    setPasswordKey(null);
    setIsLocked(true);
  }, []);

  return (
    <AuthContext.Provider value={{ isLocked, isPasswordSet, passwordKey, setPassword, unlock, lock }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
