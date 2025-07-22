
'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { Brain } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

/**
 * AppGuard ensures that a component is only rendered on the client side
 * after initial data has been loaded.
 * It prevents hydration mismatches by showing a fallback on the server
 * and during the initial client render & data fetch, then showing the children.
 */
export function AppGuard({ children }: { children: ReactNode }) {
  const { isInitialLoadComplete } = useData();

  if (!isInitialLoadComplete) {
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
      </div>
    );
  }

  // Once the client has mounted and data is loaded, render the actual page content.
  return <>{children}</>;
}
