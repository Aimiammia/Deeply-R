
'use client';

import { type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LockScreen } from './LockScreen';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLocked } = useAuth();

  if (isLocked) {
    return <LockScreen />;
  }

  return <>{children}</>;
}
