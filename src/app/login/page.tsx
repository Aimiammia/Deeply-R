
'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, LogIn, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push('/'); // Redirect to main app page on successful login
    } catch (err: any) {
      setError(err.message || 'Failed to log in.');
      toast({
        title: 'Login Failed',
        description: err.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await signup(email, password);
      router.push('/'); // Redirect to main app page on successful signup
    } catch (err: any)      {
      setError(err.message || 'Failed to sign up.');
       toast({
        title: 'Signup Failed',
        description: err.message || 'An error occurred during sign up. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
      <Tabs defaultValue="login" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">
            <LogIn className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> ورود
          </TabsTrigger>
          <TabsTrigger value="signup">
            <UserPlus className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> ثبت نام
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle className="text-2xl">ورود به حساب</CardTitle>
                <CardDescription>برای دسترسی به برنامه، ایمیل و رمز عبور خود را وارد کنید.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {error && <p className="text-sm text-destructive text-center">{error}</p>}
                <div className="space-y-2">
                  <Label htmlFor="login-email">ایمیل</Label>
                  <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">رمز عبور</Label>
                  <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'در حال ورود...' : 'ورود'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
             <form onSubmit={handleSignup}>
              <CardHeader>
                <CardTitle className="text-2xl">ایجاد حساب جدید</CardTitle>
                <CardDescription>با ثبت‌نام، تمام اطلاعات شما به صورت امن در فضای ابری ذخیره می‌شود.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {error && <p className="text-sm text-destructive text-center">{error}</p>}
                <div className="space-y-2">
                  <Label htmlFor="signup-email">ایمیل</Label>
                  <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">رمز عبور</Label>
                  <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <p className="text-xs text-muted-foreground">رمز عبور باید حداقل ۶ کاراکتر باشد.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'در حال ثبت نام...' : 'ثبت نام'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
