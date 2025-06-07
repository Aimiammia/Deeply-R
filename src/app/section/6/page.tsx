
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dumbbell, Construction } from 'lucide-react';
import Image from 'next/image';

export default function SportsPage() {
  const sectionTitle = "ورزشی";
  const sectionPageDescription = "فعالیت‌های ورزشی خود را در این بخش ثبت، پیگیری و تحلیل کنید.";

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
        <Card className="shadow-lg bg-card">
          <CardHeader>
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline text-primary">
                {sectionTitle}
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {sectionPageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 text-center">
            <Construction className="mx-auto h-16 w-16 text-primary/70 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">بخش ورزشی در دست ساخت است!</h3>
            <p className="text-muted-foreground mb-6">
              به زودی می‌توانید برنامه‌های تمرینی خود را ایجاد کنید، فعالیت‌های ورزشی مانند دویدن، دوچرخه‌سواری، شنا و ... را ثبت نمایید و پیشرفت خود را مشاهده کنید.
            </p>
            <Image
              src="https://placehold.co/600x400.png"
              alt="Sports and Exercise Placeholder"
              width={600}
              height={400}
              className="rounded-md mx-auto shadow-md"
              data-ai-hint="sports exercise fitness"
            />
            <div className="mt-8 p-4 border rounded-lg bg-secondary/30">
                <h4 className="text-lg font-semibold text-primary mb-2">قابلیت‌های آینده:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-left rtl:text-right text-foreground/80">
                  <li>ثبت انواع فعالیت‌های ورزشی (دویدن، وزنه برداری، یوگا، ...)</li>
                  <li>ایجاد و مدیریت برنامه‌های تمرینی سفارشی</li>
                  <li>ردیابی مسافت، زمان، کالری سوزانده شده</li>
                  <li>نمودارهای پیشرفت و آمار ورزشی</li>
                  <li>اتصال به دستگاه‌های پوشیدنی (اختیاری)</li>
                  <li>چالش‌های ورزشی و دستاوردها</li>
                </ul>
              </div>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
