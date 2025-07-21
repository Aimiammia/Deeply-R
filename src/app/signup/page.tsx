
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, UserPlus, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function SignupPage() {
  const { signup, isFirebaseConfigured } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("رمزهای عبور مطابقت ندارند.");
      return;
    }
     if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    setIsProcessing(true);

    try {
      await signup(email, password);
      toast({ title: "ثبت‌نام موفقیت‌آمیز", description: "حساب شما ایجاد شد. خوش آمدید!" });
      router.push('/');
    } catch (err: any) {
      const errorMessage = err.code === 'auth/email-already-in-use'
        ? 'این ایمیل قبلاً استفاده شده است.'
        : 'خطایی در هنگام ثبت‌نام رخ داد. لطفاً دوباره تلاش کنید.';
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
            <CardTitle className="text-2xl">ایجاد حساب کاربری</CardTitle>
            <CardDescription>
                برای همگام‌سازی اطلاعات خود ثبت‌نام کنید.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {!isFirebaseConfigured && (
                 <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/30 text-xs flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>پیکربندی Firebase یافت نشد. قابلیت‌های ثبت‌نام و همگام‌سازی ابری غیرفعال است.</span>
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
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isProcessing || !isFirebaseConfigured}
                />
              </div>
             <Button type="submit" className="w-full" disabled={isProcessing || !email || !password || !confirmPassword || !isFirebaseConfigured}>
              {isProcessing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
              ) : (
                <>
                  <UserPlus className="ml-2 h-4 w-4" />
                  ثبت‌نام
                </>
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
                قبلاً ثبت‌نام کرده‌اید؟{' '}
                <Link href="/login" className="underline hover:text-primary">
                    وارد شوید
                </Link>
            </p>
            </CardContent>
          </form>
        </Card>
      </div>
    );
}
