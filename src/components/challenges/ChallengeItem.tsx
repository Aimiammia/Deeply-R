
'use client';

import type { Challenge } from '@/types';
import { useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO, differenceInCalendarDays, startOfDay } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers';

interface ChallengeItemProps {
    challenge: Challenge;
    onToggleDay: (challengeId: string, day: number) => void;
    onDelete: (challengeId: string) => void;
}

export function ChallengeItem({ challenge, onToggleDay, onDelete }: ChallengeItemProps) {
    const today = startOfDay(new Date());
    const startDate = startOfDay(parseISO(challenge.startDate));
    const daysElapsed = differenceInCalendarDays(today, startDate);

    const completedDaysCount = useMemo(() => {
        return Object.values(challenge.completions).filter(Boolean).length;
    }, [challenge.completions]);
    
    const progressPercentage = (completedDaysCount / 30) * 100;

    const handleDelete = useCallback(() => {
        onDelete(challenge.id);
    }, [challenge.id, onDelete]);

    return (
        <Card className="shadow-md">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{challenge.name}</CardTitle>
                        {challenge.description && (
                            <CardDescription className="mt-1">{challenge.description}</CardDescription>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                           شروع: {formatJalaliDateDisplay(startDate, 'PPP')}
                        </p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                                <AlertDialogTitle>تایید حذف چالش</AlertDialogTitle>
                                <AlertDialogDescription>آیا از حذف چالش "{challenge.name}" مطمئن هستید؟</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>لغو</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} variant="destructive">حذف</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-10 sm:grid-cols-10 gap-1.5">
                    {Array.from({ length: 30 }, (_, i) => {
                        const dayNumber = i + 1;
                        const isCompleted = challenge.completions[dayNumber] || false;
                        const isPast = i < daysElapsed;
                        const isToday = i === daysElapsed;
                        const isFuture = i > daysElapsed;
                        const isDisabled = isFuture;

                        return (
                            <Button
                                key={dayNumber}
                                variant={isCompleted ? 'default' : 'outline'}
                                size="icon"
                                className={cn(
                                    "h-8 w-8 text-xs font-mono rounded-md",
                                    isCompleted && "bg-green-500 hover:bg-green-600 border-green-600 text-white",
                                    !isCompleted && isToday && "border-primary ring-2 ring-primary ring-offset-2",
                                    isPast && !isCompleted && "bg-red-500/10 border-red-500/20 text-red-500",
                                    isFuture && "bg-muted/50 border-dashed"
                                )}
                                disabled={isDisabled}
                                onClick={() => onToggleDay(challenge.id, dayNumber)}
                                title={`روز ${dayNumber}`}
                            >
                                {dayNumber.toLocaleString('fa-IR')}
                            </Button>
                        );
                    })}
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>{completedDaysCount.toLocaleString('fa-IR')} از ۳۰ روز تکمیل شده ({progressPercentage.toFixed(0).toLocaleString('fa-IR')}٪)</p>
                </div>
            </CardContent>
        </Card>
    );
}

