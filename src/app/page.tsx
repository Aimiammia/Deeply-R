'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  CalendarCheck2,
  BookHeart,
  CircleDollarSign,
  CalendarDays,
  Target,
  Dumbbell,
  BookOpen,
  PieChart,
  FileText,
  Settings,
  ListChecks,
  FolderKanban
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Helper array for icons
const sectionIcons: LucideIcon[] = [
  CalendarCheck2,   // Section 1 (Tasks/Planner)
  BookHeart,        // Section 2 (Daily Reflections)
  CircleDollarSign, // Section 3 (Financial Management)
  CalendarDays,     // Section 4 (Calendar)
  ListChecks,       // Section 5 (Habits)
  Dumbbell,         // Section 6 (Sports/Exercise)
  BookOpen,         // Section 7 (Education/Study)
  FileText,         // Section 8 (Daily Activity Log)
  Target,           // Section 9 (Goals)
  PieChart,         // Section 10 (Data Analysis and Reports)
  FolderKanban,     // Section 11 (Projects)
];

export default function HomePage() {
  const sectionsToDisplay = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionsToDisplay.map((sectionNumber) => {
            const iconIndex = sectionNumber -1;
            let IconComponent = Settings; // Fallback icon

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
              sectionTitle = "ردیاب عادت‌ها";
              sectionDescription = "عادت‌های مثبت خود را ایجاد و پیگیری کنید";
              sectionContent = "پیشرفت خود را در ساختن عادت‌های پایدار دنبال کنید.";
            } else if (sectionNumber === 6) {
              sectionTitle = "ورزشی";
              sectionDescription = "فعالیت‌های ورزشی خود را ثبت و پیگیری کنید";
              sectionContent = "برنامه‌های تمرینی، دویدن، یوگا و سایر فعالیت‌های بدنی خود را مدیریت کنید. (بخش آینده)";
            } else if (sectionNumber === 7) {
              sectionTitle = "تحصیل";
              sectionDescription = "برنامه‌های درسی، یادداشت‌ها و پیشرفت تحصیلی";
              sectionContent = "مطالب درسی خود را سازماندهی کنید، یادداشت بردارید و پیشرفت تحصیلی خود را پیگیری نمایید.";
            } else if (sectionNumber === 8) {
              sectionTitle = "یادداشت فعالیت‌های روزانه";
              sectionDescription = "فعالیت‌ها و کارهایی که در طول روز انجام داده‌اید را ثبت کنید.";
              sectionContent = "گزارشی از فعالیت‌های روزانه خود را در اینجا بنویسید و مرور کنید.";
            } else if (sectionNumber === 9) {
              sectionTitle = "اهداف";
              sectionDescription = "اهداف بزرگ و برنامه‌های خود را تعریف و پیگیری کنید.";
              sectionContent = "اهداف آینده خود را اینجا برنامه‌ریزی و مدیریت نمایید.";
              sectionLink = `/section/9`;
            } else if (sectionNumber === 10) {
              sectionTitle = "تحلیل هوشمند و گزارش جامع";
              sectionDescription = "مرکز تحلیل داده‌های برنامه با استفاده از هوش مصنوعی.";
              sectionContent = "در این بخش، گزارشات تحلیلی، نمودارها و بینش‌های هوشمند از تمام داده‌های شما ارائه می‌شود.";
            } else if (sectionNumber === 11) {
              sectionTitle = "مدیریت پروژه‌ها";
              sectionDescription = "پروژه‌های خود را با وظایف، مهلت‌ها و تیم مدیریت کنید.";
              sectionContent = "یک فضای متمرکز برای پیگیری پیشرفت پروژه‌های شخصی و کاری شما.";
              sectionLink = `/section/11`;
            }

            return (
              <Link href={sectionLink} key={sectionNumber} className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg group">
                <Card className="shadow-md hover:shadow-lg border border-border/60 hover:border-primary/70 transition-all duration-300 ease-in-out hover:scale-[1.02] cursor-pointer h-full flex flex-col bg-card">
                  <CardHeader className="flex-shrink-0 p-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <IconComponent className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl font-headline font-semibold text-foreground">
                        {sectionTitle}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground pt-1">
                      {sectionDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow p-4 pt-0 text-sm text-foreground/90">
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
