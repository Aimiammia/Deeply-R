
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardList, Target, ChevronLeftSquare } from 'lucide-react'; // Changed ChevronLeftSquare
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';

// Imports for Short-Term Planner
import { useState, useEffect } from 'react';
import type { Task } from '@/types';
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { useToast } from "@/hooks/use-toast";
import { getDailySuccessQuote } from '@/lib/prompts';
import { DailyPromptDisplay } from '@/components/DailyPromptDisplay';

export default function PlannerLandingPage() {
  const sectionTitle = "برنامه‌ریز";
  const sectionPageDescription = "برنامه‌های کوتاه مدت و اهداف بلند مدت خود را مدیریت کنید.";

  // State and logic for Short-Term Planner
  const { toast } = useToast();
  const [currentSuccessQuote, setCurrentSuccessQuote] = useState<string>("در حال بارگذاری نقل قول روز...");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  useEffect(() => {
    setCurrentSuccessQuote(getDailySuccessQuote());
  }, []);

  // Load tasks from localStorage on initial mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('dailyTasksPlanner');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
      localStorage.removeItem('dailyTasksPlanner'); // Clear corrupted data
    }
    setIsInitialLoadComplete(true);
  }, []);

  // Save tasks to localStorage whenever they change, but only after initial load
  useEffect(() => {
    if (isInitialLoadComplete) {
      localStorage.setItem('dailyTasksPlanner', JSON.stringify(tasks));
    }
  }, [tasks, isInitialLoadComplete]);

  const handleAddTask = (
    title: string, 
    dueDate?: Date | null, 
    priority?: Task['priority'], 
    category?: string | null,
    subjectId?: string | null,
    subjectName?: string | null,
    startChapter?: number | null,
    endChapter?: number | null,
    educationalLevelContext?: string | null
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate ? dueDate.toISOString() : null,
      priority: priority || null,
      category: category || null,
      subjectId: subjectId || null,
      subjectName: subjectName || null,
      startChapter: startChapter || null,
      endChapter: endChapter || null,
      educationalLevelContext: educationalLevelContext || null,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    toast({
      title: "کار اضافه شد",
      description: `"${title}" با موفقیت به برنامه شما اضافه شد.`,
      variant: "default",
    });
  };

  const handleToggleComplete = (id: string) => {
    let taskTitle = "";
    let isCompleted = false;
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          taskTitle = task.title;
          isCompleted = !task.completed;
          return { ...task, completed: isCompleted };
        }
        return task;
      })
    );
    toast({
      title: isCompleted ? "وظیفه انجام شد" : "وظیفه باز شد",
      description: `"${taskTitle}" ${isCompleted ? 'با موفقیت انجام شد.' : 'مجدداً باز شد.'}`,
      variant: "default",
    });
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    if (taskToDelete) {
      toast({
        title: "کار حذف شد",
        description: `"${taskToDelete.title}" از برنامه شما حذف شد.`,
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (id: string, newTitle: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
     toast({
      title: "کار ویرایش شد",
      description: `عنوان کار با موفقیت به "${newTitle}" تغییر یافت.`,
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
            <CardTitle className="text-2xl font-headline text-primary">
              {sectionTitle}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {sectionPageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="short-term" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 rounded-full bg-primary/10 p-1">
                <TabsTrigger
                  value="short-term"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none"
                >
                  <ClipboardList className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> برنامه‌ریزی کوتاه مدت
                </TabsTrigger>
                <TabsTrigger
                  value="long-term"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none"
                >
                  <Target className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> برنامه‌ریزی بلند مدت
                </TabsTrigger>
              </TabsList>
              <TabsContent value="short-term" className="space-y-6">
                <div className="p-4 rounded-md border bg-primary/10 shadow-sm">
                  <DailyPromptDisplay prompt={currentSuccessQuote} />
                </div>
                <CreateTaskForm onAddTask={handleAddTask} />
                <TaskList
                  tasks={tasks}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                  onEditTask={handleEditTask}
                />
              </TabsContent>
              <TabsContent value="long-term" className="space-y-6 text-center py-8">
                <Target className="mx-auto h-16 w-16 text-primary/70 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">مدیریت اهداف بلندمدت</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  اهداف بزرگ و برنامه‌های طولانی‌مدت خود را در صفحه اختصاصی برنامه‌ریز بلندمدت تعریف، پیگیری و مدیریت کنید.
                </p>
                <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                  <Link href="/section/1/long-term">
                     <ChevronLeftSquare className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                    رفتن به برنامه‌ریز بلندمدت
                  </Link>
                </Button>
                 <div className="mt-10 p-4 border rounded-md bg-secondary/30 max-w-lg mx-auto">
                    <h4 className="text-lg font-semibold text-primary mb-2">در صفحه برنامه‌ریز بلندمدت شما می‌توانید:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-left rtl:text-right text-foreground/80">
                      <li>اهداف بلندمدت خود را با عنوان، توضیحات و تاریخ هدف تعریف کنید.</li>
                      <li>لیست اهداف خود را مشاهده، ویرایش و حذف نمایید.</li>
                      <li>وضعیت هر هدف را مشخص کنید (شروع نشده، در حال انجام، تکمیل شده، متوقف شده).</li>
                      <li>و به زودی قابلیت‌های پیشرفته‌تری مانند اهداف SMART و تقسیم وظایف اضافه خواهد شد.</li>
                    </ul>
                  </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
