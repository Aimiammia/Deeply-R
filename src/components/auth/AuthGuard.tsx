
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Brain } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        <p className="mt-4 text-muted-foreground">در حال بارگذاری برنامه...</p>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
}
