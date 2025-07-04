
'use client';

import { Brain, Lock } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { memo } from 'react';
import { useLock } from '@/contexts/LockContext';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const HeaderComponent = () => {
  const { lock } = useLock();
  const router = useRouter();

  const handleLock = () => {
    lock();
    router.push('/lock');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        {/* Left side (in RTL) */}
        <div className="flex items-center gap-2">
           <ThemeToggle />
           <Button variant="ghost" size="icon" onClick={handleLock} title="قفل کردن برنامه">
               <Lock className="h-5 w-5" />
           </Button>
        </div>
        
        {/* Title group will be centered */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Brain className="h-7 w-7 text-primary" /> 
          <h1 className="text-2xl font-headline font-bold text-foreground">
            Deeply
          </h1>
        </div>

        {/* Spacer for balance, on the right in RTL */}
        <div className="w-10 h-10 flex items-center gap-2" /> 
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);
