
'use client';

import { type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Brain } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    // Show a loading indicator while the app initializes.
    // In the future, this will wait for the Firebase auth state to be confirmed.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        <p className="mt-4 text-lg font-semibold text-primary/80 animate-pulse-slow [animation-delay:0.2s]">
          Deeply
        </p>
      </div>
    );
  }

  // The lock screen logic has been removed to prepare for Firebase authentication.
  // The app is now always "unlocked" at this stage.
  return <>{children}</>;
}
