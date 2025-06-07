
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Task } from '@/types';
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { useToast } from "@/hooks/use-toast";
import { getDailySuccessQuote } from '@/lib/prompts';
import { DailyPromptDisplay } from '@/components/DailyPromptDisplay';

export default function Section1Page() {
  const params = useParams();
  // const sectionId = params.sectionId as string; // Not used directly in this page anymore for title
  const { toast } = useToast();

  const sectionTitle = "برنامه‌ریز روزانه شما";
  const sectionPageDescription = "کارهایی که برای امروز در نظر گرفته‌اید را در این بخش وارد و مدیریت کنید.";
  const currentSuccessQuote = getDailySuccessQuote();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Load tasks from localStorage on initial mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('dailyTasksPlanner');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
      localStorage.removeItem('dailyTasksPlanner');
    }
    setIsInitialLoadComplete(true);
  }, []);

  // Save tasks to localStorage whenever they change, but only after initial load
  useEffect(() => {
    if (isInitialLoadComplete) {
      localStorage.setItem('dailyTasksPlanner', JSON.stringify(tasks));
    }
  }, [tasks, isInitialLoadComplete]);

  const handleAddTask = (title: string, dueDate?: Date | null, priority?: Task['priority'], category?: string | null) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate ? dueDate.toISOString() : null,
      priority: priority || null,
      category: category || null,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    toast({
      title: "کار اضافه شد",
      description: `"${title}" با موفقیت به برنامه امروز شما اضافه شد.`,
      variant: "default",
    });
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    if (taskToDelete) {
      toast({
        title: "کار حذف شد",
        description: `"${taskToDelete.title}" از برنامه امروز شما حذف شد.`,
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
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">
              {sectionTitle}
            </CardTitle>
            <CardDescription>
              {sectionPageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 rounded-md border bg-accent/10 shadow-sm">
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
        <p>&copy; {new Date().getFullYear()} Daily Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}
