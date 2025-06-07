
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  CalendarCheck2,
  BookHeart,
  CircleDollarSign,
  // CalendarDays, // Removed for Section 4
  Target,
  Dumbbell,
  BookOpen,
  PieChart,
  FileEdit,
  Award
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Helper array for icons
const sectionIcons: LucideIcon[] = [
  CalendarCheck2,   // Section 1 (Tasks/Planner)
  BookHeart,        // Section 2 (Daily Reflections)
  CircleDollarSign, // Section 3 (Financial Management)
  Target,           // Section 5 (Goals and Habits) -> Was Section 4 placeholder, now Target
  Dumbbell,         // Section 6 (Sports/Exercise)
  BookOpen,         // Section 7 (Education/Study)
  PieChart,         // Section 8
  FileEdit,         // Section 9
  Award,            // Section 10
  Award             // Placeholder for removed section 4
];

export default function HomePage() {
  const allSectionNumbers = Array.from({ length: 10 }, (_, i) => i + 1);
  const sectionsToDisplay = allSectionNumbers.filter(num => num !== 4); // Filter out section 4

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionsToDisplay.map((sectionNumber) => {
            // Adjust icon indexing due to removal of section 4
            let iconIndex = sectionNumber -1;
            if (sectionNumber > 4) {
                iconIndex = sectionNumber - 2; // Shift index for sections after the removed one
            }
            const IconComponent = sectionIcons[iconIndex] || Award;


            let sectionTitle = `بخش ${sectionNumber}`;
            let sectionDescription = `جزئیات بخش ${sectionNumber}`;
            let sectionContent = `محتوای بخش ${sectionNumber} در اینجا قرار خواهد گرفت.`;

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
            } else if (sectionNumber === 5) {
              sectionTitle = "اهداف و عادت‌ها";
              sectionDescription = "اهداف خود را تعیین و عادت‌های مثبت بسازید";
              sectionContent = "پیشرفت خود را در جهت اهداف و ساختن عادت‌های پایدار دنبال کنید.";
            } else if (sectionNumber === 6) {
              sectionTitle = "ورزشی";
              sectionDescription = "فعالیت‌های ورزشی خود را ثبت و پیگیری کنید";
              sectionContent = "برنامه‌های تمرینی، دویدن، یوگا و سایر فعالیت‌های بدنی خود را مدیریت کنید.";
            } else if (sectionNumber === 7) {
              sectionTitle = "تحصیل";
              sectionDescription = "برنامه‌های درسی، یادداشت‌ها و پیشرفت تحصیلی";
              sectionContent = "مطالب درسی خود را سازماندهی کنید، یادداشت بردارید و پیشرفت تحصیلی خود را پیگیری نمایید.";
            }
            // Sections 8, 9, 10 will use the default title/description/content

            return (
              <Link href={`/section/${sectionNumber}`} key={sectionNumber} className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg group">
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
