
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic'; // Added
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, CheckSquare, Edit, ListChecks, GanttChartSquare, BellDot, Loader2 } from 'lucide-react'; // Added Loader2
// import { PersianCalendarView } from '@/components/calendar/PersianCalendarView'; // Commented out
import { getJalaliToday } from '@/lib/calendar-helpers';
import { Skeleton } from '@/components/ui/skeleton'; // Added for better loading

const DynamicPersianCalendarView = dynamic(() => 
  import('@/components/calendar/PersianCalendarView').then(mod => mod.PersianCalendarView),
  {
    ssr: false, // PersianCalendarView might use client-side logic (localStorage for events/birthdays)
    loading: () => (
      <div className="w-full max-w-3xl mx-auto bg-card p-3 sm:p-4 rounded-lg shadow-lg animate-pulse">
        <div className="flex items-center justify-between mb-4 p-2 bg-muted h-16 rounded-md">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-1/2 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Skeleton className="h-10 rounded-md" />
          <Skeleton className="h-10 rounded-md" />
          <Skeleton className="h-10 rounded-md" />
        </div>
        <Skeleton className="h-10 rounded-md mb-4 w-3/4 mx-auto" />
        <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-medium text-muted-foreground mb-2">
          {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="py-1 h-6 rounded w-3/4 mx-auto" />)}
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {Array.from({ length: 35 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg bg-muted/50" />)}
        </div>
        <Skeleton className="h-px w-full my-6 bg-muted" />
        <Skeleton className="h-8 w-1/3 mb-3 rounded" />
        <Skeleton className="h-20 w-full rounded" />

      </div>
    ),
  }
);


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
            <DynamicPersianCalendarView initialYear={todayJalali.year} initialMonth={todayJalali.month} /> 
            
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
