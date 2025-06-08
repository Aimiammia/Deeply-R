import { Brain } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="bg-background py-3 shadow-sm border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* ThemeToggle will be on the right in RTL */}
        <div className="flex items-center">
           <ThemeToggle />
        </div>
        
        {/* Title group will be centered */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Brain className="h-7 w-7 text-primary" /> 
          <h1 className="text-2xl font-headline font-bold text-primary">
            Deeply
          </h1>
        </div>

        {/* Spacer for balance, effectively on the left in RTL */}
        <div className="w-10 h-10" /> 
      </div>
    </header>
  );
}
