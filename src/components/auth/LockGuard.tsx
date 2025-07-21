
'use client';

import { type ReactNode } from 'react';
import { useLock } from '@/contexts/LockContext';
import { usePathname } from 'next/navigation';
import LockPage from '@/app/lock/page';
import { Brain } from 'lucide-react';

export function LockGuard({ children }: { children: ReactNode }) {
  const { isUnlocked, isLoading } = useLock();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
      </div>
    );
  }

  if (!isUnlocked) {
    // Show the lock page, but don't render it if we are already on it to avoid loops
    return pathname === '/lock' ? children : <LockPage />;
  }

  // If unlocked, and we are on the lock page, redirect to home.
  // This part is tricky in App Router. For now, we render children,
  // and the LockPage component itself can handle redirection if it detects an unlocked state.
  if (isUnlocked && pathname === '/lock') {
     // A better solution would involve a redirect, but this prevents content flash
     return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
       </div>
     );
  }
  
  return <>{children}</>;
}
