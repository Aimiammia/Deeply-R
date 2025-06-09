
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Languages, Construction } from 'lucide-react';
import Image from 'next/image';

export default function LanguageLearningPage() {
  const sectionTitle = "یادگیری زبان";
  const sectionPageDescription = "ابزارها و منابعی برای کمک به شما در یادگیری زبان‌های جدید.";

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
              <Languages className="h-8 w-8 text-primary" />
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
            <h3 className="text-xl font-semibold text-foreground mb-2">بخش یادگیری زبان در دست ساخت است!</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              به زودی این بخش با ابزارهای متنوعی برای کمک به یادگیری زبان‌های جدید تکمیل خواهد شد. منتظر ما باشید!
            </p>
            <Image
              src="https://placehold.co/600x350.png"
              alt="تصویر مفهومی یادگیری زبان با کتاب‌ها و ابزارها"
              width={600}
              height={350}
              className="rounded-md mx-auto shadow-md"
              data-ai-hint="language learning books"
            />
            <div className="mt-8 p-6 border rounded-lg bg-secondary/30 shadow-inner max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-primary mb-3">قابلیت‌های برنامه‌ریزی شده برای آینده:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-left rtl:text-right text-foreground/90">
                  <li>مدیریت لغات (Vocabulary builder) با امکان افزودن، مرور و آزمون.</li>
                  <li>سیستم فلش کارت هوشمند برای به خاطر سپردن لغات و عبارات.</li>
                  <li>بخش تمرین گرامر با توضیحات و مثال‌ها.</li>
                  <li>امکان پیگیری پیشرفت در زبان‌های مختلف.</li>
                  <li>اتصال به منابع آموزشی آنلاین (اختیاری).</li>
                  <li>آزمون‌های کوچک برای سنجش سطح یادگیری.</li>
                  <li>قابلیت یادداشت‌برداری مخصوص زبان.</li>
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
