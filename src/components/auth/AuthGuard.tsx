
'use client';

import { type ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Brain } from 'lucide-react';

const publicPaths = ['/login', '/signup'];

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading, isFirebaseConfigured } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading || !isFirebaseConfigured) return;

    const isPublic = publicPaths.includes(pathname);
    
    if (!user && !isPublic) {
      router.push('/login');
    }
    
    if (user && isPublic) {
      router.push('/');
    }

  }, [user, isLoading, router, pathname, isFirebaseConfigured]);
  

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
      </div>
    );
  }
  
  // Prevent content flash while redirecting
  const isPublic = publicPaths.includes(pathname);
  if ((!user && !isPublic) || (user && isPublic)) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
         </div>
      );
  }

  return <>{children}</>;
}
