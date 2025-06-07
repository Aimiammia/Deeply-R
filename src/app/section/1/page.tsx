
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


export default function Section1Page() {
  const params = useParams();
  const sectionId = params.sectionId as string; // Should be '1'
  const { toast } = useToast();

  const sectionTitle = "وظایف";
  const sectionPageDescription = "مدیریت و مشاهده وظایف روزانه شما.";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Load tasks from localStorage on initial mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('dailyTasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
      // Optionally, clear corrupted data or inform user
      localStorage.removeItem('dailyTasks');
    }
    setIsInitialLoadComplete(true);
  }, []);

  // Save tasks to localStorage whenever they change, but only after initial load
  useEffect(() => {
    if (isInitialLoadComplete) {
      localStorage.setItem('dailyTasks', JSON.stringify(tasks));
    }
  }, [tasks, isInitialLoadComplete]);

  const handleAddTask = (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    toast({
      title: "وظیفه اضافه شد",
      description: `"${title}" با موفقیت به لیست وظایف اضافه شد.`,
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
        title: "وظیفه حذف شد",
        description: `"${taskToDelete.title}" از لیست وظایف حذف شد.`,
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
      title: "وظیفه ویرایش شد",
      description: `وظیفه با موفقیت به "${newTitle}" تغییر نام یافت.`,
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
