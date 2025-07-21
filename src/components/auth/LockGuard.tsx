'use client';

import { type ReactNode, useEffect } from 'react';
import { useLock } from '@/contexts/LockContext';
import { Brain } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const PUBLIC_ROUTES = ['/lock'];

interface LockGuardProps {
  children: ReactNode;
}

export function LockGuard({ children }: LockGuardProps) {
  const { isUnlocked, isLoading, isPasswordSet } = useLock();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Don't do anything while loading

    const isPublic = PUBLIC_ROUTES.includes(pathname);
    
    // If the app is locked (isUnlocked is false AND a password is set),
    // and we are not on the lock page, redirect to the lock page.
    if (!isUnlocked && isPasswordSet && !isPublic) {
        router.push('/lock');
    }
    
    // If the app is unlocked and we are on the lock page, redirect to home.
    if (isUnlocked && isPublic) {
        router.push('/');
    }

  }, [isUnlocked, isLoading, isPasswordSet, pathname, router]);

  // While loading, or if conditions for redirection are met, show a loading screen
  if (isLoading || (!isUnlocked && !PUBLIC_ROUTES.includes(pathname))) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        </div>
      );
  }
  
  return <>{children}</>;
}
