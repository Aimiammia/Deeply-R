
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, LogIn, AlertTriangle, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { user, login, authError, isFirebaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };
  
  if (!isFirebaseConfigured) {
     return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-destructive">پیکربندی Firebase الزامی است</CardTitle>
                    <CardDescription>
                        برای استفاده از قابلیت‌های ورود و همگام‌سازی، لطفاً برنامه را به یک پروژه Firebase متصل کنید.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 rounded-md bg-destructive/10 text-destructive-foreground border border-destructive/30 text-sm">
                        <p>به نظر می‌رسد متغیرهای محیطی Firebase در فایل `.env.local` تنظیم نشده‌اند.</p>
                        <p className="mt-2">لطفاً فایل `README.md` را برای راهنمایی در مورد نحوه راه‌اندازی Firebase مطالعه کنید.</p>
                    </div>
                </CardContent>
            </Card>
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
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">ورود به حساب کاربری</CardTitle>
            <CardDescription>
              برای دسترسی به اطلاعات خود وارد شوید.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {authError && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/30 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <LogIn className="ml-2 h-4 w-4" />
              ورود
            </Button>
            <div className="text-center text-sm">
              حساب کاربری ندارید؟{' '}
              <Link href="/signup" className="underline text-primary">
                 ثبت‌نام کنید
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
