
'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      toast({
        title: 'ورود موفق',
        description: 'با موفقیت وارد حساب کاربری خود شدید.',
      });
      router.push('/');
    } catch (err: any) {
      console.error("Login failed:", err);
      let errorMessage = 'خطا در ورود. لطفاً اطلاعات خود را بررسی کنید.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          errorMessage = 'ایمیل یا رمز عبور اشتباه است.';
      } else if (err.code === 'auth/invalid-email') {
          errorMessage = 'فرمت ایمیل نامعتبر است.';
      }
      setError(errorMessage);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6">
        <Brain className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-headline font-bold text-foreground">Deeply</h1>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>ورود به حساب کاربری</CardTitle>
          <CardDescription>برای دسترسی به برنامه، وارد شوید.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              ورود
            </Button>
            <p className="text-xs text-muted-foreground">
              حساب کاربری ندارید؟{' '}
              <Link href="/signup" className="text-primary hover:underline">
                ثبت‌نام کنید
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
