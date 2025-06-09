
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Construction, ListChecks } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Habit } from '@/types';
import { useDebouncedLocalStorage } from '@/hooks/useDebouncedLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { CreateHabitForm } from '@/components/habits/CreateHabitForm';
import { HabitList } from '@/components/habits/HabitList';

export default function GoalsAndHabitsPage() {
  const sectionTitle = "اهداف و عادت‌ها";
  const sectionPageDescription = "در این بخش اهداف خود را تعیین کرده و عادت‌های مثبت برای رسیدن به آن‌ها ایجاد و پیگیری کنید.";
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
            // Already completed, remove (uncheck)
            return { ...habit, completions: completions.filter(c => c !== date) };
          } else {
            // Not completed, add (check)
            return { ...habit, completions: [...completions, date] };
          }
        }
        return habit;
      })
    );
    // Toast can be added here if desired, e.g., "Habit marked as done/undone"
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
              <Target className="h-8 w-8 text-primary" />
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
                    ردیاب عادت‌های روزانه
                </h3>
                <CreateHabitForm onAddHabit={handleAddHabit} />
                <HabitList 
                    habits={habits} 
                    onToggleCompletion={handleToggleHabitCompletion}
                    onDeleteHabit={handleDeleteHabit} 
                />
            </div>
            
            <div className="text-center opacity-70">
                <Construction className="mx-auto h-12 w-12 text-primary/70 mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-1">بخش اهداف در دست توسعه است!</h3>
                <p className="text-sm text-muted-foreground">
                    بخش مدیریت اهداف (کوتاه مدت و بلند مدت) و اتصال آن‌ها به عادت‌ها و وظایف به زودی تکمیل خواهد شد.
                </p>
            </div>

            <Image
              src="https://placehold.co/600x350.png"
              alt="تصویر مفهومی اهداف و شکل‌گیری عادت‌ها"
              width={600}
              height={350}
              className="rounded-md mx-auto shadow-md"
              data-ai-hint="goals habits progress"
            />
            <div className="mt-8 p-6 border rounded-lg bg-secondary/30 shadow-inner max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-primary mb-3">قابلیت‌های برنامه‌ریزی شده برای آینده اهداف و عادت‌ها:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-left rtl:text-right text-foreground/90">
                  <li>تعریف اهداف SMART (مشخص، قابل اندازه‌گیری، قابل دستیابی، مرتبط، زمان‌بندی شده) برای اهداف کوتاه/میان مدت.</li>
                  <li>امکان تنظیم تکرار (روزانه، هفتگی با روزهای مشخص) و یادآور برای عادت‌ها.</li>
                  <li>اتصال اهداف (کوتاه‌مدت و بلندمدت از بخش مربوطه) به عادت‌ها و وظایف روزانه در بخش برنامه‌ریز.</li>
                  <li>نمایش نمودارهای پیشرفت بصری برای اهداف و زنجیره پیشرفت در عادت‌ها (streaks).</li>
                  <li>سیستم پاداش و انگیزش برای دستیابی به اهداف و پایبندی به عادت‌ها (اختیاری).</li>
                  <li>امکان دسته‌بندی اهداف و عادت‌ها برای سازماندهی بهتر.</li>
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
