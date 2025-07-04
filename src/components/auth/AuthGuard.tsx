
'use client';

import { type ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Brain } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/login') {
        // If not authenticated and not on login page, redirect to login
        router.push('/login');
      } else if (user && pathname === '/login') {
        // If authenticated and on login page, redirect to home
        router.push('/');
      }
    }
  }, [user, isLoading, pathname, router]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        <p className="mt-4 text-lg font-semibold text-primary/80 animate-pulse-slow [animation-delay:0.2s]">
          Deeply
        </p>
      </div>
    );
  }
  
  // If user is not loaded yet, or if user is loaded and we are on the correct page, show children
  // This prevents content flash while redirecting
  if (!user && pathname !== '/login') {
      return null; // or a loading spinner
  }
  
  if (user && pathname === '/login') {
      return null; // or a loading spinner
  }

  return <>{children}</>;
}
