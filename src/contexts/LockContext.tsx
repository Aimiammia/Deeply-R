
// This file is deprecated and no longer used.
// The app now uses cloud-based auth with AuthContext.
import { createContext, useContext, type ReactNode } from 'react';

const LockContext = createContext<any>(undefined);

export const LockProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LockContext.Provider value={{
        isUnlocked: true,
        isPasswordSet: true,
        isLoading: false,
        unlock: () => true,
        setPassword: () => {},
        lock: () => {},
        lockError: null,
    }}>
        {children}
    </LockContext.Provider>
  );
};

export function useLock() {
  const context = useContext(LockContext);
  if (context === undefined) {
    throw new Error('useLock must be used within a LockProvider');
  }
  return context;
}
