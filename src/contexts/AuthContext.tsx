
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
    type User, 
    type Auth, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { Brain } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
    if (!isFirebaseConfigured) return Promise.reject(new Error("Firebase not configured"));
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signup = (email: string, pass: string) => {
    if (!isFirebaseConfigured) return Promise.reject(new Error("Firebase not configured"));
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => {
    if (!isFirebaseConfigured) return Promise.resolve();
    return signOut(auth);
  };
  

  const value = {
    user,
    isLoading,
    isFirebaseConfigured,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
        {isLoading ? (
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
