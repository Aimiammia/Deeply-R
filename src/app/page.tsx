
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  CalendarCheck2, // Section 1 (Tasks/Planner)
  BookHeart,      // Section 2 (Daily Reflections)
  LineChart,
  Settings2,
  Users2,
  BriefcaseBusiness,
  CalendarClock,
  PieChart,
  FileEdit,
  Award
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Helper array for icons
const sectionIcons: LucideIcon[] = [
  CalendarCheck2,   // Section 1 (Tasks/Planner)
  BookHeart,        // Section 2 (Daily Reflections)
  LineChart,        // Section 3
  Settings2,        // Section 4
  Users2,           // Section 5
  BriefcaseBusiness,// Section 6
  CalendarClock,    // Section 7
  PieChart,         // Section 8
  FileEdit,         // Section 9
  Award             // Section 10
];

export default function HomePage() {
  const sections = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((sectionNumber) => {
            const IconComponent = sectionIcons[sectionNumber - 1] || Award; // Default to Award icon if out of bounds
            
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
            }

            return (
              <Link href={`/section/${sectionNumber}`} key={sectionNumber} className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg">
                <Card className="shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <IconComponent className="h-7 w-7 text-primary" />
                      <CardTitle className="text-xl font-headline text-primary">
                        {sectionTitle}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      {sectionDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
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
        <p>&copy; {new Date().getFullYear()} Daily Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}
