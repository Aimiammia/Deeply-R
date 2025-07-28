
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';
import { isFirebaseConfigured, auth as firebaseAuth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      // Redirect to a page explaining the issue, or handle it gracefully
      // For now, we just stop loading and the AuthGuard will redirect to /login
      // which will show an error if Firebase isn't set up.
      return;
    }

    const auth: Auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
    if (!isFirebaseConfigured) throw new Error("Firebase is not configured.");
    return signInWithEmailAndPassword(firebaseAuth, email, pass);
  };

  const signup = (email: string, pass: string) => {
    if (!isFirebaseConfigured) throw new Error("Firebase is not configured.");
    return createUserWithEmailAndPassword(firebaseAuth, email, pass);
  };

  const logout = () => {
    if (!isFirebaseConfigured) throw new Error("Firebase is not configured.");
    return signOut(firebaseAuth);
  };
  
  const value = { user, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
