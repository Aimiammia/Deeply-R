
'use client';

import { Brain } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { memo } from 'react';
import { Button } from './ui/button';

const HeaderComponent = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        
        <div className="flex w-10 justify-start">
          {/* Placeholder for left-aligned content */}
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Brain className="h-7 w-7 text-primary" /> 
          <h1 className="text-2xl font-headline font-bold text-foreground">
            Deeply
          </h1>
        </div>

        <div className="flex w-10 justify-end"> 
           <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);
