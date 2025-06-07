
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PersianCalendarView } from '@/components/calendar/PersianCalendarView'; // Import the new calendar component

export default function CalendarPage() {
  const sectionTitle = "تقویم و مناسبت‌ها";
  const sectionPageDescription = "تقویم شمسی را مشاهده کنید، رویدادها و مناسبت‌های مهم را پیگیری نمایید.";

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
              <CalendarDays className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline text-primary">
                {sectionTitle}
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {sectionPageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Use the PersianCalendarView component */}
            <PersianCalendarView initialYear={1404} initialMonth={3} /> 
            
            <div className="mt-8 p-4 border rounded-lg bg-secondary/30">
                <h4 className="text-lg font-semibold text-primary mb-2">قابلیت‌های آینده:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-left rtl:text-right text-foreground/80">
                  <li>ایجاد و ویرایش رویدادها با انتخاب روز از تقویم</li>
                  <li>نمایش رویدادهای ثبت شده کاربر در تقویم</li>
                  <li>نمایش‌های مختلف (ماهانه، هفتگی، روزانه) برای رویدادها (در صورت نیاز)</li>
                  <li>تنظیم یادآور برای رویدادها</li>
                  <li>بارگذاری هوشمند مناسبت‌ها و تعطیلات رسمی برای سال‌های مختلف</li>
                  <li>انتخابگر پیشرفته ماه و سال</li>
                  <li>نمایش تاریخ میلادی و قمری معادل برای هر روز</li>
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
