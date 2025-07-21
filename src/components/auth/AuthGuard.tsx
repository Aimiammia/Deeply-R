
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
  const { user, isLoading, isFirebaseConfigured } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Don't do anything while loading

    const isPublic = PUBLIC_ROUTES.includes(pathname);
    
    // If Firebase isn't set up, everything is public.
    if (!isFirebaseConfigured && !isPublic) {
        // Redirect to login page which shows the config warning
        router.push('/login');
        return;
    }

    // If user is not logged in and tries to access a private page
    if (!user && !isPublic) {
        router.push(`/login?redirect_to=${pathname}`);
    }
    
    // If user is logged in and tries to access a public page (like login)
    if (user && isPublic) {
        router.push('/');
    }

  }, [user, isLoading, isFirebaseConfigured, pathname, router]);

  // While loading, or if conditions for redirection are met, show a loading screen
  if (isLoading || (!user && !PUBLIC_ROUTES.includes(pathname))) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        </div>
      );
  }
  
  return <>{children}</>;
}
