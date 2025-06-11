
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ListChecks, Repeat, CalendarClock, BarChart2, Award, Tags } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Habit } from '@/types';
import { useDebouncedLocalStorage } from '@/hooks/useDebouncedLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { CreateHabitForm } from '@/components/habits/CreateHabitForm';
import { HabitList } from '@/components/habits/HabitList';

export default function HabitsPage() {
  const sectionTitle = "ردیاب عادت‌ها";
  const sectionPageDescription = "در این بخش عادت‌های مثبت خود را ایجاد و پیگیری کنید تا به اهداف خود نزدیک‌تر شوید.";
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

        <div className="mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-1">
            <ListChecks className="h-8 w-8 text-primary" />
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
                    <ListChecks className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0"/>
                    عادت‌های روزانه من
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CreateHabitForm onAddHabit={handleAddHabit} />
                <HabitList 
                    habits={habits} 
                    onToggleCompletion={handleToggleHabitCompletion}
                    onDeleteHabit={handleDeleteHabit} 
                />
              </CardContent>
            </Card>
            
            <div className="text-center my-8">
                <Image
                src="https://placehold.co/600x350.png"
                alt="تصویر مفهومی پیگیری عادت‌ها و پیشرفت"
                width={600}
                height={350}
                className="rounded-md mx-auto shadow-md"
                data-ai-hint="habit tracking progress"
                />
            </div>

            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="text-xl text-primary">قابلیت‌های برنامه‌ریزی شده برای ردیاب عادت‌ها</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-foreground/90">
                  <li className="flex items-start"><Repeat className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>امکان تنظیم تکرار عادت‌ها (روزانه، هفتگی با روزهای مشخص، چند بار در روز).</li>
                  <li className="flex items-start"><CalendarClock className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>تنظیم یادآور برای انجام عادت‌ها.</li>
                  <li className="flex items-start"><BarChart2 className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>نمایش نمودارهای پیشرفت و زنجیره موفقیت در انجام عادت‌ها (streaks).</li>
                  <li className="flex items-start"><Award className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>سیستم پاداش و انگیزش (اختیاری) برای پایبندی به عادت‌ها.</li>
                  <li className="flex items-start"><Tags className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>امکان دسته‌بندی عادت‌ها برای سازماندهی بهتر.</li>
                </ul>
              </CardContent>
            </Card>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
