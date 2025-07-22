
'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Brain } from 'lucide-react';

/**
 * AppGuard ensures that a component is only rendered on the client side.
 * It prevents hydration mismatches by showing a fallback on the server
 * and during the initial client render, then showing the children.
 */
export function AppGuard({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    setIsClient(true);
  }, []);

  // On the server and during the first client render, show nothing or a placeholder.
  // This avoids rendering anything that might depend on client-specific APIs or state.
  if (!isClient) {
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
      </div>
    );
  }

  // Once the client has mounted, render the actual page content.
  return <>{children}</>;
}
