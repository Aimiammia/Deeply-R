'use client';

import { Brain, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { memo } from 'react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const HeaderComponent = () => {
  const { logout } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        
        <div className="flex w-10 justify-start">
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" title="خروج از حساب">
                    <LogOut className="h-5 w-5 text-muted-foreground" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>خروج از حساب کاربری</AlertDialogTitle>
                  <AlertDialogDescription>
                    آیا برای خروج از حساب کاربری خود مطمئن هستید؟
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>لغو</AlertDialogCancel>
                  <AlertDialogAction onClick={() => logout()} variant="destructive">
                    خروج
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
