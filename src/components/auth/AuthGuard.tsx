
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLock } from '@/contexts/LockContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isUnlocked, isLoading } = useLock();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isUnlocked) {
      router.push('/lock');
    }
  }, [isUnlocked, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <p className="mt-4 text-muted-foreground">در حال بارگذاری برنامه...</p>
      </div>
    );
  }

  if (!isUnlocked) {
    return null; // The redirect will handle this.
  }

  return <>{children}</>;
}
