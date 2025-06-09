
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Construction } from 'lucide-react';
import Image from 'next/image';

export default function GoalsAndHabitsPage() {
  const sectionTitle = "اهداف و عادت‌ها";
  const sectionPageDescription = "در این بخش اهداف خود را تعیین کرده و عادت‌های مثبت برای رسیدن به آن‌ها ایجاد و پیگیری کنید.";

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
              <Target className="h-8 w-8 text-primary" />
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
            <h3 className="text-xl font-semibold text-foreground mb-2">بخش اهداف و عادت‌ها در دست ساخت است!</h3>
            <p className="text-muted-foreground mb-6">
              به زودی می‌توانید اهداف بلندمدت و کوتاه مدت خود را در اینجا تعریف کنید، عادت‌های جدید بسازید و پیشرفت خود را دنبال نمایید.
            </p>
            <Image
              src="https://placehold.co/600x400.png"
              alt="تصویر مفهومی اهداف و شکل‌گیری عادت‌ها"
              width={600}
              height={400}
              className="rounded-md mx-auto shadow-md"
              data-ai-hint="goals habits"
            />
            <div className="mt-8 p-6 border rounded-lg bg-secondary/30 shadow-inner max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-primary mb-3">قابلیت‌های برنامه‌ریزی شده برای آینده:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-left rtl:text-right text-foreground/90">
                  <li>تعریف اهداف SMART (مشخص، قابل اندازه‌گیری، قابل دستیابی، مرتبط، زمان‌بندی شده)</li>
                  <li>ایجاد ردیاب عادت (Habit Tracker) با امکان تنظیم تکرار (روزانه، هفتگی، ...) و یادآور</li>
                  <li>اتصال اهداف (کوتاه‌مدت و بلندمدت) به وظایف روزانه در بخش برنامه‌ریز برای همسوسازی فعالیت‌ها</li>
                  <li>نمایش نمودارهای پیشرفت بصری برای اهداف و زنجیره عادت‌ها</li>
                  <li>سیستم پاداش و انگیزش برای دستیابی به اهداف و پایبندی به عادت‌ها (اختیاری)</li>
                  <li>امکان دسته‌بندی اهداف و عادت‌ها برای سازماندهی بهتر</li>
                  <li>پیشنهاد هوشمند برای ایجاد عادت‌های سازنده بر اساس اهداف</li>
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

    
