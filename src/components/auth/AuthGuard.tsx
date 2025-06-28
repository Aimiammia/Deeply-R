
'use client';

import { type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LockScreen } from './LockScreen';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLocked, isLoading } = useAuth();

  if (isLoading) {
    // Show a full-screen loader while checking auth status
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isLocked) {
    return <LockScreen />;
  }

  return <>{children}</>;
}
