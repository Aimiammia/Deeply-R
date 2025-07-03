
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardList, Target, Loader2, Timer, ListChecks } from 'lucide-react';
import Image from 'next/image';

// Imports for Short-Term Planner
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, Project } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { getDailySuccessQuote } from '@/lib/prompts';
import { DailyPromptDisplay } from '@/components/DailyPromptDisplay';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { generateId } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientOnly } from '@/components/ClientOnly';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isSameDay, isAfter, isBefore, startOfDay, parseISO } from 'date-fns';

const DynamicCreateTaskForm = dynamic(() => import('@/components/tasks/CreateTaskForm').then(mod => mod.CreateTaskForm), {
  loading: () => <Skeleton className="h-48 w-full" />,
  ssr: false
});
const DynamicTaskList = dynamic(() => import('@/components/tasks/TaskList').then(mod => mod.TaskList), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false
});
const DynamicPomodoroTimer = dynamic(() => import('@/components/tasks/PomodoroTimer').then(mod => mod.PomodoroTimer), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false
});

type TaskFilter = 'all' | 'today' | 'upcoming' | 'overdue' | 'completed';

export default function PlannerLandingPage() {
  const sectionTitle = "برنامه‌ریز";
  const sectionPageDescription = "برنامه‌های کوتاه مدت و وظایف روزانه خود را اینجا مدیریت کنید.";

  const { toast } = useToast();
  const [currentSuccessQuote, setCurrentSuccessQuote] = useState<string>("در حال بارگذاری نقل قول روز...");
  
  const [tasks, setTasks, tasksLoading] = useLocalStorageState<Task[]>('dailyTasksPlanner', []);
  const [projects, , projectsLoading] = useLocalStorageState<Project[]>('allProjects', []);

  useEffect(() => {
    setCurrentSuccessQuote(getDailySuccessQuote());
  }, []);

  const handleAddTask = useCallback((
    title: string,
    dueDate?: Date | null,
    dueTime?: string | null,
    priority?: Task['priority'],
    category?: string | null,
    projectId?: string | null,
    projectName?: string | null,
    subjectId?: string | null,
    subjectName?: string | null,
    startChapter?: number | null,
    endChapter?: number | null,
    educationalLevelContext?: string | null,
    estimatedMinutes?: number | null
  ) => {
    const newTask: Task = {
      id: generateId(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate ? dueDate.toISOString() : null,
      dueTime: dueTime || null,
      priority: priority || null,
      category: category || null,
      projectId: projectId || null,
      projectName: projectName || null,
      subjectId: subjectId || null,
      subjectName: subjectName || null,
      startChapter: startChapter || null,
      endChapter: endChapter || null,
      educationalLevelContext: educationalLevelContext || null,
      estimatedMinutes: estimatedMinutes || null,
      pomodorosCompleted: 0,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);

    if (estimatedMinutes && estimatedMinutes > 0) {
        const pomodorosNeeded = Math.ceil(estimatedMinutes / 25);
        toast({
            title: "وظیفه با تخمین زمان ثبت شد",
            description: `این وظیفه به حدود ${pomodorosNeeded.toLocaleString('fa-IR')} جلسه پومودورو نیاز دارد.`,
        });
    } else {
        toast({
            title: "کار اضافه شد",
            description: `"${title}" با موفقیت به برنامه شما اضافه شد.`,
            variant: "default",
        });
    }
  }, [setTasks, toast]);

  const handleToggleComplete = useCallback((id: string) => {
    let taskTitle = "";
    let isCompleted = false;
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          taskTitle = task.title;
          isCompleted = !task.completed;
          return { ...task, completed: isCompleted, completedAt: isCompleted ? new Date().toISOString() : null };
        }
        return task;
      })
    );
    toast({
      title: isCompleted ? "وظیفه انجام شد" : "وظیفه باز شد",
      description: `"${taskTitle}" ${isCompleted ? 'با موفقیت انجام شد.' : 'مجدداً باز شد.'}`,
      variant: "default",
    });
  }, [setTasks, toast]);

  const handleDeleteTask = useCallback((id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    if (taskToDelete) {
      toast({
        title: "کار حذف شد",
        description: `"${taskToDelete.title}" از برنامه شما حذف شد.`,
        variant: "destructive",
      });
    }
  }, [tasks, setTasks, toast]);

  const handleEditTask = useCallback((id: string, newTitle: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
     toast({
      title: "کار ویرایش شد",
      description: `عنوان کار با موفقیت به "${newTitle}" تغییر یافت.`,
    });
  }, [setTasks, toast]);

  const handlePomodoroComplete = useCallback((taskId: string) => {
    let taskTitle = "";
    setTasks(prevTasks =>
        prevTasks.map(task => {
            if (task.id === taskId) {
                taskTitle = task.title;
                return {
                    ...task,
                    pomodorosCompleted: (task.pomodorosCompleted || 0) + 1,
                };
            }
            return task;
        })
    );
    toast({
        title: "یک پومودورو تکمیل شد!",
        description: `یک جلسه پومودورو برای وظیفه "${taskTitle}" ثبت شد.`,
        variant: "default",
    });
  }, [setTasks, toast]);
  
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');

  const filteredTasks = useMemo(() => {
    const today = startOfDay(new Date());

    if (taskFilter === 'completed') {
        return tasks
            .filter(t => t.completed)
            .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    }

    const incompleteTasks = tasks.filter(t => !t.completed);

    switch (taskFilter) {
        case 'today':
            return incompleteTasks
                .filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), today));
        case 'upcoming':
            return incompleteTasks
                .filter(t => t.dueDate && isAfter(parseISO(t.dueDate), today))
                .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
        case 'overdue':
            return incompleteTasks
                .filter(t => t.dueDate && isBefore(parseISO(t.dueDate), today))
                .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
        case 'all':
        default:
            return incompleteTasks
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [tasks, taskFilter]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <ClipboardList className="h-8 w-8 text-primary" />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                 <Card className="shadow-lg bg-card">
                    <CardContent className="p-6">
                        <div className="p-4 rounded-xl border bg-primary/10 shadow-sm mb-6">
                            <DailyPromptDisplay prompt={currentSuccessQuote} />
                        </div>
                        <ClientOnly fallback={
                            <div className="space-y-4">
                                <Skeleton className="h-32 w-full" />
                                <Skeleton className="h-48 w-full" />
                            </div>
                        }>
                            {projectsLoading ? (
                                <Skeleton className="h-48 w-full" />
                            ) : (
                                <DynamicCreateTaskForm onAddTask={handleAddTask} projects={projects} />
                            )}
                            
                            <div className="mt-6">
                                <Tabs value={taskFilter} onValueChange={(value) => setTaskFilter(value as TaskFilter)} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
                                        <TabsTrigger value="all">همه فعال</TabsTrigger>
                                        <TabsTrigger value="today">امروز</TabsTrigger>
                                        <TabsTrigger value="upcoming">آینده</TabsTrigger>
                                        <TabsTrigger value="overdue">گذشته</TabsTrigger>
                                        <TabsTrigger value="completed">تکمیل‌شده</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                <div className="mt-4">
                                    {tasksLoading ? (
                                        <Skeleton className="h-64 w-full" />
                                    ) : (
                                        <>
                                            {filteredTasks.length > 0 ? (
                                                <DynamicTaskList
                                                    tasks={filteredTasks}
                                                    onToggleComplete={handleToggleComplete}
                                                    onDeleteTask={handleDeleteTask}
                                                    onEditTask={handleEditTask}
                                                />
                                            ) : (
                                                <div className="text-center py-10 text-muted-foreground border rounded-lg bg-muted/50 mt-4">
                                                    <ListChecks className="mx-auto h-12 w-12 mb-4 text-primary" />
                                                    <p className="text-lg font-semibold">
                                                        {tasks.length === 0 ? 'هنوز وظیفه‌ای اضافه نشده است' : 'هیچ وظیفه‌ای با فیلتر فعلی مطابقت ندارد'}
                                                    </p>
                                                    {tasks.length === 0 && <p className="text-sm mt-1">اولین وظیفه خود را از طریق فرم بالا اضافه کنید!</p>}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </ClientOnly>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1 space-y-6">
                <ClientOnly fallback={<Skeleton className="h-64 w-full" />}>
                    <DynamicPomodoroTimer 
                        tasks={tasks}
                        onPomodoroComplete={handlePomodoroComplete}
                    />
                </ClientOnly>
                 <Card className="shadow-lg bg-card/70 border-primary/20 hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center text-primary">
                            <Target className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
                            اهداف بلندمدت
                        </CardTitle>
                        <CardDescription>
                            اهداف بزرگ و برنامه‌های آینده خود را تعریف و پیگیری کنید.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                           برای مدیریت اهداف بلندمدت، نقاط عطف و معیارهای موفقیت، به صفحه اختصاصی اهداف بروید.
                        </p>
                        <Button asChild size="sm" className="w-full">
                            <Link href="/section/9">
                                <Target className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                مدیریت اهداف
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
