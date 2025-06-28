
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RefreshCw, Timer as TimerIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const POMODORO_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
const LONG_BREAK_TIME = 15 * 60; // 15 minutes

export function PomodoroTimer() {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [time, setTime] = useState(POMODORO_TIME);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const resetTimer = useCallback((newMode: Mode) => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    let newTime = POMODORO_TIME;
    if (newMode === 'shortBreak') newTime = SHORT_BREAK_TIME;
    if (newMode === 'longBreak') newTime = LONG_BREAK_TIME;
    
    setMode(newMode);
    setTime(newTime);
  }, []);

  // Effect to handle the countdown
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsActive(false);
            
            // Play sound and switch mode
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.error("Audio play failed", e));
            }
            
            if (mode === 'pomodoro') {
                toast({ title: "جلسه پومودورو تمام شد!", description: "زمان استراحت کوتاه است." });
                const newPomoCount = pomodoroCount + 1;
                setPomodoroCount(newPomoCount);
                if (newPomoCount % 4 === 0) {
                    resetTimer('longBreak');
                } else {
                    resetTimer('shortBreak');
                }
            } else {
                toast({ title: "استراحت تمام شد!", description: "زمان تمرکز مجدد است." });
                resetTimer('pomodoro');
            }

            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode, pomodoroCount, resetTimer, toast]);
  
  // Effect to preload audio
  useEffect(() => {
    // A simple, generic notification sound URL from a public CDN
    audioRef.current = new Audio('https://cdn.jsdelivr.net/gh/kristopolous/beep.js@master/dist/beep.mp3');
    audioRef.current.load();
  }, []);

  const handleModeChange = (newMode: Mode) => {
    resetTimer(newMode);
  };
  
  const toggleTimer = () => setIsActive(!isActive);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const modeStyles: Record<Mode, string> = {
    pomodoro: 'border-destructive bg-destructive/5 text-destructive-foreground',
    shortBreak: 'border-green-500 bg-green-500/5 text-green-700 dark:text-green-400',
    longBreak: 'border-blue-500 bg-blue-500/5 text-blue-700 dark:text-blue-400',
  };

  return (
    <Card className={cn("shadow-lg transition-colors", modeStyles[mode])}>
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <TimerIcon className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
          تایمر پومودورو
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Tabs value={mode} onValueChange={(value) => handleModeChange(value as Mode)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pomodoro">پومودورو</TabsTrigger>
            <TabsTrigger value="shortBreak">استراحت کوتاه</TabsTrigger>
            <TabsTrigger value="longBreak">استراحت طولانی</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="text-8xl font-bold font-mono tracking-tighter" dir="ltr">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex w-full items-center gap-2">
            <Button onClick={toggleTimer} size="lg" className="flex-1 text-lg">
                {isActive ? <Pause className="ml-2 rtl:mr-2" /> : <Play className="ml-2 rtl:mr-2" />}
                {isActive ? 'توقف' : 'شروع'}
            </Button>
            <Button onClick={() => resetTimer(mode)} variant="outline" size="lg" aria-label="ریست تایمر">
                <RefreshCw />
            </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
            تعداد پومودوروهای تکمیل شده: {pomodoroCount.toLocaleString('fa-IR')}
        </p>
      </CardContent>
    </Card>
  );
}
