'use client';

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { 
    type User, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Assumes firebase is configured to handle null
import { Brain } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if firebase is configured
  const isFirebaseConfigured = !!auth;

  useEffect(() => {
    if (!isFirebaseConfigured) {
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isFirebaseConfigured]);

  const login = useCallback((email: string, password: string) => {
      if (!isFirebaseConfigured) return Promise.reject(new Error("Firebase not configured"));
      return signInWithEmailAndPassword(auth, email, password);
  }, [isFirebaseConfigured]);

  const signup = useCallback((email: string, password: string) => {
      if (!isFirebaseConfigured) return Promise.reject(new Error("Firebase not configured"));
      return createUserWithEmailAndPassword(auth, email, password);
  }, [isFirebaseConfigured]);
  
  const logout = useCallback(() => {
    if (!isFirebaseConfigured) return Promise.resolve();
    return signOut(auth);
  }, [isFirebaseConfigured]);
  

  const value = { user, loading, isFirebaseConfigured, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
        {loading ? (
             <div className="flex flex-col items-center justify-center min-h-screen bg-background">
                <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
            </div>
        ) : children}
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