
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PieChart, ClipboardList, Target, FileText, Sparkles, Brain, Loader2, AlertCircle, Activity, CalendarRange, Search, Lightbulb, BarChartHorizontalBig, FileSignature, Zap } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Task, LongTermGoal, DailyActivityLogEntry, ReflectionEntry, FinancialTransaction, Budget } from '@/types';
import { format, parseISO, subDays, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { ClientOnly } from '@/components/ClientOnly';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebouncedLocalStorage } from '@/hooks/useDebouncedLocalStorage';
import { formatCurrency } from '@/lib/utils'; // Updated import

// Existing Flow
import { assessGoalProgress, type AssessGoalProgressInput, type AssessGoalProgressOutput } from '@/ai/flows/assess-goal-progress-flow';

// New Flows
import { analyzeProductivityPatterns, type AnalyzeProductivityPatternsInput, type AnalyzeProductivityPatternsOutput } from '@/ai/flows/analyze-productivity-patterns-flow';
import { suggestTaskOptimizations, type SuggestTaskOptimizationsInput, type SuggestTaskOptimizationsOutput } from '@/ai/flows/suggest-task-optimizations-flow';
import { analyzeMoodTaskCorrelation, type AnalyzeMoodTaskCorrelationInput, type AnalyzeMoodTaskCorrelationOutput } from '@/ai/flows/analyze-mood-task-correlation-flow';
import { generateOverallProgressReport, type GenerateOverallProgressReportInput, type GenerateOverallProgressReportOutput } from '@/ai/flows/generate-overall-progress-report-flow';


const MAX_PREVIEW_ITEMS = 3;

interface ActivitySummary {
  tasksCompleted: number;
  reflectionsMade: number;
  incomeTotal: number;
  expenseTotal: number;
}

const LoadingSkeleton = () => (
    <div className="space-y-2 mt-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
    </div>
);


export default function IntelligentAnalysisPage() {
  const sectionTitle = "تحلیل هوشمند و گزارش جامع";
  const sectionPageDescription = "مرکز تحلیل داده‌های برنامه شما با پیش‌نمایش از بخش‌های کلیدی، بینش‌های هوشمند و خلاصه‌های فعالیت.";
  const { toast } = useToast();

  const [tasks, setTasks] = useDebouncedLocalStorage<Task[]>('dailyTasksPlanner', []);
  const [longTermGoals, setLongTermGoals] = useDebouncedLocalStorage<LongTermGoal[]>('longTermGoals', []);
  const [activityLogs, setActivityLogs] = useDebouncedLocalStorage<DailyActivityLogEntry[]>('dailyActivityLogsDeeply', []);
  const [reflections, setReflections] = useDebouncedLocalStorage<ReflectionEntry[]>('dailyReflections', []);
  const [transactions, setTransactions] = useDebouncedLocalStorage<FinancialTransaction[]>('financialTransactions', []);
  const [budgets, setBudgets] = useDebouncedLocalStorage<Budget[]>('financialBudgets', []);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // State for Goal Assessment
  const [goalAssessment, setGoalAssessment] = useState<string | null>(null);
  const [isAssessingGoals, setIsAssessingGoals] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  // State for Productivity Patterns
  const [productivityPatterns, setProductivityPatterns] = useState<string | null>(null);
  const [isAnalyzingProductivity, setIsAnalyzingProductivity] = useState(false);
  const [productivityError, setProductivityError] = useState<string | null>(null);
  
  // State for Task Optimizations
  const [taskOptimizations, setTaskOptimizations] = useState<string | null>(null);
  const [isSuggestingOptimizations, setIsSuggestingOptimizations] = useState(false);
  const [optimizationsError, setOptimizationsError] = useState<string | null>(null);

  // State for Mood-Task Correlation
  const [moodTaskCorrelation, setMoodTaskCorrelation] = useState<string | null>(null);
  const [isAnalyzingMoodCorrelation, setIsAnalyzingMoodCorrelation] = useState(false);
  const [moodCorrelationError, setMoodCorrelationError] = useState<string | null>(null);

  // State for Overall Progress Report
  const [overallReport, setOverallReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);


  useEffect(() => {
    // Data loading from localStorage is handled by useDebouncedLocalStorage.
    // We just need to set isInitialLoadComplete to true after the first render.
    setIsInitialLoadComplete(true);
  }, []);

  const commonErrorHandler = (error: any, defaultMessage: string, toastTitle: string) => {
    console.error(`${toastTitle} Error:`, error);
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    toast({
      title: toastTitle,
      description: `متاسفانه مشکلی پیش آمد: ${errorMessage}. لطفاً از اتصال اینترنت و صحیح بودن کلید API اطمینان حاصل کنید.`,
      variant: "destructive",
      duration: 7000,
    });
    return errorMessage;
  };
  
  const handleAssessGoalProgress = useCallback(async () => {
    if (!isInitialLoadComplete || (longTermGoals.length === 0 && tasks.length === 0 && activityLogs.length === 0)) {
      toast({ title: "اطلاعات ناکافی", description: "برای تحلیل پیشرفت اهداف، حداقل باید در یکی از بخش‌های اهداف، وظایف یا فعالیت‌ها داده‌ای ثبت کرده باشید.", variant: "default" });
      return;
    }
    setIsAssessingGoals(true); setGoalAssessment(null); setAssessmentError(null);
    try {
      const input: AssessGoalProgressInput = { tasks, longTermGoals, activityLogs };
      const result = await assessGoalProgress(input);
      setGoalAssessment(result.assessment);
      toast({ title: "تحلیل پیشرفت اهداف انجام شد", description: "بینش هوش مصنوعی آماده است." });
    } catch (error) {
      setAssessmentError(commonErrorHandler(error, "خطا در تحلیل پیشرفت اهداف.", "خطای تحلیل اهداف"));
    } finally {
      setIsAssessingGoals(false);
    }
  }, [isInitialLoadComplete, tasks, longTermGoals, activityLogs, toast]);

  const handleAnalyzeProductivity = useCallback(async () => {
    if (!isInitialLoadComplete || (tasks.length === 0 && activityLogs.length === 0)) {
         toast({ title: "اطلاعات ناکافی", description: "برای تحلیل الگوهای بهره‌وری، نیاز به وظایف یا یادداشت‌های فعالیت است.", variant: "default" });
        return;
    }
    setIsAnalyzingProductivity(true); setProductivityPatterns(null); setProductivityError(null);
    try {
        const input: AnalyzeProductivityPatternsInput = { tasks, activityLogs };
        const result = await analyzeProductivityPatterns(input);
        setProductivityPatterns(result.analysis);
        toast({ title: "تحلیل بهره‌وری انجام شد" });
    } catch (error) {
        setProductivityError(commonErrorHandler(error, "خطا در تحلیل الگوهای بهره‌وری.", "خطای تحلیل بهره‌وری"));
    } finally {
        setIsAnalyzingProductivity(false);
    }
  }, [isInitialLoadComplete, tasks, activityLogs, toast]);

  const handleSuggestOptimizations = useCallback(async () => {
    if (!isInitialLoadComplete || (tasks.length === 0 && longTermGoals.length === 0)) {
         toast({ title: "اطلاعات ناکافی", description: "برای دریافت پیشنهاد تنظیم وظایف، نیاز به وظایف یا اهداف بلندمدت است.", variant: "default" });
        return;
    }
    setIsSuggestingOptimizations(true); setTaskOptimizations(null); setOptimizationsError(null);
    try {
        const input: SuggestTaskOptimizationsInput = { tasks, longTermGoals };
        const result = await suggestTaskOptimizations(input);
        setTaskOptimizations(result.suggestions);
        toast({ title: "پیشنهادات وظایف آماده شد" });
    } catch (error) {
        setOptimizationsError(commonErrorHandler(error, "خطا در ارائه پیشنهادات وظایf.", "خطای پیشنهادات وظایف"));
    } finally {
        setIsSuggestingOptimizations(false);
    }
  }, [isInitialLoadComplete, tasks, longTermGoals, toast]);

  const handleAnalyzeMoodCorrelation = useCallback(async () => {
    const recentReflections = reflections.slice(0, 20); // Take last 20 reflections
    if (!isInitialLoadComplete || recentReflections.length === 0 || tasks.length === 0) {
         toast({ title: "اطلاعات ناکافی", description: "برای تحلیل ارتباط خلق و خو با وظایف، نیاز به تأملات و وظایف ثبت شده است.", variant: "default" });
        return;
    }
    setIsAnalyzingMoodCorrelation(true); setMoodTaskCorrelation(null); setMoodCorrelationError(null);
    try {
        const input: AnalyzeMoodTaskCorrelationInput = { reflections: recentReflections, tasks };
        const result = await analyzeMoodTaskCorrelation(input);
        setMoodTaskCorrelation(result.analysis);
        toast({ title: "تحلیل ارتباط خلق و خو با وظایف انجام شد" });
    } catch (error) {
        setMoodCorrelationError(commonErrorHandler(error, "خطا در تحلیل ارتباط خلق و خو.", "خطای تحلیل خلق و خو"));
    } finally {
        setIsAnalyzingMoodCorrelation(false);
    }
  }, [isInitialLoadComplete, reflections, tasks, toast]);
  
  const handleGenerateOverallReport = useCallback(async () => {
    if (!isInitialLoadComplete) {
        toast({ title: "داده‌ها در حال بارگذاری", description: "لطفاً کمی صبر کنید تا اطلاعات اولیه بارگذاری شوند.", variant: "default" });
        return;
    }
     if (tasks.length === 0 && longTermGoals.length === 0 && activityLogs.length === 0 && reflections.length === 0) {
      toast({ title: "اطلاعات بسیار کم", description: "برای تهیه گزارش جامع، حداقل در یکی از بخش‌های اصلی برنامه داده ثبت کنید.", variant: "default" });
      return;
    }
    setIsGeneratingReport(true); setOverallReport(null); setReportError(null);
    try {
        // Prepare financial summary
        const now = new Date();
        const last30DaysStart = subDays(now, 30);
        const periodTransactions = transactions.filter(t => isWithinInterval(parseISO(t.date), { start: last30DaysStart, end: now }));
        const totalIncome = periodTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = periodTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        
        const input: GenerateOverallProgressReportInput = {
            tasks,
            longTermGoals,
            activityLogs,
            reflections: reflections.slice(0, 10), // Limit for report
            financialSummary: {
                totalIncomeLast30Days: totalIncome,
                totalExpensesLast30Days: totalExpenses,
                activeBudgetsCount: budgets.length,
                savingsGoalsProgress: 0, // Placeholder for now
            }
        };
        const result = await generateOverallProgressReport(input);
        setOverallReport(result.report);
        toast({ title: "گزارش جامع آماده شد" });
    } catch (error) {
        setReportError(commonErrorHandler(error, "خطا در تهیه گزارش جامع.", "خطای گزارش جامع"));
    } finally {
        setIsGeneratingReport(false);
    }
  }, [isInitialLoadComplete, tasks, longTermGoals, activityLogs, reflections, transactions, budgets, toast]);


  const calculateActivitySummary = useCallback((days: number): ActivitySummary => {
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);

    const tasksCompleted = tasks.filter(task =>
        task.completed && task.createdAt && isWithinInterval(parseISO(task.createdAt), { start: startDate, end: endDate })
    ).length;

    const reflectionsMade = reflections.filter(reflection =>
        reflection.date && isWithinInterval(parseISO(reflection.date), { start: startDate, end: endDate })
    ).length;

    const periodTransactions = transactions.filter(transaction =>
        transaction.date && isWithinInterval(parseISO(transaction.date), { start: startDate, end: endDate })
    );
    const incomeTotal = periodTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenseTotal = periodTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return { tasksCompleted, reflectionsMade, incomeTotal, expenseTotal };
  }, [tasks, reflections, transactions]);


  const weeklySummary = useMemo(() => isInitialLoadComplete ? calculateActivitySummary(7) : null, [isInitialLoadComplete, calculateActivitySummary]);
  const monthlySummary = useMemo(() => isInitialLoadComplete ? calculateActivitySummary(30) : null, [isInitialLoadComplete, calculateActivitySummary]);


  const upcomingTasks = useMemo(() => tasks
    .filter(task => !task.completed)
    .sort((a, b) => (a.dueDate && b.dueDate ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() : a.dueDate ? -1 : b.dueDate ? 1 : 0))
    .slice(0, MAX_PREVIEW_ITEMS), [tasks]);

  const activeGoals = useMemo(() => longTermGoals
    .filter(goal => goal.status === 'in-progress' || goal.status === 'not-started')
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, MAX_PREVIEW_ITEMS), [longTermGoals]);

  const recentLogs = useMemo(() => activityLogs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, MAX_PREVIEW_ITEMS), [activityLogs]);

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'زیاد';
      case 'medium': return 'متوسط';
      case 'low': return 'کم';
      default: return '';
    }
  };

  const getGoalStatusText = (status: LongTermGoal['status']) => {
    switch (status) {
      case 'not-started': return 'شروع نشده';
      case 'in-progress': return 'در حال انجام';
      case 'completed': return 'تکمیل شده';
      case 'on-hold': return 'متوقف شده';
      default: return '';
    }
  };

  const renderAnalysisSection = (
    title: string,
    description: string,
    Icon: React.ElementType,
    analysisResult: string | null,
    isLoading: boolean,
    error: string | null,
    onGenerate: () => void,
    buttonText: string = "دریافت تحلیل"
  ) => (
    <Card className="bg-primary/5">
      <CardHeader>
        <div className="flex items-center">
          <Icon className="mr-3 h-6 w-6 text-primary rtl:ml-3 rtl:mr-0" />
          <CardTitle className="text-xl text-primary">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground pt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onGenerate} disabled={isLoading || !isInitialLoadComplete} className="w-full sm:w-auto">
          {isLoading ? (
            <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> در حال پردازش... </>
          ) : (
            <> <Sparkles className="mr-2 h-4 w-4" /> {buttonText} </>
          )}
        </Button>
        {isLoading && <p className="text-sm text-muted-foreground mt-4 text-center">هوش مصنوعی در حال تحلیل داده‌های شماست...</p>}
        {error && (
          <div className="mt-4 p-3 border border-destructive/50 rounded-md bg-destructive/10 text-destructive flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0 flex-shrink-0" /> <p className="text-sm">{error}</p>
          </div>
        )}
        {analysisResult && !isLoading && (
          <div className="mt-6 p-4 border rounded-lg bg-background shadow">
            <h4 className="text-lg font-semibold text-primary mb-2">نتیجه تحلیل:</h4>
            <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{analysisResult}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );


  return (
    <ClientOnly fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <PieChart className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-primary">{sectionTitle}</h1>
            </div>
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                    بازگشت به خانه
                </Link>
            </Button>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
            {sectionPageDescription}
        </p>

        <div className="space-y-8">
            {renderAnalysisSection(
                "تحلیل هوشمند پیشرفت اهداف",
                "با استفاده از هوش مصنوعی، میزان همسویی و پیشرفت خود به سمت اهداف بلندمدت را ارزیابی کنید.",
                Brain,
                goalAssessment,
                isAssessingGoals,
                assessmentError,
                handleAssessGoalProgress
            )}

            {renderAnalysisSection(
                "شناسایی الگوهای بهره‌وری",
                "الگوهای زمانی و فعالیتی خود را برای شناسایی اوج بهره‌وری و عوامل موثر بر آن تحلیل کنید.",
                Zap, // Changed Icon
                productivityPatterns,
                isAnalyzingProductivity,
                productivityError,
                handleAnalyzeProductivity,
                "شروع تحلیل بهره‌وری"
            )}

            {renderAnalysisSection(
                "پیشنهاد برای تنظیم بهتر وظایف",
                "بر اساس اهداف و وظایف فعلی، پیشنهاداتی برای بهینه‌سازی برنامه‌ریزی روزانه خود دریافت کنید.",
                Lightbulb, // Changed Icon
                taskOptimizations,
                isSuggestingOptimizations,
                optimizationsError,
                handleSuggestOptimizations,
                "دریافت پیشنهادات وظایف"
            )}
            
            {renderAnalysisSection(
                "تحلیل ارتباط خلق و خو و پیشرفت",
                "ارتباط بین حالات روحی ثبت شده در تأملات و میزان پیشرفت در وظایف و اهداف را بررسی کنید.",
                BarChartHorizontalBig, // Changed Icon
                moodTaskCorrelation,
                isAnalyzingMoodCorrelation,
                moodCorrelationError,
                handleAnalyzeMoodCorrelation,
                "تحلیل ارتباط خلق و خو"
            )}

            {renderAnalysisSection(
                "گزارش جامع پیشرفت کلی",
                "یک گزارش دوره‌ای از پیشرفت خود در تمامی جنبه‌های برنامه (وظایف، اهداف، فعالیت‌ها، تأملات و مالی) دریافت کنید.",
                FileSignature, // Changed Icon
                overallReport,
                isGeneratingReport,
                reportError,
                handleGenerateOverallReport,
                "تهیه گزارش جامع"
            )}

            <Separator />

            <Card className="bg-secondary/30">
                <CardHeader>
                    <div className="flex items-center">
                        <Activity className="mr-3 h-6 w-6 text-primary rtl:ml-3 rtl:mr-0" />
                        <CardTitle className="text-xl text-primary">خلاصه فعالیت</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground pt-1">نگاهی کلی به فعالیت‌های شما در بازه‌های زمانی اخیر.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!isInitialLoadComplete ? (
                         <div className="flex items-center justify-center p-6">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> در حال بارگذاری خلاصه فعالیت...
                        </div>
                    ) : (
                        <>
                            {weeklySummary && (
                                <div className="p-4 border rounded-md bg-card shadow-sm">
                                    <h4 className="text-md font-semibold text-foreground mb-2 flex items-center"><CalendarRange className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-primary/80"/> هفته گذشته (۷ روز اخیر)</h4>
                                    <ul className="space-y-1 text-sm">
                                        <li>وظایف انجام شده: <span className="font-semibold">{weeklySummary.tasksCompleted.toLocaleString('fa-IR')}</span> مورد</li>
                                        <li>تأملات ثبت شده: <span className="font-semibold">{weeklySummary.reflectionsMade.toLocaleString('fa-IR')}</span> مورد</li>
                                        <li>مجموع درآمد: <span className="font-semibold text-green-600">{formatCurrency(weeklySummary.incomeTotal)}</span></li>
                                        <li>مجموع هزینه: <span className="font-semibold text-red-600">{formatCurrency(weeklySummary.expenseTotal)}</span></li>
                                    </ul>
                                </div>
                            )}
                            {monthlySummary && (
                                <div className="p-4 border rounded-md bg-card shadow-sm">
                                    <h4 className="text-md font-semibold text-foreground mb-2 flex items-center"><CalendarRange className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-primary/80"/> ماه گذشته (۳۰ روز اخیر)</h4>
                                    <ul className="space-y-1 text-sm">
                                        <li>وظایف انجام شده: <span className="font-semibold">{monthlySummary.tasksCompleted.toLocaleString('fa-IR')}</span> مورد</li>
                                        <li>تأملات ثبت شده: <span className="font-semibold">{monthlySummary.reflectionsMade.toLocaleString('fa-IR')}</span> مورد</li>
                                        <li>مجموع درآمد: <span className="font-semibold text-green-600">{formatCurrency(monthlySummary.incomeTotal)}</span></li>
                                        <li>مجموع هزینه: <span className="font-semibold text-red-600">{formatCurrency(monthlySummary.expenseTotal)}</span></li>
                                    </ul>
                                </div>
                            )}
                            {(tasks.length === 0 && reflections.length === 0 && transactions.length === 0) && (
                                <p className="text-muted-foreground text-center py-4">داده‌ای برای نمایش خلاصه فعالیت وجود ندارد.</p>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            <Separator />

            <Card className="bg-secondary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ClipboardList className="mr-3 h-6 w-6 text-primary rtl:ml-3 rtl:mr-0" />
                        <CardTitle className="text-xl text-primary">پیش‌نمایش برنامه‌ریز روزانه</CardTitle>
                    </div>
                    <Button asChild variant="link" size="sm">
                        <Link href="/section/1">مشاهده کامل <ArrowLeft className="mr-1 h-3 w-3 rtl:ml-1 rtl:mr-0"/></Link>
                    </Button>
                </div>
                <CardDescription className="text-sm text-muted-foreground pt-1">چند وظیفه مهم یا آتی شما.</CardDescription>
              </CardHeader>
              <CardContent>
                {!isInitialLoadComplete ? <LoadingSkeleton/> : upcomingTasks.length > 0 ? (
                  <ul className="space-y-3">
                    {upcomingTasks.map(task => (
                      <li key={task.id} className="p-3 border rounded-md bg-card shadow-sm">
                        <p className="font-semibold text-foreground">{task.title}</p>
                        {task.dueDate && <p className="text-xs text-muted-foreground">سررسید: {format(parseISO(task.dueDate), "PPP", { locale: faIR })}</p>}
                        {task.priority && <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs mt-1">{getPriorityText(task.priority)}</Badge>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-center py-4">وظیفه آتی یا انجام نشده‌ای برای نمایش وجود ندارد.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-secondary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Target className="mr-3 h-6 w-6 text-primary rtl:ml-3 rtl:mr-0" />
                        <CardTitle className="text-xl text-primary">پیش‌نمایش اهداف</CardTitle>
                    </div>
                    <Button asChild variant="link" size="sm">
                        <Link href="/section/9">مشاهده کامل <ArrowLeft className="mr-1 h-3 w-3 rtl:ml-1 rtl:mr-0"/></Link>
                    </Button>
                </div>
                <CardDescription className="text-sm text-muted-foreground pt-1">چند هدف فعال شما.</CardDescription>
              </CardHeader>
              <CardContent>
                 {!isInitialLoadComplete ? <LoadingSkeleton/> : activeGoals.length > 0 ? (
                  <ul className="space-y-3">
                    {activeGoals.map(goal => (
                      <li key={goal.id} className="p-3 border rounded-md bg-card shadow-sm">
                        <p className="font-semibold text-foreground">{goal.title}</p>
                        {goal.targetDate && <p className="text-xs text-muted-foreground">تاریخ هدف: {format(parseISO(goal.targetDate), "PPP", { locale: faIR })}</p>}
                        <Badge variant={goal.status === 'completed' ? 'default' : goal.status === 'in-progress' ? 'secondary' : 'outline'} className="text-xs mt-1">{getGoalStatusText(goal.status)}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-center py-4">هدف فعالی برای نمایش وجود ندارد.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-secondary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FileText className="mr-3 h-6 w-6 text-primary rtl:ml-3 rtl:mr-0" />
                        <CardTitle className="text-xl text-primary">پیش‌نمایش یادداشت فعالیت روزانه</CardTitle>
                    </div>
                    <Button asChild variant="link" size="sm">
                        <Link href="/section/8">مشاهده کامل <ArrowLeft className="mr-1 h-3 w-3 rtl:ml-1 rtl:mr-0"/></Link>
                    </Button>
                </div>
                <CardDescription className="text-sm text-muted-foreground pt-1">آخرین فعالیت‌های ثبت شده شما.</CardDescription>
              </CardHeader>
              <CardContent>
                 {!isInitialLoadComplete ? <LoadingSkeleton/> : recentLogs.length > 0 ? (
                  <ScrollArea className="h-[150px] pr-3 rtl:pl-3">
                    <ul className="space-y-2">
                      {recentLogs.map(log => (
                        <li key={log.id} className="p-2 border rounded-md bg-card shadow-sm text-sm">
                          <p className="text-foreground truncate">{log.text}</p>
                          <p className="text-xs text-muted-foreground">{format(parseISO(log.date), "HH:mm - PPP", { locale: faIR })}</p>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                ) : (
                  <p className="text-muted-foreground text-center py-4">فعالیت ثبت شده‌ای برای نمایش وجود ندارد.</p>
                )}
              </CardContent>
            </Card>

          </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
    </ClientOnly>
  );
}
