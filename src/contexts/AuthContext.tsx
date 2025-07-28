
'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  type ReactNode
} from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  type User,
  type Auth
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { useRouter } from 'next/navigation';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      // In a non-firebase setup, you might want to mock a user or leave it null.
      // For now, we assume no user if Firebase isn't configured.
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
      if (!isFirebaseConfigured) throw new Error("Firebase not configured.");
      return signInWithEmailAndPassword(auth, email, pass).then(() => {});
  };
  
  const signup = (email: string, pass: string) => {
      if (!isFirebaseConfigured) throw new Error("Firebase not configured.");
      return createUserWithEmailAndPassword(auth, email, pass).then(() => {});
  };

  const logout = () => {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured.");
    return signOut(auth).then(() => {
        router.push('/login');
    });
  };

  const value = { user, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
