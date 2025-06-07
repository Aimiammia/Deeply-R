
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Construction } from 'lucide-react';
import Image from 'next/image';

export default function EducationPage() {
  const sectionTitle = "تحصیل";
  const sectionPageDescription = "برنامه‌های درسی، یادداشت‌ها، منابع آموزشی و پیشرفت تحصیلی خود را در این بخش مدیریت کنید.";

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
              <BookOpen className="h-8 w-8 text-primary" />
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
            <h3 className="text-xl font-semibold text-foreground mb-2">بخش تحصیل در دست ساخت است!</h3>
            <p className="text-muted-foreground mb-6">
              به زودی می‌توانید برنامه‌های مطالعاتی خود را تنظیم کنید، یادداشت‌های درسی را ذخیره و مرور نمایید، و پیشرفت خود را در دوره‌های مختلف آموزشی پیگیری کنید.
            </p>
            <Image
              src="https://placehold.co/600x400.png"
              alt="Education and Study Placeholder"
              width={600}
              height={400}
              className="rounded-md mx-auto shadow-md"
              data-ai-hint="study education learning"
            />
            <div className="mt-8 p-4 border rounded-lg bg-secondary/30">
                <h4 className="text-lg font-semibold text-primary mb-2">قابلیت‌های آینده:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-left rtl:text-right text-foreground/80">
                  <li>ایجاد برنامه مطالعاتی و زمان‌بندی</li>
                  <li>یادداشت‌برداری پیشرفته با امکان ضمیمه فایل</li>
                  <li>مدیریت منابع آموزشی (کتاب، مقاله، ویدیو)</li>
                  <li>پیگیری پیشرفت در دروس و آزمون‌ها</li>
                  <li>سیستم فلش کارت برای یادگیری لغات و مفاهیم</li>
                  <li>اتصال به تقویم برای یادآوری کلاس‌ها و امتحانات</li>
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
