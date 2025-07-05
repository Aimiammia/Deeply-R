
'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Key, LogIn, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { login, isFirebaseConfigured } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
        toast({
            title: "پیکربندی Firebase ناقص است",
            description: "لطفاً فایل .env.local را با اطلاعات صحیح پروژه Firebase خود تکمیل کنید.",
            variant: "destructive",
            duration: 10000,
        });
        return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast({ title: "خوش آمدید!", description: "شما با موفقیت وارد شدید." });
      router.push('/');
    } catch (error: any) {
      console.error(error);
       toast({
        title: "خطا در ورود",
        description: "ایمیل یا رمز عبور نامعتبر است. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
      setIsLoading(false);
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
            <CardTitle className="text-2xl">ورود به حساب کاربری</CardTitle>
            <CardDescription>
                اطلاعات حساب خود را برای دسترسی به برنامه وارد کنید.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {!isFirebaseConfigured && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-xs flex items-center">
                    <AlertTriangle className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0 flex-shrink-0" />
                    <div>
                        پیکربندی Firebase برای همگام‌سازی ابری انجام نشده است. لطفاً فایل `.env.local` را بررسی کنید.
                    </div>
                </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
             <Button type="submit" className="w-full" disabled={isLoading || !email || !password}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
              ) : (
                <>
                  <LogIn className="ml-2 h-4 w-4" />
                  ورود
                </>
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
                حساب کاربری ندارید؟{" "}
                <Link href="/signup" className="underline text-primary">
                    ثبت‌نام کنید
                </Link>
            </p