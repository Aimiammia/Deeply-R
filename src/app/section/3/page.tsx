
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, CircleDollarSign, Landmark, Wallet, CreditCard, PiggyBank, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function FinancialManagementPage() {
  const sectionTitle = "مدیریت مالی";
  const sectionPageDescription = "هزینه‌ها، درآمدها و بودجه خود را در اینجا پیگیری و مدیریت کنید.";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            بازگشت به خانه
          </Link>
        </Button>
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
              <CircleDollarSign className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline text-primary">
                {sectionTitle}
              </CardTitle>
            </div>
            <CardDescription>
              {sectionPageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-500 rtl:ml-2 rtl:mr-0" />
                    ثبت درآمد
                  </CardTitle>
                  <CardDescription>درآمدهای خود را اینجا وارد کنید.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">افزودن درآمد جدید</Button>
                  {/* Placeholder for income form or list */}
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <TrendingDown className="mr-2 h-5 w-5 text-red-500 rtl:ml-2 rtl:mr-0" />
                    ثبت هزینه
                  </CardTitle>
                  <CardDescription>هزینه‌های خود را اینجا وارد کنید.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">افزودن هزینه جدید</Button>
                  {/* Placeholder for expense form or list */}
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Landmark className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                  بودجه‌بندی
                </CardTitle>
                <CardDescription>بودجه ماهانه خود را تنظیم و پیگیری کنید.</CardDescription>
              </CardHeader>
              <CardContent>
                 <p className="text-muted-foreground">قابلیت بودجه‌بندی به زودی اضافه خواهد شد.</p>
                {/* Placeholder for budgeting tools */}
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                   <PiggyBank className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                  اهداف پس‌انداز
                </CardTitle>
                <CardDescription>اهداف پس‌انداز خود را مشخص و پیشرفت خود را مشاهده کنید.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">قابلیت اهداف پس‌انداز به زودی اضافه خواهد شد.</p>
                {/* Placeholder for savings goals */}
              </CardContent>
            </Card>
            
            <div className="mt-8 p-4 border rounded-lg bg-secondary/30 text-center">
              <Image 
                src="https://placehold.co/600x300.png" 
                alt="Financial Chart Placeholder" 
                width={600} 
                height={300}
                className="rounded-md mx-auto mb-4 shadow-md"
                data-ai-hint="financial chart graph"
              />
              <p className="text-muted-foreground text-sm">
                نمودارها و گزارشات مالی به زودی در اینجا نمایش داده خواهند شد تا به شما درک بهتری از وضعیت مالی‌تان بدهند.
              </p>
            </div>

          </CardContent>
        </Card>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Daily Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}
