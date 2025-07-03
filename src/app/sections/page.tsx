
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { isSameDay, parseISO, startOfDay } from 'date-fns';
import type { Task, Habit, CalendarEvent, BirthdayEntry } from '@/types';
import { ClientOnly } from '@/components/ClientOnly';
import { Loader2, ArrowRight, BookHeart, CalendarCheck, ClipboardList, Clock, Sparkle, LayoutGrid } from 'lucide-react';
import { TodayTasks } from '@/components/dashboard/TodayTasks';
import { TodayHabits } from '@/components/dashboard/TodayHabits';
import { TodayEvents } from '@/components/dashboard/TodayEvents';
import { getDailySuccessQuote } from '@/lib/prompts';

export default function TodayDashboardPage() {
  const [tasks, setTasks, tasksLoading] = useLocalStorageState<Task[]>('dailyTasksPlanner', []);
  const [habits, setHabits, habitsLoading] = useLocalStorageState<Habit[]>('userHabitsDeeply', []);
  const [events, , eventsLoading] = useLocalStorageState<CalendarEvent[]>('calendarEventsDeeply', []);
  const [birthdays, , birthdaysLoading] = useLocalStorageState<BirthdayEntry[]>('calendarBirthdaysDeeply', []);
  
  const isLoading = tasksLoading || habitsLoading || eventsLoading || birthdaysLoading;

  const today = startOfDay(new Date());

  const todaysTasks = useMemo(() => {
    return tasks.filter(task => !task.completed && task.dueDate && isSameDay(parseISO(task.dueDate), today));
  }, [tasks, today]);

  const todaysHabits = useMemo(() => {
    const todayISOString = today.toISOString().split('T')[0];
    return habits.filter(habit => !(habit.completions || []).includes(todayISOString));
  }, [habits, today]);

  const todaysEventsAndBirthdays = useMemo(() => {
    const todaysEvents = events.filter(event => isSameDay(parseISO(event.gDate), today));
    const todaysBirthdays = birthdays.filter(bday => {
        const bdayDate = parseISO(bday.gDate);
        return bdayDate.getMonth() === today.getMonth() && bdayDate.getDate() === today.getDate();
    });

    const combined = [
        ...todaysEvents.map(e => ({ type: 'event' as const, name: e.name })),
        ...todaysBirthdays.map(b => ({ type: 'birthday' as const, name: `تولد ${b.name}` }))
    ];
    return combined;
  }, [events, birthdays, today]);
  
  const dailyQuote = getDailySuccessQuote();

  const handleToggleTask = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null } : task
      )
    );
  };
  
  const handleToggleHabit = (id: string) => {
    const todayISOString = today.toISOString().split('T')[0];
    setHabits(prevHabits =>
        prevHabits.map(habit => {
            if (habit.id === id) {
                const completions = habit.completions || [];
                const isCompleted = completions.includes(todayISOString);
                return {
                    ...habit,
                    completions: isCompleted
                        ? completions.filter(c => c !== todayISOString)
                        : [...completions, todayISOString]
                };
            }
            return habit;
        })
    );
  };

  return (
    <ClientOnly fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              داشبورد امروز
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl italic">
              {dailyQuote}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-primary"><ClipboardList className="ml-2 h-5 w-5" /> وظایف امروز</CardTitle>
                    <CardDescription>کارهایی که باید امروز انجام دهید.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TodayTasks tasks={todaysTasks} onToggleTask={handleToggleTask} />
                  </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-primary"><Sparkle className="ml-2 h-5 w-5" /> عادت‌های امروز</CardTitle>
                        <CardDescription>عادت‌هایی که برای امروز باقی مانده‌اند.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TodayHabits habits={todaysHabits} onToggleHabit={handleToggleHabit} />
                    </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-primary"><CalendarCheck className="ml-2 h-5 w-5" /> رویدادهای امروز</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TodayEvents events={todaysEventsAndBirthdays} />
                    </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                    <CardHeader>
                        <CardTitle className="flex items-center text-primary"><LayoutGrid className="ml-2 h-5 w-5" /> دسترسی به بخش‌ها</CardTitle>
                        <CardDescription>برای مشاهده تمام قابلیت‌ها به صفحه اصلی بروید.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Button asChild className="w-full">
                            <Link href="/">
                                مشاهده تمام بخش‌ها
                                <ArrowRight className="mr-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="bg-card/50 backdrop-blur-sm border-border/20">
                    <CardHeader>
                        <CardTitle className="flex items-center text-primary"><BookHeart className="ml-2 h-5 w-5" /> تأمل روزانه</CardTitle>
                        <CardDescription>زمانی را برای ثبت افکار و احساسات خود اختصاص دهید.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild className="w-full" variant="outline">
                            <Link href="/section/2">
                                نوشتن تأمل جدید
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
        <footer className="text-center py-4 text-sm text-muted-foreground mt-8">
          <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
        </footer>
      </div>
    </ClientOnly>
  );
}
