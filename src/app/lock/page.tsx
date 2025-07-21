'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLock } from '@/contexts/LockContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Key, Lock, ShieldLock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LockPage() {
  const { isPasswordSet, isLoading, unlock, setPassword } = useLock();
  const router = useRouter();
  const { toast } = useToast();
  
  const [password, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // If we are on the lock page but the app is already unlocked, redirect to home
    // This can happen if the user navigates back to /lock
    if (!isLoading && !isPasswordSet) {
        // App is unlocked, shouldn't be here
        // router.push('/');
    }
  }, [isLoading, isPasswordSet, router]);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (isPasswordSet) {
      // Handle unlocking
      const success = unlock(password);
      if (success) {
        toast({ title: "قفل باز شد", description: "خوش آمدید!" });
        router.push('/');
      } else {
        toast({ title: "رمز عبور اشتباه است", variant: "destructive" });
        setIsProcessing(false);
      }
    } else {
      // Handle setting password
      if (password !== confirmPassword) {
        toast({ title: "رمزهای عبور مطابقت ندارند", variant: "destructive" });
        setIsProcessing(false);
        return;
      }
       if (password.length < 4) {
        toast({ title: "رمز عبور ضعیف است", description: "رمز شما باید حداقل ۴ کاراکتر باشد.", variant: "destructive" });
        setIsProcessing(false);
        return;
      }
      setPassword(password);
      toast({ title: "رمز عبور با موفقیت تنظیم شد" });
      router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6">
          <Brain className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline font-bold text-foreground">
            Deeply
          </h1>
        </div>
      <Card className="w-full max-w-sm shadow-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{isPasswordSet ? 'برنامه قفل است' : 'تنظیم رمز عبور'}</CardTitle>
            <CardDescription>
                {isPasswordSet ? 'رمز عبور خود را برای باز کردن قفل برنامه وارد کنید.' : 'یک رمز عبور برای محافظت از اطلاعات خود تنظیم کنید.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={isProcessing}
                autoFocus
              />
            </div>
            {!isPasswordSet && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isProcessing}
                />
              </div>
            )}
             <Button type="submit" className="w-full" disabled={isProcessing || !password || (!isPasswordSet && !confirmPassword)}>
              {isProcessing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
              ) : (
                <>
                  {isPasswordSet ? <Key className="ml-2 h-4 w-4" /> : <Lock className="ml-2 h-4 w-4" />}
                  {isPasswordSet ? 'باز کردن قفل' : 'تنظیم رمز و ورود'}
                </>
              )}
            </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    );
}
