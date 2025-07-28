
'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { signup } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('رمزهای عبور با هم مطابقت ندارند.');
      return;
    }
    setError(null);
    try {
      await signup(email, password);
      toast({
        title: 'ثبت‌نام موفق',
        description: 'حساب کاربری شما با موفقیت ایجاد شد. خوش آمدید!',
      });
      router.push('/');
    } catch (err: any) {
      console.error("Signup failed:", err);
      let errorMessage = 'خطا در ثبت‌نام. لطفا دوباره تلاش کنید.';
       if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'این ایمیل قبلاً ثبت شده است.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
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
          <CardTitle>ایجاد حساب کاربری جدید</CardTitle>
          <CardDescription>برای شروع، یک حساب کاربری بسازید.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
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
             <div className="space-y-2">
              <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              ثبت‌نام
            </Button>
             <p className="text-xs text-muted-foreground">
              قبلاً حساب کاربری ساخته‌اید؟{' '}
              <Link href="/login" className="text-primary hover:underline">
                وارد شوید
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
