
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useLock } from '@/contexts/LockContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, KeyRound, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';

export default function LockPage() {
  const { isUnlocked, hasPassword, unlock, setPassword, isLoading } = useLock();
  const { isLoading: isDataLoading } = useData();
  const [inputPassword, setInputPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // If already unlocked, redirect away from the lock page
    if (isUnlocked) {
        router.push('/');
    }
  }, [isUnlocked, router]);

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!unlock(inputPassword)) {
      setError('رمز عبور اشتباه است.');
    } else {
      // successful unlock is handled by context, which will trigger useEffect
    }
  };

  const handleSetPassword = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 4) {
      setError('رمز عبور باید حداقل ۴ کاراکتر باشد.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('رمزهای عبور با یکدیگر مطابقت ندارند.');
      return;
    }
    setPassword(newPassword);
    toast({
        title: "رمز عبور تنظیم شد",
        description: "اکنون می‌توانید با رمز جدید خود وارد شوید.",
    });
    // Setting password will also unlock and redirect via context state change
  };

  // Prevent rendering form while lock status is initializing or if already unlocked
  if (isLoading || isDataLoading) {
    return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6">
        <Brain className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-headline font-bold text-foreground">
          Deeply
        </h1>
      </div>
      <Card className="w-full max-w-sm shadow-2xl">
        {hasPassword() ? (
          <form onSubmit={handleUnlock}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">ورود به برنامه</CardTitle>
              <CardDescription>برای دسترسی به اطلاعات، رمز عبور خود را وارد کنید.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input
                  id="password"
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full">
                <Unlock className="ml-2 h-4 w-4" />
                ورود
              </Button>
            </CardContent>
          </form>
        ) : (
          <form onSubmit={handleSetPassword}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">تنظیم رمز عبور</CardTitle>
              <CardDescription>برای محافظت از اطلاعات خود یک رمز عبور تعیین کنید.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="new-password">رمز عبور جدید</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">تکرار رمز عبور</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <KeyRound className="ml-2 h-4 w-4" />
                تنظیم رمز
              </Button>
            </CardContent>
          </form>
        )}
      </Card>
    </div>
  );
}
