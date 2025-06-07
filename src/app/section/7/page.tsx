
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Construction, CheckCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { parseISO, format } from 'date-fns'; // format is not directly used but parseISO is essential

const educationalLevels = [
  { value: 'elementary_1', label: 'اول ابتدایی' },
  { value: 'elementary_2', label: 'دوم ابتدایی' },
  { value: 'elementary_3', label: 'سوم ابتدایی' },
  { value: 'elementary_4', label: 'چهارم ابتدایی' },
  { value: 'elementary_5', label: 'پنجم ابتدایی' },
  { value: 'elementary_6', label: 'ششم ابتدایی' },
  { value: 'middle_7', label: 'پایه هفتم' },
  { value: 'middle_8', label: 'پایه هشتم' },
  { value: 'middle_9', label: 'پایه نهم' },
  { value: 'high_10', label: 'پایه دهم' },
  { value: 'high_11', label: 'پایه یازدهم' },
  { value: 'high_12', label: 'پایه دوازدهم' },
  { value: 'other', label: 'سایر' },
];

const MEHR_FIRST_MONTH = 8; // September (0-indexed for Date object month)
const MEHR_FIRST_DAY = 23; // Approximate day for Mehr 1st

function findNextLevelValue(currentValue: string): string | undefined {
  const currentIndex = educationalLevels.findIndex(level => level.value === currentValue);
  if (currentIndex === -1 || currentIndex >= educationalLevels.length - 1) {
    return undefined; // Not found or already the last actual grade
  }
  const nextLevel = educationalLevels[currentIndex + 1];
  // Do not auto-promote to 'other' or if current is 'high_12' (already handled by currentIndex check mostly)
  if (nextLevel.value === 'other' || currentValue === 'high_12') {
    return undefined;
  }
  return nextLevel.value;
}

export default function EducationPage() {
  const sectionTitle = "تحصیل";
  const sectionPageDescription = "برنامه‌های درسی، یادداشت‌ها، منابع آموزشی و پیشرفت تحصیلی خود را در این بخش مدیریت کنید.";
  const { toast } = useToast();

  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(undefined);
  const [isLevelConfirmed, setIsLevelConfirmed] = useState<boolean>(false);
  // lastPromotionCheckDate stores the ISO string of the last Mehr 1st that triggered a promotion, or the date of initial confirmation.
  const [lastPromotionCheckDate, setLastPromotionCheckDate] = useState<string | undefined>(undefined);
  
  const [isClient, setIsClient] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [levelToConfirm, setLevelToConfirm] = useState<string | undefined>(undefined);

  const calculateAutoPromotion = useCallback((initialLevelValue: string, lastPromoDateISO: string | null): { newLevelValue: string, newLastPromotionDateISO: string, promotionsMade: number } => {
    if (!initialLevelValue || initialLevelValue === 'other' || initialLevelValue === 'high_12') {
      return { newLevelValue: initialLevelValue, newLastPromotionDateISO: lastPromoDateISO || new Date().toISOString(), promotionsMade: 0 };
    }

    let lastPromoDate = lastPromoDateISO ? parseISO(lastPromoDateISO) : new Date(1970, 0, 1);
    const today = new Date();
    let currentProcessingLevel = initialLevelValue;
    let promotions = 0;
    let effectiveLastPromotionDate = lastPromoDate;

    for (let year = lastPromoDate.getFullYear(); year <= today.getFullYear(); year++) {
      const mehrFirstInYear = new Date(year, MEHR_FIRST_MONTH, MEHR_FIRST_DAY);

      if (mehrFirstInYear > lastPromoDate && mehrFirstInYear <= today) {
        const nextLevel = findNextLevelValue(currentProcessingLevel);
        if (nextLevel) {
          currentProcessingLevel = nextLevel;
          promotions++;
          effectiveLastPromotionDate = mehrFirstInYear; // This Mehr 1st triggered promotion
          if (currentProcessingLevel === 'high_12' || currentProcessingLevel === 'other') break;
        } else {
          break; 
        }
      }
    }
    return { newLevelValue: currentProcessingLevel, newLastPromotionDateISO: effectiveLastPromotionDate.toISOString(), promotionsMade: promotions };
  }, []);


  useEffect(() => {
    setIsClient(true);
    try {
      const storedLevel = localStorage.getItem('educationalLevel');
      const storedConfirmed = localStorage.getItem('isEducationalLevelConfirmed');
      const storedLastPromoDate = localStorage.getItem('educationalLevelLastPromotionDate');

      if (storedLevel) {
        setSelectedLevel(storedLevel);
      }
      if (storedConfirmed) {
        setIsLevelConfirmed(storedConfirmed === 'true');
      }
      if (storedLastPromoDate) {
        setLastPromotionCheckDate(storedLastPromoDate);
      }

      if (storedConfirmed === 'true' && storedLevel) {
        // Perform auto-promotion check
        const { newLevelValue, newLastPromotionDateISO, promotionsMade } = calculateAutoPromotion(storedLevel, storedLastPromoDate);
        if (promotionsMade > 0) {
          setSelectedLevel(newLevelValue);
          setLastPromotionCheckDate(newLastPromotionDateISO); // Update state for UI consistency
          localStorage.setItem('educationalLevel', newLevelValue);
          localStorage.setItem('educationalLevelLastPromotionDate', newLastPromotionDateISO);
          toast({
            title: "مقطع تحصیلی به‌روز شد",
            description: `مقطع تحصیلی شما به صورت خودکار به "${educationalLevels.find(l => l.value === newLevelValue)?.label}" ارتقا یافت.`,
            duration: 5000,
          });
        }
      }

    } catch (error) {
      console.error("Failed to load educational settings from localStorage", error);
    }
  }, [isClient, calculateAutoPromotion, toast]);


  const handleLevelChange = (value: string) => {
    setSelectedLevel(value); // Update state for the Select component
  };

  const handleOpenConfirmationDialog = () => {
    if (selectedLevel) {
      setLevelToConfirm(selectedLevel);
      setShowConfirmationDialog(true);
    } else {
      toast({
        title: "خطا",
        description: "لطفاً ابتدا یک مقطع تحصیلی انتخاب کنید.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmLevel = () => {
    if (levelToConfirm) {
      const currentDateISO = new Date().toISOString();
      setSelectedLevel(levelToConfirm); // Finalize selectedLevel state
      setIsLevelConfirmed(true);
      setLastPromotionCheckDate(currentDateISO); // Set initial promo check date

      localStorage.setItem('educationalLevel', levelToConfirm);
      localStorage.setItem('isEducationalLevelConfirmed', 'true');
      localStorage.setItem('educationalLevelLastPromotionDate', currentDateISO);
      
      toast({
        title: "مقطع تحصیلی ذخیره شد",
        description: `مقطع تحصیلی شما به "${educationalLevels.find(l => l.value === levelToConfirm)?.label}" تایید و ذخیره شد.`,
      });
    }
    setShowConfirmationDialog(false);
  };
  
  const currentLevelLabel = educationalLevels.find(l => l.value === selectedLevel)?.label;

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
              {!isLevelConfirmed && isClient && (
                <>
                  <Label htmlFor="educationalLevelSelect" className="text-base font-semibold text-foreground mb-2 block">
                    مقطع تحصیلی فعلی خود را انتخاب کنید:
                  </Label>
                  <Select
                    value={selectedLevel}
                    onValueChange={handleLevelChange}
                    dir="rtl"
                  >
                    <SelectTrigger id="educationalLevelSelect" className="w-full text-base py-3">
                      <SelectValue placeholder="انتخاب کنید..." />
                    </SelectTrigger>
                    <SelectContent>
                      {educationalLevels.map(level => (
                        <SelectItem key={level.value} value={level.value} className="text-base">
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleOpenConfirmationDialog} className="w-full mt-4" disabled={!selectedLevel}>
                    ذخیره و تایید مقطع
                  </Button>
                </>
              )}

              {isClient && isLevelConfirmed && currentLevelLabel && (
                <div className="p-4 border rounded-lg bg-secondary/30 text-center">
                  <p className="text-lg font-semibold text-foreground mb-1">
                    مقطع تحصیلی فعلی شما:
                  </p>
                  <p className="text-2xl text-primary font-bold">
                    {currentLevelLabel}
                  </p>
                  {lastPromotionCheckDate && (
                     <p className="text-xs text-muted-foreground mt-2">
                      آخرین بررسی ارتقا: {format(parseISO(lastPromotionCheckDate), "yyyy/MM/dd", { locale: { code: 'fa-IR' }})}
                    </p>
                  )}
                   <p className="text-sm text-muted-foreground mt-3">
                    <AlertTriangle className="inline-block h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-amber-500" />
                    مقطع تحصیلی شما هر سال در ابتدای مهر به طور خودکار ارتقا خواهد یافت (در صورت امکان).
                  </p>
                </div>
              )}
               {!isClient && (
                 <p className="text-muted-foreground text-center py-4">در حال بارگذاری اطلاعات مقطع تحصیلی...</p>
               )}


              <AlertDialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog} dir="rtl">
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>تایید مقطع تحصیلی</AlertDialogTitle>
                    <AlertDialogDescription>
                      آیا از انتخاب مقطع تحصیلی "{educationalLevels.find(l => l.value === levelToConfirm)?.label}" مطمئن هستید؟ پس از تایید، این مقطع به صورت سالانه (اول مهر) به طور خودکار ارتقا پیدا خواهد کرد.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setLevelToConfirm(undefined)}>لغو</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmLevel}>تایید و ذخیره</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                <h4 className="text-lg font-semibold text-primary mb-2">قابلیت‌های پیاده‌سازی شده و آینده:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-left rtl:text-right text-foreground/80">
                  <li className="flex items-center"><CheckCircle className="ml-2 h-4 w-4 text-green-500 rtl:mr-2 rtl:ml-0" />انتخاب و ذخیره مقطع تحصیلی با تایید کاربر</li>
                  <li className="flex items-center"><CheckCircle className="ml-2 h-4 w-4 text-green-500 rtl:mr-2 rtl:ml-0" />ارتقای خودکار مقطع تحصیلی در اول مهر هر سال</li>
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

    