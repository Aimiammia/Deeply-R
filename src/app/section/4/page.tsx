
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic'; 
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, Loader2 } from 'lucide-react'; 
import { getJalaliToday } from '@/lib/calendar-helpers';
import { Skeleton } from '@/components/ui/skeleton'; 
import { useFirestore } from '@/hooks/useFirestore';

const DynamicPersianCalendarView = dynamic(() => 
  import('@/components/calendar/PersianCalendarView').then(mod => mod.PersianCalendarView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-2xl mx-auto bg-popover p-4 rounded-xl shadow-md space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 flex flex-col items-center gap-1">
             <Skeleton className="h-6 w-28 rounded-md" />
             <Skeleton className="h-4 w-40 rounded-md" />
          </div>
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
         <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-medium text-muted-foreground mb-2">
          {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="py-1 h-5 w-5 rounded-md mx-auto" />)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-full bg-muted/50" />)}
        </div>
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
        
        <DynamicPersianCalendarView initialYear={todayJalali.year} initialMonth={todayJalali.month} /> 
            
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>