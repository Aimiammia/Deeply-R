
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { Task } from '@/types';
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { useToast } from "@/hooks/use-toast";
import { getDailySuccessQuote } from '@/lib/prompts';
import { DailyPromptDisplay } from '@/components/DailyPromptDisplay';

export default function ShortTermPlannerPage() {
  const { toast } = useToast();

  const sectionTitle = "برنامه‌ریزی کوتاه مدت";
  const sectionPageDescription = "کارهایی که برای امروز و آینده نزدیک در نظر گرفته‌اید را در این بخش وارد و مدیریت کنید.";
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
          <Link href="/section/1">
            <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            بازگشت به برنامه‌ریز
          </Link>
        </Button>
        <Card className="shadow-lg bg-card">
          <CardHeader>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <ClipboardList className="h-7 w-7 text-primary" />
                <CardTitle className="text-2xl font-headline text-primary">
                {sectionTitle}
                </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {sectionPageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 rounded-md border bg-primary/10 shadow-sm">
              <DailyPromptDisplay prompt={currentSuccessQuote} />
            </div>
            <CreateTaskForm onAddTask={handleAddTask} />
            <TaskList
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          </CardContent>
        </Card>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
