
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
  FileText,
  Settings,
  ListChecks,
  FolderKanban,
  BrainCircuit,
  CopyPlus,
  AreaChart,
  type LucideIcon
} from 'lucide-react';

interface Section {
  key: string;
  link: string;
  icon: LucideIcon;
  title: string;
  description: string;
  content: string;
}

const sections: Section[] = [
    {
        key: '1',
        link: '/section/1',
        icon: CalendarCheck2,
        title: "برنامه‌ریز روزانه",
        description: "برنامه‌ریزی و مدیریت کارهای روزانه",
        content: "وظایف امروز خود را اینجا برنامه‌ریزی کنید."
    },
    {
        key: '2',
        link: '/section/2',
        icon: BookHeart,
        title: "تأملات روزانه",
        description: "افکار و احساسات خود را ثبت و مرور کنید",
        content: "نوشته‌های روزانه خود را برای بازبینی ذخیره کنید."
    },
    {
        key: '3',
        link: '/section/3',
        icon: CircleDollarSign,
        title: "مدیریت مالی",
        description: "هزینه‌ها و درآمدهای خود را پیگیری کنید",
        content: "وضعیت مالی خود را بررسی و بودجه‌بندی کنید."
    },
    {
        key: '4',
        link: '/section/4',
        icon: CalendarDays,
        title: "تقویم و رویدادها",
        description: "تقویم شمسی، رویدادها و مناسبت‌ها",
        content: "رویدادها، تولدها و مناسبت‌های مهم خود را در تقویم شمسی مدیریت کنید."
    },
    {
        key: '5',
        link: '/section/5',
        icon: ListChecks,
        title: "ردیاب عادت‌ها",
        description: "عادت‌های مثبت خود را ایجاد و پیگیری کنید",
        content: "پیشرفت خود را در ساختن عادت‌های پایدار دنبال کنید."
    },
    {
        key: '6',
        link: '/section/6',
        icon: Dumbbell,
        title: "ورزشی",
        description: "فعالیت‌های ورزشی خود را ثبت و پیگیری کنید",
        content: "برنامه‌های تمرینی، فستینگ و سایر فعالیت‌های بدنی خود را مدیریت کنید."
    },
    {
        key: '7',
        link: '/section/7',
        icon: BookOpen,
        title: "تحصیل",
        description: "برنامه‌های درسی، یادداشت‌ها و پیشرفت تحصیلی",
        content: "مطالب درسی خود را سازماندهی کنید، یادداشت بردارید و پیشرفت تحصیلی خود را پیگیری نمایید."
    },
    {
        key: '8',
        link: '/section/8',
        icon: FileText,
        title: "صندوق ورودی و یادداشت سریع",
        description: "افکار، ایده‌ها و کارهای ناگهانی خود را سریع ثبت کنید.",
        content: "یک مکان برای خالی کردن ذهن و ثبت سریع یادداشت‌ها قبل از فراموشی."
    },
    {
        key: '9',
        link: '/section/9',
        icon: Target,
        title: "اهداف و کتاب‌ها",
        description: "اهداف بزرگ و کتاب‌های خود را تعریف و پیگیری کنید.",
        content: "اهداف آینده و لیست کتاب‌های خود را اینجا مدیریت نمایید."
    },
    {
        key: '11',
        link: '/section/11',
        icon: FolderKanban,
        title: "مدیریت پروژه‌ها",
        description: "پروژه‌های خود را با وظایف، مهلت‌ها و تیم مدیریت کنید.",
        content: "یک فضای متمرکز برای پیگیری پیشرفت پروژه‌های شخصی و کاری شما."
    },
    {
        key: '12',
        link: '/section/12',
        icon: BrainCircuit,
        title: "پایگاه دانش شخصی",
        description: "یادداشت‌ها، خلاصه‌ها و دانش خود را در یک ویکی شخصی سازماندهی کنید.",
        content: "یک مکان متمرکز برای ساختن پایگاه دانش خود و اتصال ایده‌ها به یکدیگر."
    },
    {
        key: '13',
        link: '/section/templates',
        icon: CopyPlus,
        title: "مدیریت قالب‌ها",
        description: "قالب‌هایی برای پروژه‌ها و وظایف تکراری خود بسازید.",
        content: "برای کارهای تکراری مانند راه‌اندازی پروژه جدید، قالب بسازید و در زمان خود صرفه‌جویی کنید."
    },
    {
        key: '14',
        link: '/section/review',
        icon: AreaChart,
        title: "مرور و گزارش‌گیری",
        description: "عملکرد خود را با گزارش‌های دوره‌ای تحلیل کنید",
        content: "نمودار وظایف، خلاصه‌های مالی و پیشرفت عادت‌های خود را در بازه‌های زمانی مختلف مشاهده کنید."
    },
    {
        key: 'settings',
        link: '/section/settings',
        icon: Settings,
        title: 'تنظیمات',
        description: 'پشتیبان‌گیری، بازیابی و سایر تنظیمات برنامه',
        content: 'از اطلاعات خود فایل پشتیبان تهیه کنید یا اطلاعات قبلی را بازیابی نمایید.'
    },
];


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            فضای شما برای رشد و تأمل
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
             "زندگی‌ای که مورد بررسی قرار نگیرد، ارزش زیستن ندارد." - سقراط
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Link href={section.link} key={section.key} className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                <Card className="h-full transform-gpu transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/20 bg-card/50 backdrop-blur-sm border-border/20 hover:border-primary/50">
                  <CardHeader className="flex-shrink-0 p-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <CardTitle className="text-lg font-headline font-semibold text-foreground">
                        {section.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground pt-1">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow p-4 pt-0 text-sm text-foreground/90">
                    <p>
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
      <footer className="text-center py-6 mt-8 border-t border-border/10 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
