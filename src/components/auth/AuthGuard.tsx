'use client';

import { type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LockScreen } from './LockScreen';
import { Brain } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLocked, isLoading } = useAuth();

  if (isLoading) {
    // Show a more engaging full-screen loader
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
        <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        <p className="mt-4 text-lg font-semibold text-primary/80 animate-pulse-slow [animation-delay:0.2s]">
          Deeply
        </p>
      </div>
    );
  }

  if (isLocked) {
    return <LockScreen />;
  }

  return <>{children}</>;
}
