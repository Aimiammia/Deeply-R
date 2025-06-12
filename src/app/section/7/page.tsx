
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, Construction, CheckCircle, AlertTriangle, ListChecks, FileText, Layers, Target as TargetIcon, CalendarClock, Brain, BookMarked, Edit, CheckSquare, Settings } from 'lucide-react';
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
import type { EducationalLevelStorage, EducationalSubjectUserProgress, SubjectProgress } from '@/types';
import { educationalSubjects, type Subject as EducationalSubjectType } from '@/lib/educational-data';


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

const MEHR_FIRST_MONTH = 8; // September (JavaScript month is 0-indexed, so 8 is September)
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
  lastPromotionCheckDate: new Date(1970, 0, 1).toISOString(),
};

export default function EducationPage() {
  const sectionTitle = "تحصیل و یادگیری";
  const sectionPageDescription = "مرکز جامع مدیریت امور تحصیلی شما. مقطع تحصیلی خود را تنظیم کنید، پیشرفت در دروس را پیگیری کرده و برنامه‌های درسی (از طریق بخش ۱ - برنامه‌ریز) ایجاد نمایید.";
  const { toast } = useToast();

  const [educationalSettings, setEducationalSettings] = useDebouncedLocalStorage<EducationalLevelStorage>(
    'educationalLevelSettingsDeeply', 
    initialEducationalSettings
  );
  
  const [subjectProgress, setSubjectProgress] = useDebouncedLocalStorage<EducationalSubjectUserProgress>(
    'educationalSubjectProgressDeeply',
    {}
  );

  const [isClient, setIsClient] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [levelToConfirm, setLevelToConfirm] = useState<string | undefined>(undefined);
  const [transientSelectedLevel, setTransientSelectedLevel] = useState<string | undefined>(educationalSettings.levelValue);

  const currentSubjectsForLevel: EducationalSubjectType[] = educationalSettings.isConfirmed && educationalSettings.levelValue
    ? educationalSubjects[educationalSettings.levelValue] || []
    : [];

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient) {
      setTransientSelectedLevel(educationalSettings.levelValue);
    }
  }, [educationalSettings.levelValue, isClient]);


  const calculateAutoPromotion = useCallback((currentSettings: EducationalLevelStorage): EducationalLevelStorage | null => {
    const { levelValue, lastPromotionCheckDate: lastPromoDateISO, isConfirmed } = currentSettings;

    if (!isConfirmed || !levelValue || levelValue === 'other' || levelValue === 'high_12') {
      return null; 
    }

    let lastPromoDate = lastPromoDateISO ? parseISO(lastPromoDateISO) : new Date(1970, 0, 1);
    const today = new Date();
    let currentProcessingLevel = levelValue;
    let promotionsMade = 0;
    let effectiveLastPromotionDate = lastPromoDate;

    for (let year = lastPromoDate.getFullYear(); year <= today.getFullYear(); year++) {
      // Note: JavaScript months are 0-indexed, so MEHR_FIRST_MONTH (e.g., 9 for September) needs -1.
      // However, the problem description uses `MEHR_FIRST_MONTH = 8` and seems to imply it's already adjusted or using a 1-indexed idea that gets corrected.
      // For safety, let's assume the MEHR_FIRST_MONTH constant is for `new Date(year, MONTH, DAY)` where MONTH is 0-indexed.
      // If MEHR_FIRST_MONTH = 8 means "Mehr" (which is the 7th month in Jalali, around Sept/Oct), then using 8 for September is correct for JS Date.
      const mehrFirstInYear = new Date(year, MEHR_FIRST_MONTH -1, MEHR_FIRST_DAY); // Adjusted for 0-indexed month
      
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
    return null; 
  }, []);


  useEffect(() => {
    if (isClient && educationalSettings.isConfirmed) {
      const newSettingsFromPromotion = calculateAutoPromotion(educationalSettings);
      
      if (newSettingsFromPromotion) {
        if (newSettingsFromPromotion.levelValue !== educationalSettings.levelValue || 
            newSettingsFromPromotion.lastPromotionCheckDate !== educationalSettings.lastPromotionCheckDate) {
          setEducationalSettings(newSettingsFromPromotion);
          toast({
            title: "مقطع تحصیلی به‌روز شد",
            description: `مقطع تحصیلی شما به صورت خودکار به "${educationalLevels.find(l => l.value === newSettingsFromPromotion.levelValue)?.label}" ارتقا یافت.`,
            duration: 7000,
          });
        }
      } else {
        // No promotion occurred, update lastPromotionCheckDate only if it's a new day
        const today = new Date();
        const lastCheckDate = educationalSettings.lastPromotionCheckDate ? parseISO(educationalSettings.lastPromotionCheckDate) : new Date(1970,0,1);
        
        // Compare date part only
        const todayDateString = format(today, 'yyyy-MM-dd');
        const lastCheckDateString = format(lastCheckDate, 'yyyy-MM-dd');

        if (lastCheckDateString !== todayDateString) {
          setEducationalSettings(prev => ({ ...prev, lastPromotionCheckDate: today.toISOString() }));
        }
      }
    }
  }, [isClient, educationalSettings, calculateAutoPromotion, toast, setEducationalSettings]);


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
      setSubjectProgress({}); 
      toast({
        title: "مقطع تحصیلی ذخیره شد",
        description: `مقطع تحصیلی شما به "${educationalLevels.find(l => l.value === levelToConfirm)?.label}" تایید و ذخیره شد.`,
      });
    }
    setShowConfirmationDialog(false);
    setLevelToConfirm(undefined);
  };

  const handleSubjectStatusChange = (subjectId: string, newStatus: SubjectProgress['status']) => {
    setSubjectProgress(prev => {
      const currentProgress = prev[subjectId] || { status: 'not-started', currentGrade: null, detailedNotes: null };
      return {
        ...prev,
        [subjectId]: {
          ...currentProgress,
          status: newStatus,
        }
      };
    });
  };
  
  const handleGradeChange = (subjectId: string, newGrade: string) => {
    setSubjectProgress(prev => {
      const currentProgress = prev[subjectId] || { status: 'not-started', currentGrade: null, detailedNotes: null };
      return {
        ...prev,
        [subjectId]: {
          ...currentProgress,
          currentGrade: newGrade || null,
        }
      };
    });
  };

  const handleDetailedNotesChange = (subjectId: string, newNotes: string) => {
    setSubjectProgress(prev => {
      const currentProgress = prev[subjectId] || { status: 'not-started', currentGrade: null, detailedNotes: null };
      return {
        ...prev,
        [subjectId]: {
          ...currentProgress,
          detailedNotes: newNotes || null,
        }
      };
    });
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

        <div className="mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-1">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">{sectionTitle}</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {sectionPageDescription}
          </p>
        </div>
        
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center text-foreground">
                        <Settings className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                        تنظیمات مقطع تحصیلی
                    </CardTitle>
                </CardHeader>
                <CardContent className="max-w-md mx-auto">
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
                        {educationalSettings.lastPromotionCheckDate && parseISO(educationalSettings.lastPromotionCheckDate).getFullYear() > 1970 && (
                            <p className="text-xs text-muted-foreground mt-2">
                            آخرین بررسی ارتقا: {format(parseISO(educationalSettings.lastPromotionCheckDate), "yyyy/MM/dd", { locale: faIR })}
                            </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-3">
                            <AlertTriangle className="inline-block h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-amber-500" />
                            مقطع تحصیلی شما هر سال در ابتدای مهر به طور خودکار ارتقا خواهد یافت (در صورت امکان).
                        </p>
                        <Button variant="link" size="sm" onClick={() => {
                            setEducationalSettings({...initialEducationalSettings, levelValue: educationalSettings.levelValue || ''});
                            }} className="mt-2 text-xs">
                            تغییر مقطع تحصیلی
                        </Button>
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
                            آیا از انتخاب مقطع تحصیلی "{educationalLevels.find(l => l.value === levelToConfirm)?.label}" مطمئن هستید؟ پس از تایید، این مقطع به صورت سالانه (اول مهر) به طور خودکار ارتقا پیدا خواهد کرد و پیشرفت دروس فعلی شما (در صورت وجود) پاک خواهد شد.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => {setShowConfirmationDialog(false); setLevelToConfirm(undefined);}}>لغو</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmLevel}>تایید و ذخیره</AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>

            {isClient && educationalSettings.isConfirmed && currentSubjectsForLevel.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center text-foreground">
                             <ListChecks className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                             پیگیری پیشرفت دروس ({currentLevelLabel})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {currentSubjectsForLevel.map(subject => (
                            <Card key={subject.id} className="bg-card shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-md">{subject.name}</CardTitle>
                                    <CardDescription>تعداد کل فصول: {subject.totalChapters.toLocaleString('fa-IR')}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-3">
                                    <div>
                                        <Label htmlFor={`status-${subject.id}`} className="text-xs">وضعیت مطالعه:</Label>
                                        <Select
                                            value={subjectProgress[subject.id]?.status || 'not-started'}
                                            onValueChange={(value) => handleSubjectStatusChange(subject.id, value as SubjectProgress['status'])}
                                        >
                                            <SelectTrigger id={`status-${subject.id}`} className="mt-1">
                                                <SelectValue placeholder="انتخاب وضعیت..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="not-started">شروع نشده</SelectItem>
                                                <SelectItem value="in-progress">در حال مطالعه</SelectItem>
                                                <SelectItem value="completed">مطالعه شده</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor={`grade-${subject.id}`} className="text-xs">نمره فعلی/توصیفی (اختیاری):</Label>
                                        <Input
                                          id={`grade-${subject.id}`}
                                          value={subjectProgress[subject.id]?.currentGrade || ''}
                                          onChange={(e) => handleGradeChange(subject.id, e.target.value)}
                                          placeholder="مثلا: ۱۸.۵، عالی، نیاز به تلاش بیشتر"
                                          className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`detailedNotes-${subject.id}`} className="text-xs">یادداشت‌های بیشتر (اختیاری):</Label>
                                        <Textarea
                                          id={`detailedNotes-${subject.id}`}
                                          value={subjectProgress[subject.id]?.detailedNotes || ''}
                                          onChange={(e) => handleDetailedNotesChange(subject.id, e.target.value)}
                                          placeholder="نکات مهم، مباحث نیازمند مرور، سوالات و..."
                                          rows={2}
                                          className="mt-1"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            )}
            
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="text-xl text-primary">امکانات بخش تحصیل</CardTitle>
                    <CardDescription>
                        پس از تنظیم مقطع تحصیلی، می‌توانید از قابلیت‌های زیر برای برنامه‌ریزی و مدیریت امور آموزشی خود استفاده کنید.
                        برخی از این قابلیت‌ها در حال حاضر به صورت پایه موجود هستند و برخی دیگر در آینده تکمیل خواهند شد.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <li className="flex items-start p-3 rounded-md bg-background shadow-sm">
                            <CheckSquare className="ml-3 h-5 w-5 text-green-500 rtl:mr-3 rtl:ml-0 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-foreground">انتخاب و ارتقای خودکار مقطع تحصیلی</span>
                                <p className="text-xs text-muted-foreground">مقطع خود را انتخاب کنید تا برنامه به طور خودکار آن را ارتقا دهد.</p>
                            </div>
                        </li>
                        <li className="flex items-start p-3 rounded-md bg-background shadow-sm">
                            <ListChecks className="ml-3 h-5 w-5 text-green-500 rtl:mr-3 rtl:ml-0 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-foreground">ایجاد برنامه مطالعاتی و زمان‌بندی</span>
                                <p className="text-xs text-muted-foreground">
                                    وظایف درسی خود را در <Link href="/section/1" className="text-primary hover:underline">برنامه‌ریز روزانه (بخش ۱)</Link> با انتخاب دسته‌بندی "درس" و مشخص کردن درس و فصول مربوط به مقطع خود، ثبت و مدیریت کنید.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start p-3 rounded-md bg-background shadow-sm">
                            <TargetIcon className="ml-3 h-5 w-5 text-green-500 rtl:mr-3 rtl:ml-0 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-foreground">پیگیری پیشرفت در دروس</span>
                                <p className="text-xs text-muted-foreground">وضعیت مطالعه، نمرات و یادداشت‌های هر درس را مشخص کنید.</p>
                            </div>
                        </li>
                        <li className="flex items-start p-3 rounded-md bg-background shadow-sm opacity-70">
                            <FileText className="ml-3 h-5 w-5 text-yellow-500 rtl:mr-3 rtl:ml-0 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-foreground">یادداشت‌برداری پیشرفته (آینده)</span>
                                <p className="text-xs text-muted-foreground">امکان یادداشت‌برداری با قابلیت ضمیمه فایل و قالب‌بندی‌های متنوع.</p>
                            </div>
                        </li>
                        <li className="flex items-start p-3 rounded-md bg-background shadow-sm opacity-70">
                            <BookMarked className="ml-3 h-5 w-5 text-yellow-500 rtl:mr-3 rtl:ml-0 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-foreground">مدیریت منابع آموزشی (آینده)</span>
                                <p className="text-xs text-muted-foreground">سازماندهی کتاب‌ها، مقالات و ویدیوهای آموزشی مرتبط با هر درس و مقطع.</p>
                            </div>
                        </li>
                        <li className="flex items-start p-3 rounded-md bg-background shadow-sm opacity-70">
                            <Layers className="ml-3 h-5 w-5 text-yellow-500 rtl:mr-3 rtl:ml-0 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-foreground">سیستم فلش کارت (آینده)</span>
                                <p className="text-xs text-muted-foreground">ابزاری برای یادگیری و مرور لغات، فرمول‌ها و مفاهیم کلیدی.</p>
                            </div>
                        </li>
                        <li className="flex items-start p-3 rounded-md bg-background shadow-sm opacity-70">
                            <CalendarClock className="ml-3 h-5 w-5 text-yellow-500 rtl:mr-3 rtl:ml-0 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-foreground">اتصال به تقویم (آینده)</span>
                                <p className="text-xs text-muted-foreground">یادآوری خودکار کلاس‌ها، امتحانات و مهلت‌های تحصیلی در تقویم برنامه.</p>
                            </div>
                        </li>
                        <li className="flex items-start p-3 rounded-md bg-background shadow-sm opacity-70">
                            <Brain className="ml-3 h-5 w-5 text-yellow-500 rtl:mr-3 rtl:ml-0 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-foreground">پیشنهاد منابع هوشمند (آینده)</span>
                                <p className="text-xs text-muted-foreground">دریافت پیشنهاد منابع آموزشی مرتبط با مقطع و رشته تحصیلی شما (نیازمند تکمیل اطلاعات رشته).</p>
                            </div>
                        </li>
                        <li className="flex items-start p-3 rounded-md bg-background shadow-sm opacity-70">
                            <Edit className="ml-3 h-5 w-5 text-yellow-500 rtl:mr-3 rtl:ml-0 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-foreground">پیگیری دقیق‌تر پیشرفت و آزمون‌ها (آینده)</span>
                                <p className="text-xs text-muted-foreground">ثبت نمرات، تحلیل عملکرد و ...</p>
                            </div>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <div className="text-center mt-8 py-4">
                <Construction className="mx-auto h-12 w-12 text-primary/50 mb-3" />
                <h4 className="text-lg font-semibold text-foreground">بخش تحصیل در حال توسعه است!</h4>
                <p className="text-muted-foreground text-sm">
                ما به طور مداوم در حال کار بر روی افزودن و بهبود قابلیت‌های این بخش هستیم تا تجربه یادگیری شما را غنی‌تر کنیم.
                </p>
                <Image
                src="https://placehold.co/500x300.png"
                alt="تصویر مفهومی تحصیل، یادگیری و مطالعه"
                width={500}
                height={300}
                className="rounded-md mx-auto shadow-md mt-6 opacity-80"
                data-ai-hint="education learning study"
                />
            </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}


    