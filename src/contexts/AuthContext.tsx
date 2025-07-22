'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
import { Brain } from 'lucide-react';


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
            console.error("Firebase Auth Error:", errorCode);
            return 'خطایی رخ داد. لطفاً دوباره تلاش کنید.';
    }
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      // If on a protected route, redirect to login which will show the config error
      if (pathname !== '/login' && pathname !== '/signup') {
        router.push('/login');
      }
      return;
    }

    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
       if (user && (pathname === '/login' || pathname === '/signup')) {
        router.push('/');
      } else if (!user && pathname !== '/login' && pathname !== '/signup') {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [isFirebaseConfigured, pathname, router]);

  const login = async (email: string, password: string) => {
    setAuthError(null);
    if (!isFirebaseConfigured) return;
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
    if (!isFirebaseConfigured) return;
    const auth = getAuth(app);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      setAuthError(mapFirebaseError(error.code));
    }
  };

  const logout = async () => {
    if (!isFirebaseConfigured) return;
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
  
  // This guard prevents flicker by showing a loading screen until auth state is resolved.
  if (isLoading) {
     return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
      </div>
    );
  }

  // This guard handles routing based on auth state.
  if (!user && pathname !== '/login' && pathname !== '/signup') {
    // This will be handled by the useEffect, but we can return the loading screen
    // to prevent rendering children components that might depend on a user.
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        <p className="mt-4 text-muted-foreground">در حال انتقال به صفحه ورود...</p>
      </div>
    );
  }

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