
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Brain, KeyRound, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LockScreen() {
  const { isPasswordSet, setPassword, unlock } = useAuth();
  const [inputPassword, setInputPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlock(inputPassword)) {
      // Success, component will unmount
    } else {
      setError('رمز عبور اشتباه است.');
      setInputPassword('');
    }
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }
    if (inputPassword !== confirmPassword) {
      setError('رمزهای عبور مطابقت ندارند.');
      return;
    }
    setPassword(inputPassword);
    // Success, component will unmount
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <Brain className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-2xl">Deeply قفل است</CardTitle>
          <CardDescription>
            {isPasswordSet
              ? 'برای ادامه، رمز عبور خود را وارد کنید.'
              : 'برای محافظت از اطلاعات خود، یک رمز عبور تنظیم کنید.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPasswordSet ? (
            <form onSubmit={handleUnlock} className="space-y-4">
              <Input
                type="password"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setError('');
                }}
                placeholder="رمز عبور"
                autoFocus
              />
              <Button type="submit" className="w-full">
                <KeyRound className="mr-2 h-4 w-4" />
                باز کردن
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <Input
                type="password"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setError('');
                }}
                placeholder="رمز عبور جدید (حداقل ۶ کاراکتر)"
                autoFocus
              />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                placeholder="تکرار رمز عبور"
              />
              <Button type="submit" className="w-full">
                <ShieldCheck className="mr-2 h-4 w-4" />
                تنظیم رمز عبور و ورود
              </Button>
            </form>
          )}
          {error && <p className="text-sm text-center text-destructive mt-4">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
