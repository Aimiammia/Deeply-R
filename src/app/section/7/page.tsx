
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Construction, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const educationalLevels = [
  { value: 'diploma', label: 'دیپلم' },
  { value: 'associate', label: 'کاردانی' },
  { value: 'bachelor', label: 'کارشناسی' },
  { value: 'master', label: 'کارشناسی ارشد' },
  { value: 'phd', label: 'دکتری' },
  { value: 'seminary', label: 'حوزوی' },
  { value: 'other', label: 'سایر' },
];

export default function EducationPage() {
  const sectionTitle = "تحصیل";
  const sectionPageDescription = "برنامه‌های درسی، یادداشت‌ها، منابع آموزشی و پیشرفت تحصیلی خود را در این بخش مدیریت کنید.";
  const { toast } = useToast();

  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedLevel = localStorage.getItem('educationalLevel');
      if (storedLevel) {
        setSelectedLevel(storedLevel);
      }
    } catch (error) {
      console.error("Failed to load educational level from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient && selectedLevel !== undefined) {
      try {
        localStorage.setItem('educationalLevel', selectedLevel);
      } catch (error) {
        console.error("Failed to save educational level to localStorage", error);
      }
    }
  }, [selectedLevel, isClient]);

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    const levelLabel = educationalLevels.find(l => l.value === value)?.label || value;
    toast({
      title: "مقطع تحصیلی ذخیره شد",
      description: `مقطع تحصیلی شما به "${levelLabel}" تغییر یافت.`,
    });
  };

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
              <BookOpen className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline text-primary">
                {sectionTitle}
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {sectionPageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="max-w-md mx-auto">
              <Label htmlFor="educationalLevel" className="text-base font-semibold text-foreground mb-2 block">
                مقطع تحصیلی خود را انتخاب کنید:
              </Label>
              <Select
                value={selectedLevel}
                onValueChange={handleLevelChange}
                disabled={!isClient}
                dir="rtl"
              >
                <SelectTrigger id="educationalLevel" className="w-full text-base py-3">
                  <SelectValue placeholder={isClient ? "انتخاب کنید..." : "بارگذاری..."} />
                </SelectTrigger>
                <SelectContent>
                  {educationalLevels.map(level => (
                    <SelectItem key={level.value} value={level.value} className="text-base">
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isClient && selectedLevel && (
                <p className="mt-4 text-sm text-muted-foreground flex items-center">
                  <CheckCircle className="ml-2 h-4 w-4 text-green-500 rtl:mr-2 rtl:ml-0" />
                  مقطع تحصیلی فعلی شما: <span className="font-semibold text-accent mr-1">{educationalLevels.find(l => l.value === selectedLevel)?.label}</span>
                </p>
              )}
            </div>

            <div className="text-center">
              <Construction className="mx-auto h-16 w-16 text-primary/70 mb-4 mt-12" />
              <h3 className="text-xl font-semibold text-foreground mb-2">بخش تحصیل در دست ساخت است!</h3>
              <p className="text-muted-foreground mb-6">
                به زودی می‌توانید برنامه‌های مطالعاتی خود را تنظیم کنید، یادداشت‌های درسی را ذخیره و مرور نمایید، و پیشرفت خود را در دوره‌های مختلف آموزشی پیگیری کنید.
              </p>
              <Image
                src="https://placehold.co/600x400.png"
                alt="Education and Study Placeholder"
                width={600}
                height={400}
                className="rounded-md mx-auto shadow-md"
                data-ai-hint="study education learning"
              />
            </div>
            <div className="mt-8 p-4 border rounded-lg bg-secondary/30">
                <h4 className="text-lg font-semibold text-primary mb-2">قابلیت‌های آینده:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-left rtl:text-right text-foreground/80">
                  <li className="flex items-center"><CheckCircle className="ml-2 h-4 w-4 text-green-500 rtl:mr-2 rtl:ml-0" />انتخاب و ذخیره مقطع تحصیلی</li>
                  <li>ایجاد برنامه مطالعاتی و زمان‌بندی بر اساس مقطع تحصیلی</li>
                  <li>یادداشت‌برداری پیشرفته با امکان ضمیمه فایل</li>
                  <li>مدیریت منابع آموزشی (کتاب، مقاله، ویدیو) متناسب با مقطع</li>
                  <li>پیگیری پیشرفت در دروس و آزمون‌ها</li>
                  <li>سیستم فلش کارت برای یادگیری لغات و مفاهیم</li>
                  <li>اتصال به تقویم برای یادآوری کلاس‌ها و امتحانات</li>
                  <li>پیشنهاد منابع آموزشی مرتبط با مقطع و رشته (در صورت وارد کردن رشته)</li>
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
