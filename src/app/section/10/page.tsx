
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PieChart, ClipboardList, Target, FileText, Sparkles, Brain, Loader2, AlertCircle, Activity, CalendarRange } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react'; // Added useCallback
import type { Task, LongTermGoal, DailyActivityLogEntry, ReflectionEntry, FinancialTransaction } from '@/types'; 
import { format, parseISO, subDays, isWithinInterval } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { assessGoalProgress, type AssessGoalProgressInput, type AssessGoalProgressOutput } from '@/ai/flows/assess-goal-progress-flow';
import { Separator } from '@/components/ui/separator';
import { ClientOnly } from '@/components/ClientOnly';

const MAX_PREVIEW_ITEMS = 3;

interface ActivitySummary {
  tasksCompleted: number;
  reflectionsMade: number;
  incomeTotal: number;
  expenseTotal: number;
}

export default function IntelligentAnalysisPage() {
  const sectionTitle = "تحلیل هوشمند و گزارش جامع";
  const sectionPageDescription = "مرکز تحلیل داده‌های برنامه شما با پیش‌نمایش از بخش‌های کلیدی، بینش‌های هوشمند و خلاصه‌های فعالیت.";
  const { toast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [longTermGoals, setLongTermGoals] = useState<LongTermGoal[]>([]);
  const [activityLogs, setActivityLogs] = useState<DailyActivityLogEntry[]>([]);
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]); 
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]); 
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const [goalAssessment, setGoalAssessment] = useState<string | null>(null);
  const [isAssessingGoals, setIsAssessingGoals] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('dailyTasksPlanner');
      if (storedTasks) setTasks(JSON.parse(storedTasks));

      const storedGoals = localStorage.getItem('longTermGoals');
      if (storedGoals) setLongTermGoals(JSON.parse(storedGoals));

      const storedLogs = localStorage.getItem('dailyActivityLogsDeeply');
      if (storedLogs) setActivityLogs(JSON.parse(storedLogs));
      
      const storedReflections = localStorage.getItem('dailyReflections'); 
      if (storedReflections) setReflections(JSON.parse(storedReflections));

      const storedTransactions = localStorage.getItem('financialTransactions'); 
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));

    } catch (error) {
      console.error("Failed to parse data from localStorage for Section 10", error);
      toast({ title: "خطا در بارگذاری داده", description: "برخی از داده‌ها از حافظه محلی به درستی بارگذاری نشدند.", variant: "destructive" });
    }
    setIsInitialLoadComplete(true);
  }, [toast]);

  const handleAssessGoalProgress = useCallback(async () => {
    if (!isInitialLoadComplete) {
      toast({ title: "خطا", description: "داده‌ها هنوز به طور کامل بارگذاری نشده‌اند.", variant: "destructive" });
      return;
    }
    if (longTermGoals.length === 0 && tasks.length === 0 && activityLogs.length === 0) {
      toast({ title: "اطلاعات ناکافی", description: "برای تحلیل، حداقل باید در یکی از بخش‌های اهداف، وظایف یا فعالیت‌ها داده‌ای ثبت کرده باشید.", variant: "default" });
      return;
    }

    setIsAssessingGoals(true);
    setGoalAssessment(null);
    setAssessmentError(null);

    try {
      const input: AssessGoalProgressInput = {
        tasks: tasks,
        longTermGoals: longTermGoals,
        activityLogs: activityLogs,
      };
      const result = await assessGoalProgress(input);
      setGoalAssessment(result.assessment);
      toast({ title: "تحلیل انجام شد", description: "بینش هوش مصنوعی در مورد پیشرفت اهداف شما آماده است." });
    } catch (error) {
      console.error("Error assessing goal progress:", error);
      const errorMessage = error instanceof Error ? error.message : "یک خطای ناشناخته در ارتباط با سرویس هوش مصنوعی رخ داد.";
      setAssessmentError(`خطا در تحلیل پیشرفت اهداف: ${errorMessage}`);
      toast({
        title: "خطا در تحلیل",
        description: "متاسفانه در هنگام تحلیل پیشرفت اهداف شما مشکلی پیش آمد. لطفاً از اتصال اینترنت خود و صحیح بودن کلید API اطمینان حاصل کنید.",
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setIsAssessingGoals(false);
    }
  }, [isInitialLoadComplete, longTermGoals, tasks, activityLogs, toast]);

  const calculateActivitySummary = useCallback((days: number): ActivitySummary => {
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1); 
    
    const tasksCompleted = tasks.filter(task => 
        task.completed && isWithinInterval(parseISO(task.createdAt), { start: startDate, end: endDate })
    ).length;

    const reflectionsMade = reflections.filter(reflection =>
        isWithinInterval(parseISO(reflection.date), { start: startDate, end: endDate })
    ).length;
    
    const periodTransactions = transactions.filter(transaction => 
        isWithinInterval(parseISO(transaction.date), {start: startDate, end: endDate})
    );
    const incomeTotal = periodTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenseTotal = periodTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return { tasksCompleted, reflectionsMade, incomeTotal, expenseTotal };
  }, [tasks, reflections, transactions]);

  const weeklySummary = useMemo(() => isInitialLoadComplete ? calculateActivitySummary(7) : null, [isInitialLoadComplete, calculateActivitySummary]);
  const monthlySummary = useMemo(() => isInitialLoadComplete ? calculateActivitySummary(30) : null, [isInitialLoadComplete, calculateActivitySummary]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
  };

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

  return (
    <ClientOnly fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
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
            <PieChart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">{sectionTitle}</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {sectionPageDescription}
          </p>
        </div>

        <Card className="shadow-lg bg-card">
          <CardContent className="p-6 space-y-8">
            
            <Card className="bg-primary/10">
              <CardHeader>
                <div className="flex items-center">
                    <Brain className="mr-3 h-6 w-6 text-primary rtl:ml-3 rtl:mr-0" />
                    <CardTitle className="text-xl text-primary">تحلیل هوشمند پیشرفت اهداف</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground pt-1">با استفاده از هوش مصنوعی، میزان همسویی و پیشرفت خود به سمت اهداف بلندمدت را ارزیابی کنید.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleAssessGoalProgress} disabled={isAssessingGoals || !isInitialLoadComplete} className="w-full sm:w-auto">
                  {isAssessingGoals ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      در حال تحلیل...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      دریافت تحلیل پیشرفت با هوش مصنوعی
                    </>
                  )}
                </Button>

                {isAssessingGoals && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">درحال پردازش اطلاعات و تولید تحلیل توسط هوش مصنوعی. این فرآیند ممکن است چند لحظه طول بکشد...</p>
                )}

                {assessmentError && (
                  <div className="mt-4 p-3 border border-destructive/50 rounded-md bg-destructive/10 text-destructive flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0 flex-shrink-0" />
                    <p className="text-sm">{assessmentError}</p>
                  </div>
                )}

                {goalAssessment && !isAssessingGoals && (
                  <div className="mt-6 p-4 border rounded-lg bg-background shadow">
                    <h4 className="text-lg font-semibold text-primary mb-2">نتیجه تحلیل هوش مصنوعی:</h4>
                    <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{goalAssessment}</p>
                  </div>
                )}
              </CardContent>
            </Card>

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
                    {isInitialLoadComplete ? (
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
                    ) : (
                         <div className="flex items-center justify-center p-6">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> در حال بارگذاری خلاصه فعالیت...
                        </div>
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
                {isInitialLoadComplete && upcomingTasks.length > 0 ? (
                  <ul className="space-y-3">
                    {upcomingTasks.map(task => (
                      <li key={task.id} className="p-3 border rounded-md bg-card shadow-sm">
                        <p className="font-semibold text-foreground">{task.title}</p>
                        {task.dueDate && <p className="text-xs text-muted-foreground">سررسید: {format(parseISO(task.dueDate), "PPP", { locale: faIR })}</p>}
                        {task.priority && <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs mt-1">{getPriorityText(task.priority)}</Badge>}
                      </li>
                    ))}
                  </ul>
                ) : isInitialLoadComplete ? (
                  <p className="text-muted-foreground text-center py-4">وظیفه آتی یا انجام نشده‌ای برای نمایش وجود ندارد.</p>
                ) : (
                  <p className="text-muted-foreground text-center py-4">در حال بارگذاری پیش‌نمایش وظایف...</p>
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
                {isInitialLoadComplete && activeGoals.length > 0 ? (
                  <ul className="space-y-3">
                    {activeGoals.map(goal => (
                      <li key={goal.id} className="p-3 border rounded-md bg-card shadow-sm">
                        <p className="font-semibold text-foreground">{goal.title}</p>
                        {goal.targetDate && <p className="text-xs text-muted-foreground">تاریخ هدف: {format(parseISO(goal.targetDate), "PPP", { locale: faIR })}</p>}
                        <Badge variant={goal.status === 'completed' ? 'default' : goal.status === 'in-progress' ? 'secondary' : 'outline'} className="text-xs mt-1">{getGoalStatusText(goal.status)}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : isInitialLoadComplete ? (
                  <p className="text-muted-foreground text-center py-4">هدف فعالی برای نمایش وجود ندارد.</p>
                ) : (
                  <p className="text-muted-foreground text-center py-4">در حال بارگذاری پیش‌نمایش اهداف...</p>
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
                {isInitialLoadComplete && recentLogs.length > 0 ? (
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
                ) : isInitialLoadComplete ? (
                  <p className="text-muted-foreground text-center py-4">فعالیت ثبت شده‌ای برای نمایش وجود ندارد.</p>
                ) : (
                  <p className="text-muted-foreground text-center py-4">در حال بارگذاری پیش‌نمایش فعالیت‌ها...</p>
                )}
              </CardContent>
            </Card>

            <div className="mt-12 p-6 border rounded-lg bg-primary/5 shadow-inner">
              <h3 className="text-xl font-semibold text-primary mb-3 text-center">سایر بینش‌های هوشمند (آینده)</h3>
              <p className="text-muted-foreground text-center mb-4">
                در آینده، این بخش می‌تواند تحلیل‌های هوش مصنوعی بیشتری ارائه دهد، مانند:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-foreground/90 max-w-xl mx-auto">
                <li>شناسایی الگوهای بهره‌وری بر اساس وظایف انجام شده و فعالیت‌های روزانه.</li>
                <li>پیشنهاد برای تنظیم بهتر وظایف روزانه برای دستیابی به اهداف.</li>
                <li>تحلیل ارتباط بین خلق و خو (از بخش تاملات) و پیشرفت در وظایف/اهداف.</li>
                <li>ارائه گزارشات دوره‌ای از پیشرفت کلی شما در تمام جنبه‌های برنامه.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
    </ClientOnly>
  );
}
