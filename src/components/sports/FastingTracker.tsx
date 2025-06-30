
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Clock, PlayCircle, StopCircle, Timer } from 'lucide-react';
import { format, parseISO, differenceInSeconds } from 'date-fns';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers';
import type { ActiveFast } from '@/types';
import { fastingStages } from '@/lib/fasting-stages';
import { cn } from '@/lib/utils';


interface FastingTrackerProps {
    activeFast: ActiveFast | null;
    onStartFast: () => void;
    onEndFast: (notes?: string) => void;
}

export function FastingTracker({ activeFast, onStartFast, onEndFast }: FastingTrackerProps) {
    const [notes, setNotes] = useState('');
    const [elapsedTime, setElapsedTime] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        if (!activeFast) {
            setElapsedTime(null);
            return;
        }

        const timerId = setInterval(() => {
            const now = new Date();
            const start = parseISO(activeFast.startTime);
            const totalSeconds = differenceInSeconds(now, start);

            if (totalSeconds < 0) return;

            setElapsedTime({
                hours: Math.floor(totalSeconds / 3600),
                minutes: Math.floor((totalSeconds % 3600) / 60),
                seconds: totalSeconds % 60,
            });
        }, 1000); // Update every second

        return () => clearInterval(timerId);
    }, [activeFast]);

    const handleEndFast = () => {
        onEndFast(notes);
        setNotes('');
    };

    const currentStage = useMemo(() => {
        if (!activeFast || !elapsedTime) return null;
        return fastingStages.slice().reverse().find(stage => elapsedTime.hours >= stage.startHour);
    }, [elapsedTime, activeFast]);
    
    // Calculate progress for the circular timer based on a 24-hour cycle
    const totalSecondsIn24Hours = 24 * 60 * 60;
    const elapsedTotalSeconds = elapsedTime ? (elapsedTime.hours * 3600) + (elapsedTime.minutes * 60) + elapsedTime.seconds : 0;
    const progress = Math.min((elapsedTotalSeconds / totalSecondsIn24Hours) * 100, 100);

    const circumference = 2 * Math.PI * 90; // 2 * pi * radius of the SVG circle
    const offset = circumference - (progress / 100) * circumference;


    if (!activeFast) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                       <Timer className="ml-2 h-6 w-6 rtl:mr-2 rtl:ml-0 text-primary" />
                        ردیاب فستینگ
                    </CardTitle>
                    <CardDescription>
                        برای شروع یک جلسه روزه‌داری متناوب، روی دکمه زیر کلیک کنید.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={onStartFast} size="lg" className="w-full">
                        <PlayCircle className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
                        شروع فستینگ
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-primary bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center text-primary">
                    <Clock className="ml-2 h-6 w-6 rtl:mr-2 rtl:ml-0 animate-pulse" />
                    فستینگ در حال اجرا
                </CardTitle>
                <CardDescription>
                    شما در حال حاضر در یک جلسه روزه‌داری هستید.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                <div className="relative w-56 h-56">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            className="stroke-muted/30"
                            strokeWidth="12"
                            fill="transparent"
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            className="stroke-primary transition-all duration-1000 ease-linear"
                            strokeWidth="12"
                            fill="transparent"
                            strokeLinecap="round"
                            transform="rotate(-90 100 100)"
                            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                         <span className="text-5xl font-bold font-mono tracking-tighter text-primary" dir="ltr">
                            {elapsedTime ? `${String(elapsedTime.hours).padStart(2, '0')}:${String(elapsedTime.minutes).padStart(2, '0')}` : '۰۰:۰۰'}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1 px-2 truncate">{currentStage?.title || 'شروع فستینگ'}</p>
                    </div>
                </div>

                <div className="p-3 border rounded-md bg-background text-center shadow-sm w-full">
                    <p className="text-sm text-muted-foreground">شروع: {formatJalaliDateDisplay(parseISO(activeFast.startTime), 'HH:mm - eeee, jD jMMMM')}</p>
                </div>

                <div className="w-full">
                    <Label htmlFor="fastingNotes" className="mb-1 block text-sm font-medium">یادداشت‌ها (اختیاری)</Label>
                    <Textarea 
                        id="fastingNotes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="احساسات یا نکات مربوط به این جلسه فستینگ را اینجا بنویسید..."
                        rows={2}
                    />
                </div>
                <Button onClick={handleEndFast} size="lg" className="w-full" variant="destructive">
                    <StopCircle className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
                    پایان فستینگ و ذخیره جلسه
                </Button>

                <div className="mt-6 pt-4 border-t w-full">
                    <h4 className="text-md font-semibold text-primary mb-3">مراحل فستینگ و اتفاقات بدن</h4>
                    <div className="space-y-3">
                        {fastingStages.map((stage) => {
                            const isAchieved = elapsedTime ? elapsedTime.hours >= stage.startHour : false;
                            const isCurrent = currentStage?.startHour === stage.startHour;

                            return (
                                <Card key={stage.startHour} className={cn(
                                "transition-all duration-500 overflow-hidden",
                                isCurrent ? "border-primary shadow-lg bg-primary/5" : "bg-card",
                                !isAchieved && "opacity-60 saturate-50"
                                )}>
                                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                                        <div className={cn(
                                        "h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center",
                                        isAchieved ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        )}>
                                        <stage.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{stage.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    {isCurrent && (
                                        <CardContent className="p-4 pt-0 pl-14 rtl:pr-14 rtl:pl-4 text-sm text-foreground/90 animate-in fade-in-50 duration-500">
                                            <p>{stage.description}</p>
                                        </CardContent>
                                    )}
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
