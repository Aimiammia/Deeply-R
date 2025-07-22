
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLock } from '@/contexts/LockContext';
import { useData } from '@/contexts/DataContext';
import { Brain } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isUnlocked, isLoading: isLockLoading } = useLock();
  const { isLoading: isDataLoading } = useData();
  const router = useRouter();

  const isAppLoading = isLockLoading || isDataLoading;

  useEffect(() => {
    // If not loading and not unlocked, redirect to lock screen
    if (!isAppLoading && !isUnlocked) {
      router.push('/lock');
    }
  }, [isUnlocked, isAppLoading, router]);

  // Show a full-screen loading animation while checking lock status or initial data
  if (isAppLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        <p className="mt-4 text-muted-foreground">در حال بارگذاری برنامه...</p>
      </div>
    );
  }

  // If unlocked, show the main application content
  if (isUnlocked) {
    return <>{children}</>;
  }

  // Fallback, should be handled by redirect but good to have
  return null;
}
