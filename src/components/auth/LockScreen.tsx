'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Brain, KeyRound, ShieldCheck, AlertTriangle } from 'lucide-react';
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

export function LockScreen() {
  const { isPasswordSet, setPassword, unlock, resetApp } = useAuth();
  const [inputPassword, setInputPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlock(inputPassword)) {
      setError('رمز عبور اشتباه است. لطفاً دوباره تلاش کنید.');
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
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="w-full max-w-xl mx-4 rounded-2xl">
        <CardHeader className="text-center p-8">
          <Brain className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl">Deeply قفل است</CardTitle>
          <CardDescription className="text-base mt-2">
            {isPasswordSet
              ? 'برای ادامه، رمز عبور خود را وارد کنید.'
              : 'برای محافظت از اطلاعات خود، یک رمز عبور تنظیم کنید.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-6">
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
                className="py-6 text-lg rounded-2xl text-center"
              />
              <Button type="submit" className="w-full py-6 text-lg rounded-2xl">
                <KeyRound className="mr-2 h-5 w-5" />
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
                className="py-6 text-lg rounded-2xl text-center"
              />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                placeholder="تکرار رمز عبور"
                className="py-6 text-lg rounded-2xl text-center"
              />
              <Button type="submit" className="w-full py-6 text-lg rounded-2xl">
                <ShieldCheck className="mr-2 h-5 w-5" />
                تنظیم رمز عبور و ورود
              </Button>
            </form>
          )}
          {error && <p className="text-sm text-center text-destructive mt-4">{error}</p>}
        </CardContent>
        {isPasswordSet && (
          <CardFooter className="flex justify-center px-8 pb-8">
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="link" className="text-xs text-muted-foreground">
                        رمز عبور خود را فراموش کرده‌اید؟
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center">
                            <AlertTriangle className="ml-2 h-5 w-5 text-destructive"/>
                            هشدار: بازنشانی برنامه
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            آیا کاملا مطمئن هستید؟ بازیابی رمز عبور در این برنامه آفلاین امکان‌پذیر نیست.
                            تنها راه، پاک کردن کامل تمام اطلاعات و شروع مجدد است.
                            <strong className="block mt-2">این عمل تمام داده‌های شما (وظایف، یادداشت‌ها، اطلاعات مالی و...) را برای همیشه حذف می‌کند و قابل بازگشت نیست.</strong>
                            اگر فایل پشتیبان دارید، می‌توانید بعداً آن را بازیابی کنید.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>لغو</AlertDialogCancel>
                        <AlertDialogAction onClick={resetApp} variant="destructive">
                            بله، همه چیز را پاک کن
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
