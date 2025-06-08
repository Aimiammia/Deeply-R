
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  CalendarCheck2,
  BookHeart,
  CircleDollarSign,
  CalendarDays,
  Target, // Used for Section 5 (Goals/Habits) AND now for Section 9 (Long-Term Planning)
  Dumbbell,
  BookOpen,
  PieChart, // Icon for Section 10
  FileText, 
  Settings // Generic "Future" icon or similar
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Helper array for icons
const sectionIcons: LucideIcon[] = [
  CalendarCheck2,   // Section 1 (Tasks/Planner)
  BookHeart,        // Section 2 (Daily Reflections)
  CircleDollarSign, // Section 3 (Financial Management)
  CalendarDays,     // Section 4 (Calendar)
  Target,           // Section 5 (Goals and Habits)
  Dumbbell,         // Section 6 (Sports/Exercise)
  BookOpen,         // Section 7 (Education/Study)
  FileText,         // Section 8 (Daily Activity Log)
  Target,           // Section 9 (Long-Term Planning)
  PieChart          // Section 10 (Data Analysis and Reports)
];

export default function HomePage() {
  // New order: Daily Planner (1), Long-Term Planning (9), Daily Activity Log (8), then others
  const sectionsToDisplay = [1, 9, 8, 2, 3, 4, 5, 6, 7, 10]; 

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionsToDisplay.map((sectionNumber) => {
            const iconIndex = sectionNumber -1; // This remains correct as sectionIcons is 0-indexed by original section number
            let IconComponent = Settings; // Fallback icon
            
            // Ensure iconIndex is valid before accessing sectionIcons
            if (iconIndex >= 0 && iconIndex < sectionIcons.length) {
              IconComponent = sectionIcons[iconIndex];
            }


            let sectionTitle = `بخش ${sectionNumber}`;
            let sectionDescription = `جزئیات بخش ${sectionNumber}`;
            let sectionContent = `محتوای بخش ${sectionNumber} در اینجا قرار خواهد گرفت.`;
            let sectionLink = `/section/${sectionNumber}`;

            if (sectionNumber === 1) {
              sectionTitle = "برنامه‌ریز روزانه";
              sectionDescription = "برنامه‌ریزی و مدیریت کارهای روزانه";
              sectionContent = "وظایف امروز خود را اینجا برنامه‌ریزی کنید.";
            } else if (sectionNumber === 2) {
              sectionTitle = "تأملات روزانه";
              sectionDescription = "افکار و احساسات خود را ثبت و تحلیل کنید";
              sectionContent = "بینش‌های جدیدی در مورد خودتان با کمک هوش مصنوعی کشف کنید.";
            } else if (sectionNumber === 3) {
              sectionTitle = "مدیریت مالی";
              sectionDescription = "هزینه‌ها و درآمدهای خود را پیگیری کنید";
              sectionContent = "وضعیت مالی خود را بررسی و بودجه‌بندی کنید.";
            } else if (sectionNumber === 4) {
              sectionTitle = "تقویم و رویدادها";
              sectionDescription = "تقویم شمسی، رویدادها و مناسبت‌ها";
              sectionContent = "رویدادها، تولدها و مناسبت‌های مهم خود را در تقویم شمسی مدیریت کنید.";
            } else if (sectionNumber === 5) {
              sectionTitle = "اهداف و عادت‌ها";
              sectionDescription = "اهداف خود را تعیین و عادت‌های مثبت بسازید";
              sectionContent = "پیشرفت خود را در جهت اهداف و ساختن عادت‌های پایدار دنبال کنید. (بخش آینده)";
            } else if (sectionNumber === 6) {
              sectionTitle = "ورزشی";
              sectionDescription = "فعالیت‌های ورزشی خود را ثبت و پیگیری کنید";
              sectionContent = "برنامه‌های تمرینی، دویدن، یوگا و سایر فعالیت‌های بدنی خود را مدیریت کنید. (بخش آینده)";
            } else if (sectionNumber === 7) {
              sectionTitle = "تحصیل";
              sectionDescription = "برنامه‌های درسی، یادداشت‌ها و پیشرفت تحصیلی";
              sectionContent = "مطالب درسی خود را سازماندهی کنید، یادداشت بردارید و پیشرفت تحصیلی خود را پیگیری نمایید. (بخش آینده)";
            } else if (sectionNumber === 8) {
              sectionTitle = "یادداشت فعالیت‌های روزانه"; 
              sectionDescription = "فعالیت‌ها و کارهایی که در طول روز انجام داده‌اید را ثبت کنید.";
              sectionContent = "گزارشی از فعالیت‌های روزانه خود را در اینجا بنویسید و مرور کنید.";
            } else if (sectionNumber === 9) {
              sectionTitle = "برنامه‌ریزی بلند مدت"; 
              sectionDescription = "اهداف بزرگ و برنامه‌های طولانی‌مدت خود را تعریف و پیگیری کنید.";
              sectionContent = "اهداف آینده خود را اینجا برنامه‌ریزی و مدیریت نمایید.";
            } else if (sectionNumber === 10) {
              sectionTitle = "تحلیل هوشمند و گزارش جامع";
              sectionDescription = "مرکز تحلیل داده‌های برنامه با استفاده از هوش مصنوعی.";
              sectionContent = "در این بخش، گزارشات تحلیلی، نمودارها و بینش‌های هوشمند از تمام داده‌های شما ارائه می‌شود.";
            }

            return (
              <Link href={sectionLink} key={sectionNumber} className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg group">
                <Card className="shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out hover:scale-[1.03] cursor-pointer h-full flex flex-col bg-card border border-transparent group-hover:border-primary/50">
                  <CardHeader className="flex-shrink-0 pb-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <IconComponent className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg font-headline text-foreground">
                        {sectionTitle}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground pt-1">
                      {sectionDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow pt-2 text-sm text-foreground/90">
                    <p>
                      {sectionContent}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
