
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, Construction, CheckCircle, AlertTriangle, ListChecks, FileText, Layers, Target as TargetIcon, CalendarClock, Brain, BookMarked, Edit, CheckSquare, Settings, Loader2, Edit3 } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
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
import { parseISO, format, startOfDay } from 'date-fns';
import { faIR } from 'date-fns/locale'; 
import { useFirestore } from '@/hooks/useFirestore';
import type { EducationalLevelStorage, EducationalSubjectUserProgress, SubjectProgress } from '@/types';
import { educationalSubjects, type Subject as EducationalSubjectType } from '@/lib/educational-data';
import { ClientOnly } from '@/components/ClientOnly';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


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

const calculateAutoPromotion = (currentSettings: EducationalLevelStorage): EducationalLevelStorage | null => {
    const { levelValue, lastPromotionCheckDate: lastPromoDateISO, isConfirmed } = currentSettings;

    if (!isConfirmed || !levelValue || levelValue === 'other' || levelValue === 'high_12') {
      return null; 
    }

    const MEHR_FIRST_MONTH = 7; 
    const MEHR_FIRST_DAY_GREGORIAN_APPROX = 23;
    let lastPromoDate = startOfDay(lastPromoDateISO ? parseISO(lastPromoDateISO) : new Date(1970, 0, 1));
    const today = startOfDay(new Date());
    let currentProcessingLevel = levelValue;
    let promotionsMade = 0;
    let effectiveLastPromotionDate = lastPromoDate;

    for (let year = lastPromoDate.getFullYear(); year <= today.getFullYear(); year++) {
      const mehrFirstInYear = startOfDay(new Date(year, MEHR_FIRST_MONTH -1, MEHR_FIRST_DAY_GREGORIAN_APPROX)); 
      
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
};


const initialEducationalSettings: EducationalLevelStorage = {
  levelValue: '',
  isConfirmed: false,
  lastPromotionCheckDate: new Date(1970, 0, 1).toISOString(),
};

const DynamicEducationContent = dynamic(() => Promise.resolve(EducationContent), {
  ssr: false,
  loading: () => (
    <div className="space-y-8">
      <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full mt-4" /></CardContent></Card>
      <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
    </div>
  )
});

function EducationContent({
  educationalSettings,
  setEducationalSettings,
  subjectProgress,
  setSubjectProgress,
  dataLoading,
}: {
  educationalSettings: EducationalLevelStorage;
  setEducationalSettings: (value: EducationalLevelStorage | ((val: EducationalLevelStorage) => EducationalLevelStorage)) => void;
  subjectProgress: EducationalSubjectUserProgress;
  setSubjectProgress: (value: EducationalSubjectUserProgress | ((val: EducationalSubjectUserProgress) => EducationalSubjectUserProgress)) => void;
  dataLoading: boolean;
}) {
  const { toast } = useToast();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [levelToConfirm, setLevelToConfirm] = useState<string | undefined>(undefined);
  const [transientSelectedLevel, setTransientSelectedLevel] = useState<string | undefined>(educationalSettings.levelValue);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEditingSubject, setCurrentEditingSubject] = useState<EducationalSubjectType | null>(null);
  
  useEffect(() => {
    if (!dataLoading) {
      setTransientSelectedLevel(educationalSettings.levelValue);
    }
  }, [educationalSettings.levelValue, dataLoading]);
  
  // Destructure for stable dependencies
  const { levelValue, isConfirmed, lastPromotionCheckDate } = educationalSettings;
  
  // Refactored useEffect with stable, primitive dependencies
  useEffect(() => {
    if (dataLoading) {
      return;
    }
    
    const newSettings = calculateAutoPromotion({ levelValue, isConfirmed, lastPromotionCheckDate });
    
    // Only update if a promotion actually happened and the new values are different
    if (newSettings && (newSettings.levelValue !== levelValue || newSettings.lastPromotionCheckDate !== lastPromotionCheckDate)) {
        setEducationalSettings(newSettings);
        toast({
          title: "مقطع تحصیلی به‌روز شد",
          description: `مقطع تحصیلی شما به صورت خودکار به "${educationalLevels.find(l => l.value === newSettings.levelValue)?.label}" در تاریخ ${formatJalaliDateDisplay(parseISO(newSettings.lastPromotionCheckDate), 'PPP')} ارتقا یافت.`,
          duration: 7000,
        });
    }
  }, [dataLoading, levelValue, isConfirmed, lastPromotionCheckDate, setEducationalSettings, toast]);


  const currentSubjectsForLevel: EducationalSubjectType[] = educationalSettings.isConfirmed && educationalSettings.levelValue
    ? educationalSubjects[educationalSettings.levelValue] || []
    : [];

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

  const handleSubjectStatusChange = useCallback((subjectId: string, newStatus: SubjectProgress['status']) => {
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
  }, [setSubjectProgress]);
  
  const handleGradeChange = useCallback((subjectId: string, newGrade: string) => {
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
  }, [setSubjectProgress]);

  const handleDetailedNotesChange = useCallback((subjectId: string, newNotes: string) => {
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
  }, [setSubjectProgress]);
  
  const handleOpenEditDialog = (subject: EducationalSubjectType) => {
    setCurrentEditingSubject(subject);
    setDialogOpen(true);
  };
  
  const currentLevelLabel = educationalLevels.find(l => l.value === educationalSettings.levelValue)?.label;

  const totalSubjects = currentSubjectsForLevel.length;
  const completedSubjects = useMemo(() => {
    return Object.values(subjectProgress).filter(p => p.status === 'completed').length;
  }, [subjectProgress]);


  if (dataLoading) {
     return (
        <div className="flex justify-center items-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground mr-2">در حال بارگذاری تنظیمات تحصیلی...</p>
        </div>
    );
  }

  return (
    <>
      <Card>
          <CardHeader>
              <CardTitle className="text-xl flex items-center text-foreground">
                  <Settings className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                  تنظیمات مقطع تحصیلی
              </CardTitle>
          </CardHeader>
          <CardContent className="max-w-md mx-auto">
              {!educationalSettings.isConfirmed ? (
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
              ) : currentLevelLabel && (
                  <div className="p-4 border rounded-lg bg-secondary/30 text-center">
                  <p className="text-lg font-semibold text-foreground mb-1">
                      مقطع تحصیلی فعلی شما:
                  </p>
                  <p className="text-2xl text-primary font-bold">
                      {currentLevelLabel}
                  </p>
                  {educationalSettings.lastPromotionCheckDate && parseISO(educationalSettings.lastPromotionCheckDate).getFullYear() > 1970 && (
                      <p className="text-xs text-muted-foreground mt-2">
                      آخرین ارتقا: {formatJalaliDateDisplay(parseISO(educationalSettings.lastPromotionCheckDate), "PPP")}
                      </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-3">
                      <AlertTriangle className="inline-block h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-amber-500" />
                      مقطع شما هر سال در ابتدای مهر به طور خودکار ارتقا خواهد یافت.
                  </p>
                  <Button variant="link" size="sm" onClick={() => {
                      setEducationalSettings({...initialEducationalSettings, levelValue: educationalSettings.levelValue || ''});
                      }} className="mt-2 text-xs">
                      تغییر مقطع تحصیلی
                  </Button>
                  </div>
              )}
          </CardContent>
      </Card>

      {educationalSettings.isConfirmed && currentSubjectsForLevel.length > 0 && (
          <Card>
              <CardHeader>
                  <CardTitle className="text-xl flex items-center text-foreground">
                        <ListChecks className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                        پیگیری پیشرفت دروس ({currentLevelLabel})
                  </CardTitle>
                  <CardDescription>
                      {totalSubjects > 0 ? `شما ${completedSubjects.toLocaleString('fa-IR')} از ${totalSubjects.toLocaleString('fa-IR')} درس را تکمیل کرده‌اید.` : 'درسی برای این مقطع تعریف نشده است.'}
                  </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentSubjectsForLevel.map(subject => {
                      const progress = subjectProgress[subject.id] || { status: 'not-started', currentGrade: null };
                      const statusStyles = {
                          'completed': 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400',
                          'in-progress': 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400',
                          'not-started': 'border-border bg-card'
                      };
                      const statusText = {
                          'completed': 'مطالعه شده',
                          'in-progress': 'در حال مطالعه',
                          'not-started': 'شروع نشده'
                      };
                      return (
                        <Card key={subject.id} className={cn("shadow-sm hover:shadow-md transition-shadow", statusStyles[progress.status])}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-md">{subject.name}</CardTitle>
                                <CardDescription>تعداد کل فصول: {subject.totalChapters.toLocaleString('fa-IR')}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-2">
                                <Badge variant="secondary" className="text-xs">{statusText[progress.status]}</Badge>
                                {progress.currentGrade && <Badge variant="outline" className="text-xs mr-2">{progress.currentGrade}</Badge>}
                            </CardContent>
                            <CardFooter className="p-3 pt-0">
                               <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenEditDialog(subject)}>
                                    <Edit3 className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                                    ویرایش پیشرفت
                                </Button>
                            </CardFooter>
                        </Card>
                      )
                  })}
              </CardContent>
          </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
            {currentEditingSubject && (
                <>
                    <DialogHeader>
                        <DialogTitle>ویرایش پیشرفت: {currentEditingSubject.name}</DialogTitle>
                        <DialogDescription>
                            وضعیت مطالعه، نمره و یادداشت‌های خود را برای این درس به‌روز کنید.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                       <div>
                            <Label htmlFor={`status-${currentEditingSubject.id}`} className="text-xs">وضعیت مطالعه:</Label>
                            <Select
                                value={subjectProgress[currentEditingSubject.id]?.status || 'not-started'}
                                onValueChange={(value) => handleSubjectStatusChange(currentEditingSubject.id, value as SubjectProgress['status'])}
                            >
                                <SelectTrigger id={`status-${currentEditingSubject.id}`} className="mt-1">
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
                            <Label htmlFor={`grade-${currentEditingSubject.id}`} className="text-xs">نمره فعلی/توصیفی (اختیاری):</Label>
                            <Input
                            id={`grade-${currentEditingSubject.id}`}
                            value={subjectProgress[currentEditingSubject.id]?.currentGrade || ''}
                            onChange={(e) => handleGradeChange(currentEditingSubject.id, e.target.value)}
                            placeholder="مثلا: ۱۸.۵، عالی، نیاز به تلاش بیشتر"
                            className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor={`detailedNotes-${currentEditingSubject.id}`} className="text-xs">یادداشت‌های بیشتر (اختیاری):</Label>
                            <Textarea
                            id={`detailedNotes-${currentEditingSubject.id}`}
                            value={subjectProgress[currentEditingSubject.id]?.detailedNotes || ''}
                            onChange={(e) => handleDetailedNotesChange(currentEditingSubject.id, e.target.value)}
                            placeholder="نکات مهم، مباحث نیازمند مرور، سوالات و..."
                            rows={3}
                            className="mt-1"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">بستن</Button>
                        </DialogClose>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
      
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
    </>
  );
}


export default function EducationPage() {
  const sectionTitle = "تحصیل و یادگیری";
  const sectionPageDescription = "مرکز جامع مدیریت امور تحصیلی شما. مقطع تحصیلی خود را تنظیم کنید، پیشرفت در دروس را پیگیری کرده و برنامه‌های درسی (از طریق بخش ۱ - برنامه‌ریز) ایجاد نمایید.";
  
  const [educationalSettings, setEducationalSettings, settingsLoading] = useFirestore<EducationalLevelStorage>(
    'educationalLevelSettingsDeeply', 
    initialEducationalSettings
  );
  
  const [subjectProgress, setSubjectProgress, progressLoading] = useFirestore<EducationalSubjectUserProgress>(
    'educationalSubjectProgressDeeply',
    {}
  );


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
            <ClientOnly fallback={
              <div className="space-y-8">
                <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full mt-4" /></CardContent></Card>
              </div>
            }>
              <DynamicEducationContent 
                educationalSettings={educationalSettings}
                setEducationalSettings={setEducationalSettings}
                subjectProgress={subjectProgress}
                setSubjectProgress={setSubjectProgress}
                dataLoading={settingsLoading || progressLoading}
              />
            </ClientOnly>
            
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
            </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
