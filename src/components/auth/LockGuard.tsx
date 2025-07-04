
'use client';

import { type ReactNode, useEffect } from 'react';
import { useLock } from '@/contexts/LockContext';
import { Brain } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface LockGuardProps {
  children: ReactNode;
}

export function LockGuard({ children }: LockGuardProps) {
  const { isUnlocked } = useLock();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUnlocked && pathname !== '/lock') {
      router.push('/lock');
    }
  }, [isUnlocked, pathname, router]);

  if (!isUnlocked && pathname !== '/lock') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        </div>
      );
  }
  
  return <>{children}</>;
}
