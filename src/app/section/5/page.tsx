
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ListChecks, Repeat, CalendarClock, BarChart2, Award, Tags } from 'lucide-react'; // Updated icons
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Habit } from '@/types';
import { useDebouncedLocalStorage } from '@/hooks/useDebouncedLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { CreateHabitForm } from '@/components/habits/CreateHabitForm';
import { HabitList } from '@/components/habits/HabitList';

export default function HabitsPage() { // Changed function name for clarity
  const sectionTitle = "ردیاب عادت‌ها"; // Changed Title
  const sectionPageDescription = "در این بخش عادت‌های مثبت خود را ایجاد و پیگیری کنید تا به اهداف خود نزدیک‌تر شوید."; // Updated Description
  const { toast } = useToast();

  const [habits, setHabits] = useDebouncedLocalStorage<Habit[]>('userHabitsDeeply', []);

  const handleAddHabit = (name: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      completions: [],
    };
    setHabits(prevHabits => [newHabit, ...prevHabits].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    toast({
      title: "عادت جدید اضافه شد",
      description: `عادت "${name}" با موفقیت ایجاد شد.`,
    });
  };

  const handleToggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const completions = habit.completions || [];
          const completionIndex = completions.indexOf(date);
          if (completionIndex > -1) {
            return { ...habit, completions: completions.filter(c => c !== date) };
          } else {
            return { ...habit, completions: [...completions, date] };
          }
        }
        return habit;
      })
    );
  };

  const handleDeleteHabit = (habitId: string) => {
    const habitToDelete = habits.find(h => h.id === habitId);
    setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));
    if (habitToDelete) {
      toast({
        title: "عادت حذف شد",
        description: `عادت "${habitToDelete.name}" حذف شد.`,
        variant: "destructive",
      });
    }
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
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
              <ListChecks className="h-8 w-8 text-primary" /> {/* Changed icon */}
              <CardTitle className="text-2xl font-headline text-primary">
                {sectionTitle}
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {sectionPageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            <div className="p-4 border rounded-lg bg-primary/5 shadow-inner">
                <h3 className="text-xl font-semibold text-primary mb-3 flex items-center">
                    <ListChecks className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0"/>
                    عادت‌های روزانه من
                </h3>
                <CreateHabitForm onAddHabit={handleAddHabit} />
                <HabitList 
                    habits={habits} 
                    onToggleCompletion={handleToggleHabitCompletion}
                    onDeleteHabit={handleDeleteHabit} 
                />
            </div>
            
            {/* Removed the "Goals under construction" part */}

            <Image
              src="https://placehold.co/600x350.png"
              alt="تصویر مفهومی پیگیری عادت‌ها و پیشرفت" // Updated alt text
              width={600}
              height={350}
              className="rounded-md mx-auto shadow-md"
              data-ai-hint="habit tracking progress" // Updated AI hint
            />
            <div className="mt-8 p-6 border rounded-lg bg-secondary/30 shadow-inner max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-primary mb-3">قابلیت‌های برنامه‌ریزی شده برای ردیاب عادت‌ها:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-left rtl:text-right text-foreground/90">
                  <li className="flex items-start"><Repeat className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>امکان تنظیم تکرار عادت‌ها (روزانه، هفتگی با روزهای مشخص، چند بار در روز).</li>
                  <li className="flex items-start"><CalendarClock className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>تنظیم یادآور برای انجام عادت‌ها.</li>
                  <li className="flex items-start"><BarChart2 className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>نمایش نمودارهای پیشرفت و زنجیره موفقیت در انجام عادت‌ها (streaks).</li>
                  <li className="flex items-start"><Award className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>سیستم پاداش و انگیزش (اختیاری) برای پایبندی به عادت‌ها.</li>
                  <li className="flex items-start"><Tags className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>امکان دسته‌بندی عادت‌ها برای سازماندهی بهتر.</li>
                  {/* Removed: اتصال اهداف به عادت‌ها و وظایف روزانه (as it's now habit-focused) */}
                  {/* Removed: تعریف اهداف SMART */}
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
