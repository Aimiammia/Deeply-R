import { Brain } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { memo } from 'react';

const HeaderComponent = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        {/* ThemeToggle will be on the right in RTL */}
        <div className="flex items-center">
           <ThemeToggle />
        </div>
        
        {/* Title group will be centered */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Brain className="h-7 w-7 text-primary" /> 
          <h1 className="text-2xl font-headline font-bold text-foreground">
            Deeply
          </h1>
        </div>

        {/* Spacer for balance, effectively on the left in RTL */}
        <div className="w-10 h-10" /> 
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);
