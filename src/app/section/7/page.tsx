
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
} from "@/components/ui/alert-dialog";
import { parseISO, format } from 'date-fns';
import { faIR } from 'date-fns/locale'; 
import { useDebouncedLocalStorage } from '@/hooks/useDebouncedLocalStorage';
import type { EducationalLevelStorage } from '@/types';


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

const MEHR_FIRST_MONTH = 8; 
const MEHR_FIRST_DAY = 23; 

function findNextLevelValue(currentValue: string): string | undefined {
  const currentIndex = educationalLevels.findIndex(level => level.value === currentValue);
  if (currentIndex === -1 || currentIndex >= educationalLevels.length - 1) {
    return undefined; 
  }
  const nextLevel = educationalLevels[currentIndex + 1];
  if (nextLevel.value === 'other' || currentValue === 'high_12') {
    return undefined;
  }
  return nextLevel.value;
}

const initialEducationalSettings: EducationalLevelStorage = {
  levelValue: '',
  isConfirmed: false,
  lastPromotionCheckDate: new Date(1970, 0, 1).toISOString(), // Default to a very old date
};

export default function EducationPage() {
  const sectionTitle = "تحصیل";
  const sectionPageDescription = "برنامه‌های درسی، یادداشت‌ها، منابع آموزشی و پیشرفت تحصیلی خود را در این بخش مدیریت کنید.";
  const { toast } = useToast();

  const [educationalSettings, setEducationalSettings] = useDebouncedLocalStorage<EducationalLevelStorage>(
    'educationalLevelSettingsDeeply', 
    initialEducationalSettings
  );
  
  const [isClient, setIsClient] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [levelToConfirm, setLevelToConfirm] = useState<string | undefined>(undefined);
  const [transientSelectedLevel, setTransientSelectedLevel] = useState<string | undefined>(educationalSettings.levelValue);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Update transientSelectedLevel when educationalSettings.levelValue changes from storage
  useEffect(() => {
    if (isClient) {
      setTransientSelectedLevel(educationalSettings.levelValue);
    }
  }, [educationalSettings.levelValue, isClient]);


  const calculateAutoPromotion = useCallback((currentSettings: EducationalLevelStorage): EducationalLevelStorage | null => {
    const { levelValue, lastPromotionCheckDate: lastPromoDateISO, isConfirmed } = currentSettings;

    if (!isConfirmed || !levelValue || levelValue === 'other' || levelValue === 'high_12') {
      return null; // No promotion needed or possible
    }

    let lastPromoDate = lastPromoDateISO ? parseISO(lastPromoDateISO) : new Date(1970, 0, 1);
    const today = new Date();
    let currentProcessingLevel = levelValue;
    let promotionsMade = 0;
    let effectiveLastPromotionDate = lastPromoDate;

    for (let year = lastPromoDate.getFullYear(); year <= today.getFullYear(); year++) {
      const mehrFirstInYear = new Date(year, MEHR_FIRST_MONTH, MEHR_FIRST_DAY);
      
      if (mehrFirstInYear > lastPromoDate && mehrFirstInYear <= today) {
        const nextLevel = findNextLevelValue(currentProcessingLevel);
        if (nextLevel) {
          currentProcessingLevel = nextLevel;
          promotionsMade++;
          effectiveLastPromotionDate = mehrFirstInYear; 
          if (currentProcessingLevel === 'high_12' || currentProcessingLevel === 'other') break;
        } else {
          break; 
        }
      }
    }
    if (promotionsMade > 0) {
      return {
        ...currentSettings,
        levelValue: currentProcessingLevel,
        lastPromotionCheckDate: effectiveLastPromotionDate.toISOString(),
      };
    }
    return null; // No promotion occurred
  }, []);


  useEffect(() => {
    if (isClient && educationalSettings.isConfirmed) {
      const newSettings = calculateAutoPromotion(educationalSettings);
      if (newSettings) {
        setEducationalSettings(newSettings); // This will trigger debounced save
        toast({
          title: "مقطع تحصیلی به‌روز شد",
          description: `مقطع تحصیلی شما به صورت خودکار به "${educationalLevels.find(l => l.value === newSettings.levelValue)?.label}" ارتقا یافت.`,
          duration: 7000,
        });
      }
    }
  }, [isClient, educationalSettings.isConfirmed, calculateAutoPromotion, toast, setEducationalSettings, educationalSettings]);


  const handleLevelChange = (value: string) => {
    setTransientSelectedLevel(value);
  };

  const handleOpenConfirmationDialog = () => {
    if (transientSelectedLevel) {
      setLevelToConfirm(transientSelectedLevel);
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
      setEducationalSettings({
        levelValue: levelToConfirm,
        isConfirmed: true,
        lastPromotionCheckDate: currentDateISO,
      });
      
      toast({
        title: "مقطع تحصیلی ذخیره شد",
        description: `مقطع تحصیلی شما به "${educationalLevels.find(l => l.value === levelToConfirm)?.label}" تایید و ذخیره شد.`,
      });
    }
    setShowConfirmationDialog(false);
    setLevelToConfirm(undefined);
  };
  
  const currentLevelLabel = educationalLevels.find(l => l.value === educationalSettings.levelValue)?.label;

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
              {!educationalSettings.isConfirmed && isClient && (
                <>
                  <Label htmlFor="educationalLevelSelect" className="text-base font-semibold text-foreground mb-2 block">
                    مقطع تحصیلی فعلی خود را انتخاب کنید:
                  </Label>
                  <Select
                    value={transientSelectedLevel}
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
                  <Button onClick={handleOpenConfirmationDialog} className="w-full mt-4" disabled={!transientSelectedLevel}>
                    ذخیره و تایید مقطع
                  </Button>
                </>
              )}

              {isClient && educationalSettings.isConfirmed && currentLevelLabel && (
                <div className="p-4 border rounded-lg bg-secondary/30 text-center">
                  <p className="text-lg font-semibold text-foreground mb-1">
                    مقطع تحصیلی فعلی شما:
                  </p>
                  <p className="text-2xl text-primary font-bold">
                    {currentLevelLabel}
                  </p>
                  {educationalSettings.lastPromotionCheckDate && parseISO(educationalSettings.lastPromotionCheckDate).getFullYear() > 1970 && ( // Check if it's not the default old date
                     <p className="text-xs text-muted-foreground mt-2">
                      آخرین بررسی ارتقا: {format(parseISO(educationalSettings.lastPromotionCheckDate), "yyyy/MM/dd", { locale: faIR })}
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
                    <AlertDialogCancel onClick={() => {setShowConfirmationDialog(false); setLevelToConfirm(undefined);}}>لغو</AlertDialogCancel>
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
