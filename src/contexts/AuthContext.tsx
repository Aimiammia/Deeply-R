
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    type User 
} from 'firebase/auth';
import { app, isFirebaseConfigured } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapFirebaseError = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'فرمت ایمیل نامعتبر است.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'ایمیل یا رمز عبور اشتباه است.';
        case 'auth/email-already-in-use':
            return 'این ایمیل قبلاً استفاده شده است.';
        case 'auth/weak-password':
            return 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
        default:
            return 'خطایی رخ داد. لطفاً دوباره تلاش کنید.';
    }
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthError(null);
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      setAuthError(mapFirebaseError(error.code));
    }
  };

  const signup = async (email: string, password: string) => {
    setAuthError(null);
    const auth = getAuth(app);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      setAuthError(mapFirebaseError(error.code));
    }
  };

  const logout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      router.push('/login');
       toast({
        title: "خروج موفق",
        description: "شما با موفقیت از حساب کاربری خود خارج شدید.",
      });
    } catch (error: any) {
      setAuthError('خطا در هنگام خروج از حساب کاربری.');
    }
  };

  const value = {
    user,
    isLoading,
    isFirebaseConfigured,
    login,
    signup,
    logout,
    authError
  };

  return (
    <AuthContext.Provider value={value}>
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
