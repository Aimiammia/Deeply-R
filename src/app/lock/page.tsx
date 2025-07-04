
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLock } from '@/contexts/LockContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Key, Lock } from 'lucide-react';

export default function LockPage() {
  const { unlock, isPasswordSet } = useLock();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = unlock(password);

    if (success) {
      router.push('/'); // Redirect to dashboard on success
    } else {
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
            <CardTitle className="text-2xl">{isPasswordSet ? 'برنامه قفل است' : 'تنظیم رمز عبور'}</CardTitle>
            <CardDescription>
                {isPasswordSet 
                    ? 'برای دسترسی به اطلاعات، رمز عبور خود را وارد کنید.' 
                    : 'برای محافظت از اطلاعات خود، یک رمز عبور تنظیم کنید. این رمز در همین دستگاه ذخیره می‌شود.'
                }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
             <Button type="submit" className="w-full" disabled={isLoading || !password}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
              ) : (
                <>
                  {isPasswordSet ? <Key className="ml-2 h-4 w-4" /> : <Lock className="ml-2 h-4 w-4" />}
                  {isPasswordSet ? 'باز کردن قفل' : 'تنظیم رمز و ورود'}
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
