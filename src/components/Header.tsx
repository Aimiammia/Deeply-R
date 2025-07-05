'use client';

import { Brain, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const HeaderComponent = () => {
  const { logout, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      toast({ title: "شما با موفقیت خارج شدید." });
    } catch (error) {
      toast({ title: "خطا در خروج", description: "مشکلی در فرآیند خروج پیش آمد.", variant: "destructive" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        {/* Right side in RTL */}
        <div className="flex w-10 justify-start">
           <ThemeToggle />
        </div>
        
        {/* Title group will be centered */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Brain className="h-7 w-7 text-primary" /> 
          <h1 className="text-2xl font-headline font-bold text-foreground">
            Deeply
          </h1>
        </div>

        {/* Left side in RTL */}
        <div className="flex w-10 justify-end"> 
          {user && (
           <Button variant="ghost" size="icon" onClick={handleLogout} title="خروج از حساب">
               <LogOut className="h-5 w-5" />
           </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);