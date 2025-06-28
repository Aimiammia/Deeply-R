
'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, useRef } from 'react';
import { encrypt, decrypt } from '@/lib/crypto';
import { useToast } from '@/hooks/use-toast';

const PASSWORD_CHECK_KEY = 'deeply-auth-check';
const PASSWORD_CHECK_VALUE = 'deeply-password-is-correct';
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const ALL_APP_KEYS = [
  'dailyTasksPlanner', 'allProjects', 'dailyReflections', 'financialTransactions',
  'financialBudgets', 'financialAssets', 'financialInvestments', 'financialSavingsGoals',
  'calendarBirthdaysDeeply', 'calendarEventsDeeply', 'userHabitsDeeply', 'dailyActivityLogsDeeply',
  'longTermGoals', 'userBooksDeeply', 'userSportsActivitiesDeeply', 'activeFastDeeply',
  'fastingHistoryDeeply', 'educationalLevelSettingsDeeply', 'educationalSubjectProgressDeeply',
  'knowledgeBasePages', 'projectTemplates', 'thirtyDayChallenges',
  'theme', 'color-theme', 'deeply-auth-check'
];

interface AuthContextType {
  isLocked: boolean;
  isPasswordSet: boolean;
  setPassword: (password: string) => void;
  unlock: (password: string) => boolean;
  lock: () => void;
  getEncryptionKey: () => string | null;
  resetApp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const passwordKeyRef = useRef<string | null>(null);
  const { toast } = useToast();
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const lock = useCallback(() => {
    passwordKeyRef.current = null;
    setIsLocked(true);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(lock, INACTIVITY_TIMEOUT);
  }, [lock]);

  useEffect(() => {
    const checkValue = localStorage.getItem(PASSWORD_CHECK_KEY);
    setIsPasswordSet(!!checkValue);
    setIsLocked(!!checkValue); 
  }, []);

  useEffect(() => {
    if (!isLocked && isPasswordSet) {
      const events: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
      
      resetInactivityTimer();
      
      events.forEach(event => window.addEventListener(event, resetInactivityTimer));
      
      return () => {
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
        events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
      };
    }
  }, [isLocked, isPasswordSet, resetInactivityTimer]);

  const getEncryptionKey = useCallback(() => {
    return passwordKeyRef.current;
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
    passwordKeyRef.current = password;
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
      passwordKeyRef.current = password;
      setIsLocked(false);
      return true;
    }
    return false;
  }, []);

  const resetApp = useCallback(() => {
    ALL_APP_KEYS.forEach(key => {
        localStorage.removeItem(key);
    });
    toast({
        title: "برنامه بازنشانی شد",
        description: "تمام اطلاعات محلی شما پاک شد. لطفاً یک رمز عبور جدید تنظیم کنید.",
        variant: "destructive"
    });
    // Reload the page to start from scratch
    window.location.reload();
  }, [toast]);

  return (
    <AuthContext.Provider value={{ isLocked, isPasswordSet, setPassword, unlock, lock, getEncryptionKey, resetApp }}>
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
