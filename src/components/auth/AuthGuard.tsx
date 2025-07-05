'use client';

import { type ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Brain } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const PUBLIC_ROUTES = ['/login', '/signup'];

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Don't do anything while loading

    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (user && isPublic) {
        // If user is logged in and tries to access login/signup, redirect to home
        router.push('/');
    } else if (!user && !isPublic) {
        // If user is not logged in and tries to access a protected route, redirect to login
        router.push('/login');
    }

  }, [user, loading, pathname, router]);

  // While loading, or if conditions are not met yet for redirection, show a loading screen or nothing
  if (loading || (!user && !PUBLIC_ROUTES.includes(pathname)) || (user && PUBLIC_ROUTES.includes(pathname))) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        </div>
      );
  }
  
  return <>{children}</>;
}