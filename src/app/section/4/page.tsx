
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card'; // CardHeader, CardTitle, CardDescription removed
import Link from 'next/link';
import { ArrowLeft, CalendarDays, CheckSquare, Edit, ListChecks, GanttChartSquare, BellDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PersianCalendarView } from '@/components/calendar/PersianCalendarView'; 
import { getJalaliToday } from '@/lib/calendar-helpers';

export default function CalendarPage() {
  const sectionTitle = "تقویم و رویدادها";
  const sectionPageDescription = "تقویم شمسی را مشاهده کنید، رویدادها، تولدها و مناسبت‌های مهم را پیگیری نمایید.";
  
  const todayJalali = getJalaliToday();

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

        <div className="mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-1">
            <CalendarDays className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">{sectionTitle}</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {sectionPageDescription}
          </p>
        </div>
        
        <Card className="shadow-lg bg-card">
          <CardContent className="p-6 space-y-8">
            <PersianCalendarView initialYear={todayJalali.year} initialMonth={todayJalali.month} /> 
            
            <div className="p-4 border rounded-lg bg-secondary/30">
                <h4 className="text-lg font-semibold text-primary mb-3">قابلیت‌های پیاده‌سازی شده و آینده:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-foreground/90">
                  <li className="flex items-center"><CheckSquare className="ml-2 h-4 w-4 text-green-500 rtl:mr-2 rtl:ml-0" />نمایش تقویم شمسی با ناوبری ماه و سال</li>
                  <li className="flex items-center"><CheckSquare className="ml-2 h-4 w-4 text-green-500 rtl:mr-2 rtl:ml-0" />افزودن، نمایش و حذف تاریخ تولدها (ذخیره در localStorage)</li>
                  <li className="flex items-center"><CheckSquare className="ml-2 h-4 w-4 text-green-500 rtl:mr-2 rtl:ml-0" />افزودن، ویرایش، نمایش و حذف رویدادها (ذخیره در localStorage)</li>
                  <li className="flex items-center"><CheckSquare className="ml-2 h-4 w-4 text-green-500 rtl:mr-2 rtl:ml-0" />نمایش نشانگر برای روزهای دارای تولد یا رویداد</li>
                  <li className="flex items-center"><CheckSquare className="ml-2 h-4 w-4 text-green-500 rtl:mr-2 rtl:ml-0" />نمایش بازه معادل میلادی برای ماه شمسی جاری</li>
                  <li className="flex items-center"><CheckSquare className="ml-2 h-4 w-4 text-green-500 rtl:mr-2 rtl:ml-0" />نمایش مناسبت‌های نمونه</li>
                  <li className="flex items-center"><Edit className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0" />ویرایش پیشرفته‌تر رویدادها (مانند انتخاب رنگ، تکرار و ...)</li>
                  <li className="flex items-center"><GanttChartSquare className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0" />نمایش‌های مختلف (هفتگی، روزانه) برای رویدادها</li>
                  <li className="flex items-center"><BellDot className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0" />تنظیم یادآور برای رویدادها</li>
                  <li className="flex items-center"><ListChecks className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0" />بارگذاری هوشمند مناسبت‌ها و تعطیلات رسمی از منبع خارجی</li>
                  <li className="flex items-center"><CalendarDays className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0" />نمایش تاریخ قمری معادل برای هر روز</li>
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
