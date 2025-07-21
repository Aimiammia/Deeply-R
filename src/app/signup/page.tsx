
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, UserPlus, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const { user, signup, authError, isFirebaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);
  
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (password !== confirmPassword) {
      setLocalError("رمزهای عبور با هم مطابقت ندارند.");
      return;
    }
    await signup(email, password);
  };
  
  const displayError = authError || localError;

  if (!isFirebaseConfigured) {
     return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-destructive">پیکربندی Firebase الزامی است</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 rounded-md bg-destructive/10 text-destructive-foreground border border-destructive/30 text-sm">
                       برای استفاده از این قابلیت، لطفاً فایل `README.md` را برای راهنمایی در مورد نحوه راه‌اندازی Firebase مطالعه کنید.
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
        <form onSubmit={handleSignup}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">ایجاد حساب کاربری</CardTitle>
              <CardDescription>
                یک حساب کاربری جدید برای ذخیره اطلاعات خود بسازید.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayError && (
                 <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/30 text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span>{displayError}</span>
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
                <Label htmlFor="new-password">رمز عبور</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                <UserPlus className="ml-2 h-4 w-4" />
                ثبت‌نام
              </Button>
               <div className="text-center text-sm">
                قبلاً ثبت‌نام کرده‌اید؟{' '}
                <Link href="/login" className="underline text-primary">
                    وارد شوید
                </Link>
                </div>
            </CardContent>
          </form>
      </Card>
    </div>
  );
}
