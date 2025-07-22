
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, History, BookHeart, CheckCircle, FileText, Calendar, Camera } from 'lucide-react';
import { useFirestore } from '@/hooks/useFirestore';
import type { Task, ReflectionEntry, DailyActivityLogEntry, CalendarEvent } from '@/types';
import { parseISO, getMonth, getDate, getYear } from 'date-fns';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers';
import { Loader2 } from 'lucide-react';

interface Memory {
    type: 'reflection' | 'task' | 'log' | 'event';
    date: Date;
    content: string;
    icon: React.ElementType;
}

interface MemoriesByYear {
    [year: number]: Memory[];
}

export default function MemoriesPage() {
    const [tasks, , tasksLoading] = useFirestore<Task[]>('dailyTasksPlanner', []);
    const [reflections, , reflectionsLoading] = useFirestore<ReflectionEntry[]>('dailyReflections', []);
    const [logs, , logsLoading] = useFirestore<DailyActivityLogEntry[]>('dailyActivityLogsDeeply', []);
    const [events, , eventsLoading] = useFirestore<CalendarEvent[]>('calendarEventsDeeply', []);

    const isLoading = tasksLoading || reflectionsLoading || logsLoading || eventsLoading;

    const memoriesByYear: MemoriesByYear = useMemo(() => {
        if (isLoading) return {};

        const today = new Date();
        const currentMonth = getMonth(today); // 0-11
        const currentDayOfMonth = getDate(today);

        const allMemories: Memory[] = [];

        // Filter completed tasks
        tasks
            .filter(task => task.completed && task.completedAt)
            .forEach(task => {
                const taskDate = parseISO(task.completedAt!);
                if (getMonth(taskDate) === currentMonth && getDate(taskDate) === currentDayOfMonth && getYear(taskDate) !== getYear(today)) {
                    allMemories.push({ type: 'task', date: taskDate, content: `وظیفه تکمیل شد: ${task.title}`, icon: CheckCircle });
                }
            });

        // Filter reflections
        reflections.forEach(reflection => {
            const reflectionDate = parseISO(reflection.date);
            if (getMonth(reflectionDate) === currentMonth && getDate(reflectionDate) === currentDayOfMonth && getYear(reflectionDate) !== getYear(today)) {
                allMemories.push({ type: 'reflection', date: reflectionDate, content: reflection.text, icon: BookHeart });
            }
        });
        
        // Filter logs
        logs.forEach(log => {
            const logDate = parseISO(log.date);
            if (getMonth(logDate) === currentMonth && getDate(logDate) === currentDayOfMonth && getYear(logDate) !== getYear(today)) {
                allMemories.push({ type: 'log', date: logDate, content: log.text, icon: FileText });
            }
        });

        // Filter events
        events.forEach(event => {
            const eventDate = parseISO(event.gDate);
             if (getMonth(eventDate) === currentMonth && getDate(eventDate) === currentDayOfMonth && getYear(eventDate) !== getYear(today)) {
                allMemories.push({ type: 'event', date: eventDate, content: `رویداد: ${event.name}`, icon: Calendar });
            }
        });

        // Group by year
        return allMemories.reduce((acc: MemoriesByYear, memory) => {
            const year = getYear(memory.date);
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(memory);
            // Sort memories within the year by date
            acc[year].sort((a, b) => a.date.getTime() - b.date.getTime());
            return acc;
        }, {});

    }, [isLoading, tasks, reflections, logs, events]);

    const sortedYears = Object.keys(memoriesByYear).map(Number).sort((a, b) => b - a);

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
                        <History className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-primary">یادآوری خاطرات: در چنین روزی</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        مروری بر فعالیت‌ها و خاطرات شما در این روز، در سال‌های گذشته.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center p-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
                ) : sortedYears.length > 0 ? (
                    <div className="space-y-8">
                        {sortedYears.map(year => (
                            <Card key={year}>
                                <CardHeader>
                                    <CardTitle className="text-xl text-primary">
                                        در چنین روزی در سال {year.toLocaleString('fa-IR')}...
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        {memoriesByYear[year].map((memory, index) => {
                                            const Icon = memory.icon;
                                            return (
                                                <li key={index} className="flex items-start gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <span className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
                                                            <Icon className="h-5 w-5" />
                                                        </span>
                                                        {index < memoriesByYear[year].length - 1 && (
                                                            <div className="w-px h-12 bg-border mt-2"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-4">
                                                        <p className="text-sm text-muted-foreground">
                                                            {formatJalaliDateDisplay(memory.date, 'p - EEEE, jD jMMMM')}
                                                        </p>
                                                        <p className="text-base text-foreground mt-1 whitespace-pre-wrap">
                                                            {memory.content}
                                                        </p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center p-12">
                        <Camera className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <CardTitle>خاطره‌ای برای امروز یافت نشد</CardTitle>
                        <CardDescription className="mt-2">
                            به نظر می‌رسد در این روز در سال‌های گذشته فعالیتی ثبت نکرده‌اید. <br/> 
                            امروز را به یک روز خاطره‌انگیز تبدیل کنید!
                        </CardDescription>
                    </Card>
                )}
            </main>
            <footer className="text-center py-4 text-sm text-muted-foreground mt-8">
                <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
            </footer>
        </div>
    );
}
