
'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, ArrowLeft, BarChart as BarChartIcon, BookHeart, Calendar, CheckCircle, CircleDollarSign, ListChecks, Loader2 } from 'lucide-react';
import { useFirestore } from '@/hooks/useFirestore';
import type { Task, FinancialTransaction, Habit, ReflectionEntry } from '@/types';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { parseISO, subDays, startOfMonth, endOfMonth, isWithinInterval, eachDayOfInterval, format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart"

type TimeRange = '7d' | '30d' | 'this_month';

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function ReviewPage() {
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');

    const [tasks, , tasksLoading] = useFirestore<Task[]>('dailyTasksPlanner', []);
    const [transactions, , transactionsLoading] = useFirestore<FinancialTransaction[]>('financialTransactions', []);
    const [habits, , habitsLoading] = useFirestore<Habit[]>('userHabitsDeeply', []);
    const [reflections, , reflectionsLoading] = useFirestore<ReflectionEntry[]>('dailyReflections', []);

    const isLoading = tasksLoading || transactionsLoading || habitsLoading || reflectionsLoading;

    const dateRange = useMemo(() => {
        const now = new Date();
        switch (timeRange) {
            case '7d':
                return { start: subDays(now, 6), end: now };
            case '30d':
                return { start: subDays(now, 29), end: now };
            case 'this_month':
                return { start: startOfMonth(now), end: endOfMonth(now) };
        }
    }, [timeRange]);

    const reviewData = useMemo(() => {
        if (isLoading) return null;
        const interval = { start: dateRange.start, end: dateRange.end };
        
        // Tasks
        const createdTasks = tasks.filter(t => isWithinInterval(parseISO(t.createdAt), interval));
        const completedTasks = tasks.filter(t => t.completed && t.completedAt && isWithinInterval(parseISO(t.completedAt), interval));

        // Reflections
        const writtenReflections = reflections.filter(r => isWithinInterval(parseISO(r.date), interval));
        
        // Financials
        const periodTransactions = transactions.filter(t => isWithinInterval(parseISO(t.date), interval));
        const totalIncome = periodTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = periodTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

        // Chart Data
        const daysInInterval = eachDayOfInterval(interval);
        const taskChartData = daysInInterval.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            return {
                name: format(day, 'M/d'),
                created: tasks.filter(t => format(parseISO(t.createdAt), 'yyyy-MM-dd') === dayStr).length,
                completed: tasks.filter(t => t.completedAt && format(parseISO(t.completedAt), 'yyyy-MM-dd') === dayStr).length
            };
        });

        const habitChartData = habits.map(habit => {
            const completionsInInterval = habit.completions.filter(c => isWithinInterval(parseISO(c), interval));
            const totalDaysPossible = daysInInterval.length;
            const completionRate = totalDaysPossible > 0 ? (completionsInInterval.length / totalDaysPossible) * 100 : 0;
            return {
                name: habit.name.length > 15 ? `${habit.name.substring(0, 15)}...` : habit.name,
                completionRate: parseInt(completionRate.toFixed(0)),
            };
        });


        return {
            createdTasksCount: createdTasks.length,
            completedTasksCount: completedTasks.length,
            reflectionsCount: writtenReflections.length,
            totalIncome,
            totalExpense,
            taskChartData,
            habitChartData,
        };

    }, [dateRange, tasks, transactions, habits, reflections, isLoading]);

    const taskChartConfig = {
      created: {
        label: "ایجاد شده",
        color: "hsl(var(--chart-2))",
      },
      completed: {
        label: "تکمیل شده",
        color: "hsl(var(--chart-1))",
      },
    } satisfies ChartConfig

    const habitChartConfig = {
      completionRate: {
        label: "نرخ موفقیت",
        color: "hsl(var(--chart-1))",
      },
    } satisfies ChartConfig

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex justify-center items-center p-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </main>
            </div>
        );
    }

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
                        <AreaChart className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-primary">مرور و گزارش‌گیری</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        عملکرد خود را تحلیل کنید و الگوهای خود را بشناسید.
                    </p>
                </div>

                <Card>
                    <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>داشبورد عملکرد</CardTitle>
                            <CardDescription>خلاصه‌ای از فعالیت‌های شما در بازه زمانی انتخابی.</CardDescription>
                        </div>
                         <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
                            <SelectTrigger className="w-full sm:w-[180px]" aria-label="انتخاب بازه زمانی">
                                <Calendar className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-muted-foreground" />
                                <SelectValue placeholder="بازه زمانی" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">۷ روز اخیر</SelectItem>
                                <SelectItem value="30d">۳۰ روز اخیر</SelectItem>
                                <SelectItem value="this_month">این ماه</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                     <CardContent>
                        {isLoading || !reviewData ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Skeleton className="h-28" />
                                <Skeleton className="h-28" />
                                <Skeleton className="h-28" />
                                <Skeleton className="h-28" />
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <StatCard title="وظایف تکمیل شده" value={reviewData.completedTasksCount.toLocaleString('fa-IR')} icon={CheckCircle} />
                                <StatCard title="تأملات ثبت شده" value={reviewData.reflectionsCount.toLocaleString('fa-IR')} icon={BookHeart} />
                                <StatCard title="مجموع درآمد" value={formatCurrency(reviewData.totalIncome)} icon={CircleDollarSign} />
                                <StatCard title="مجموع هزینه" value={formatCurrency(reviewData.totalExpense)} icon={CircleDollarSign} />
                            </div>
                        )}
                     </CardContent>
                </Card>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>روند وظایف</CardTitle>
                            <CardDescription>مقایسه وظایف ایجاد شده و تکمیل شده در روزهای اخیر.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading || !reviewData ? <Skeleton className="h-[300px]" /> : (
                                <ChartContainer config={taskChartConfig} className="w-full h-[300px]">
                                    <BarChart accessibilityLayer data={reviewData.taskChartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        />
                                        <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                        allowDecimals={false}
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="dot" />}
                                        />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        <Bar dataKey="created" fill="var(--color-created)" radius={4} />
                                        <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>پیشرفت عادت‌ها</CardTitle>
                            <CardDescription>نرخ موفقیت در انجام عادت‌ها در بازه زمانی انتخابی.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading || !reviewData ? <Skeleton className="h-[300px]" /> : (
                                 reviewData.habitChartData.length > 0 ? (
                                    <ChartContainer config={habitChartConfig} className="w-full h-[300px]">
                                        <BarChart accessibilityLayer data={reviewData.habitChartData} layout="vertical">
                                            <CartesianGrid horizontal={false} />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                width={80}
                                            />
                                            <XAxis dataKey="completionRate" type="number" hide />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent indicator="dot" />}
                                            />
                                            <Bar
                                                dataKey="completionRate"
                                                fill="var(--color-completionRate)"
                                                radius={4}
                                            >
                                                <LabelList
                                                    position="right"
                                                    offset={8}
                                                    className="fill-foreground"
                                                    fontSize={12}
                                                    formatter={(value: number) => `${value.toLocaleString('fa-IR')}%`}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                 ) : (
                                    <div className="flex items-center justify-center h-[300px]">
                                        <p className="text-muted-foreground">عادتی برای نمایش وجود ندارد.</p>
                                    </div>
                                 )
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <footer className="text-center py-4 text-sm text-muted-foreground mt-8">
                <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
            </footer>
        </div>
    );
}
