
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Clock, PlayCircle, StopCircle, Info, Timer } from 'lucide-react';
import { format, parseISO, differenceInSeconds } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers';
import type { ActiveFast } from '@/types';

interface FastingTrackerProps {
    activeFast: ActiveFast | null;
    onStartFast: () => void;
    onEndFast: (notes?: string) => void;
}

export function FastingTracker({ activeFast, onStartFast, onEndFast }: FastingTrackerProps) {
    const [notes, setNotes] = useState('');
    const [elapsedTime, setElapsedTime] = useState('');

    useEffect(() => {
        if (!activeFast) {
            setElapsedTime('');
            return;
        }

        const timerId = setInterval(() => {
            const now = new Date();
            const start = parseISO(activeFast.startTime);
            const seconds = differenceInSeconds(now, start);

            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);

            setElapsedTime(`${hours.toLocaleString('fa-IR')} ساعت و ${minutes.toLocaleString('fa-IR')} دقیقه`);
        }, 1000);

        return () => clearInterval(timerId);
    }, [activeFast]);

    const handleEndFast = () => {
        onEndFast(notes);
        setNotes('');
    };

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
            <CardContent className="space-y-4">
                <div className="p-3 border rounded-md bg-background text-center shadow-sm">
                    <p className="text-sm text-muted-foreground">زمان شروع</p>
                    <p className="text-lg font-semibold text-foreground">
                        {formatJalaliDateDisplay(parseISO(activeFast.startTime), 'HH:mm - eeee, jD jMMMM')}
                    </p>
                </div>
                 <div className="p-3 border rounded-md bg-background text-center shadow-sm">
                    <p className="text-sm text-muted-foreground">مدت زمان سپری شده</p>
                    <p className="text-2xl font-bold text-primary tracking-wider">
                        {elapsedTime || 'در حال محاسبه...'}
                    </p>
                </div>
                <div>
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
            </CardContent>
        </Card>
    );
}
