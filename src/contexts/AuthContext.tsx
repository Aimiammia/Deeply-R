
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// This is a placeholder context to prepare for a full cloud-based authentication system.
// The previous local password and encryption system has been removed to allow for this upgrade.

interface AuthContextType {
  isLoading: boolean;
  // All other properties like isLocked, setPassword, etc., are removed for now.
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading check (e.g., checking for a Firebase user session in the future)
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 500); // A small delay to show a loading indicator, similar to a real auth check
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading }}>
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
