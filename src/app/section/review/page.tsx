
'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, ArrowLeft, BarChart as BarChartIcon, BookHeart, Calendar, CheckCircle, CircleDollarSign, ListChecks, Loader2 } from 'lucide-react';
import { useSharedState } from '@/hooks/useSharedState';
import { ClientOnly } from '@/components/ClientOnly';
import type { Task, FinancialTransaction, Habit, ReflectionEntry } from '@/types';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { parseISO, subDays, startOfMonth, endOfMonth, isWithinInterval, eachDayOfInterval, format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

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

    const [tasks, , tasksLoading] = useSharedState<Task[]>('dailyTasksPlanner', []);
    const [transactions, , transactionsLoading] = useSharedState<FinancialTransaction[]>('financialTransactions', []);
    const [habits, , habitsLoading] = useSharedState<Habit[]>('userHabitsDeeply', []);
    const [reflections, , reflectionsLoading] = useSharedState<ReflectionEntry[]>('dailyReflections', []);

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
                'نرخ موفقیت': completionRate.toFixed(0)
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

    }, [dateRange, tasks, transactions, habits, reflections]);


    return (
        <ClientOnly fallback={
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
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
                            {isLoading ? (
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
                                {isLoading ? <Skeleton className="h-[300px]" /> : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={reviewData.taskChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                            <Tooltip contentStyle={{backgroundColor: 'hsl(var(--popover))', direction: 'rtl', borderRadius: '0.375rem'}}/>
                                            <Legend wrapperStyle={{direction: 'rtl'}} formatter={(value) => <span style={{color: 'hsl(var(--foreground))'}}>{value}</span>}/>
                                            <Bar dataKey="created" name="ایجاد شده" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="completed" name="تکمیل شده" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>پیشرفت عادت‌ها</CardTitle>
                                <CardDescription>نرخ موفقیت در انجام عادت‌ها در بازه زمانی انتخابی.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? <Skeleton className="h-[300px]" /> : (
                                     reviewData.habitChartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={reviewData.habitChartData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                                <YAxis type="category" dataKey="name" width={80} stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                                <Tooltip contentStyle={{backgroundColor: 'hsl(var(--popover))', direction: 'rtl', borderRadius: '0.375rem'}} formatter={(value) => [`${value}%`, "نرخ موفقیت"]} />
                                                <Bar dataKey="نرخ موفقیت" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
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
        </ClientOnly>
    );
}
