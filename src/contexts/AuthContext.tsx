
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  type User, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Import auth, which can be null

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If Firebase is not configured, we are not loading and there's no user.
    if (!auth) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const firebaseNotConfiguredError = () => {
    const error = new Error("Firebase is not configured. Please check your .env.local file.");
    // Manually add a code to be more user-friendly on the login page
    (error as any).code = 'auth/firebase-not-configured';
    return Promise.reject(error);
  }

  const signup = (email: string, password: string) => {
    if (!auth) return firebaseNotConfiguredError();
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    if (!auth) return firebaseNotConfiguredError();
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!auth) return firebaseNotConfiguredError();
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout }}>
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
