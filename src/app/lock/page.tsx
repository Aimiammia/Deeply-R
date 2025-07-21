
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useLock } from '@/contexts/LockContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, KeyRound, AlertTriangle } from 'lucide-react';

export default function LockPage() {
  const { isUnlocked, isPasswordSet, unlock, setPassword, lockError } = useLock();
  const [password, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSetPassword = (e: FormEvent) => {
    e.preventDefault();
    if (password && password === confirmPassword) {
      setPassword(password);
    } else {
        // This is a simple implementation, error is handled via lockError in context
        // For a more complex app, you might set a local error state here.
    }
  };

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    unlock(password);
  };

  useEffect(() => {
      if (!isPasswordSet) {
          setPasswordInput('');
      }
  }, [isPasswordSet]);

  if (isUnlocked) {
    return null; // Or a loading indicator/redirect
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
        {isPasswordSet ? (
          <form onSubmit={handleUnlock}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">برنامه قفل است</CardTitle>
              <CardDescription>
                برای دسترسی به اطلاعات خود رمز عبور را وارد کنید.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {lockError && (
                 <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/30 text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span>{lockError}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full">
                <KeyRound className="ml-2 h-4 w-4" />
                باز کردن قفل
              </Button>
            </CardContent>
          </form>
        ) : (
          <form onSubmit={handleSetPassword}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">تنظیم رمز عبور</CardTitle>
              <CardDescription>
                برای محافظت از اطلاعات خود یک رمز عبور محلی تنظیم کنید.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
             {lockError && (
                 <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/30 text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span>{lockError}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="new-password">رمز عبور جدید</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPasswordInput(e.target.value)}
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
                ذخیره و ورود
              </Button>
            </CardContent>
          </form>
        )}
      </Card>
    </div>
  );
}
