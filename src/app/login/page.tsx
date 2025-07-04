
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const { signup, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push('/'); // Redirect to dashboard on success
    } catch (err: any) {
      // Map Firebase error codes to user-friendly messages
      let friendlyMessage = 'یک خطای ناشناخته رخ داد. لطفاً دوباره تلاش کنید.';
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            friendlyMessage = 'ایمیل یا رمز عبور نامعتبر است.';
            break;
          case 'auth/email-already-in-use':
            friendlyMessage = 'این ایمیل قبلاً ثبت‌نام کرده است.';
            break;
          case 'auth/weak-password':
            friendlyMessage = 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
            break;
          case 'auth/invalid-email':
            friendlyMessage = 'فرمت ایمیل نامعتبر است.';
            break;
          case 'auth/firebase-not-configured':
             friendlyMessage = 'پیکربندی Firebase یافت نشد. لطفاً فایل .env.local را بررسی کنید.';
             break;
        }
      }
      setError(friendlyMessage);
    } finally {
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
      <Card className="w-full max-w-md shadow-2xl">
         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">ورود</TabsTrigger>
                <TabsTrigger value="signup">ثبت نام</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{activeTab === 'login' ? 'ورود به حساب کاربری' : 'ایجاد حساب جدید'}</CardTitle>
                <CardDescription>{activeTab === 'login' ? 'برای دسترسی به اطلاعات خود وارد شوید.' : 'با ثبت نام، اطلاعات شما بین دستگاه‌ها همگام‌سازی می‌شود.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
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
                {error && (
                  <div className="flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4 ml-2 rtl:mr-2" />
                    {error}
                  </div>
                )}
                 <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                  ) : (
                    <>
                      {activeTab === 'login' ? <LogIn className="ml-2 h-4 w-4" /> : <UserPlus className="ml-2 h-4 w-4" />}
                      {activeTab === 'login' ? 'ورود' : 'ثبت نام'}
                    </>
                  )}
                </Button>
              </CardContent>
            </form>
         </Tabs>
      </Card>
    </div>
  );
}
