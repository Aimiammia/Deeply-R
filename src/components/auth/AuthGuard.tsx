
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Brain, Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
          <div className="relative flex items-center justify-center h-24 w-24 mb-6">
            <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
            <Loader2 className="absolute h-24 w-24 text-primary/20 animate-spin-slow" style={{ animationDuration: '3s' }}/>
        </div>
        <p className="text-muted-foreground">در حال بارگذاری برنامه...</p>
      </div>
    );
  }

  return <>{children}</>;
}
