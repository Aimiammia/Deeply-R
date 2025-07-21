
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, LogIn, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function LoginPage() {
  const { login, isFirebaseConfigured } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      await login(email, password);
      toast({ title: "ورود موفقیت‌آمیز", description: "خوش آمدید!" });
      const redirectTo = searchParams.get('redirect_to') || '/';
      router.push(redirectTo);
    } catch (err: any) {
      const errorMessage = err.code === 'auth/invalid-credential'
        ? 'ایمیل یا رمز عبور اشتباه است.'
        : 'خطایی در هنگام ورود رخ داد. لطفاً دوباره تلاش کنید.';
      setError(errorMessage);
      setIsProcessing(false);
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
                برای دسترسی به اطلاعات خود وارد شوید.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isFirebaseConfigured && (
                 <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/30 text-xs flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>پیکربندی Firebase یافت نشد. قابلیت‌های ورود و همگام‌سازی ابری غیرفعال است. لطفاً فایل `.env.local` را طبق دستورالعمل `README.md` تنظیم کنید.</span>
                </div>
            )}
            {error && (
                 <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/30 text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
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
                disabled={isProcessing || !isFirebaseConfigured}
                autoFocus
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
                disabled={isProcessing || !isFirebaseConfigured}
              />
            </div>
             <Button type="submit" className="w-full" disabled={isProcessing || !email || !password || !isFirebaseConfigured}>
              {isProcessing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
              ) : (
                <>
                  <LogIn className="ml-2 h-4 w-4" />
                  ورود
                </>
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
                حساب کاربری ندارید؟{' '}
                <Link href="/signup" className="underline hover:text-primary">
                    ثبت‌نام کنید
                </Link>
            </p>
            </CardContent>
          </form>
        </Card>
      </div>
    );
}
