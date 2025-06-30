
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RefreshCw, Timer as TimerIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@/types';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const POMODORO_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
const LONG_BREAK_TIME = 15 * 60; // 15 minutes

interface PomodoroTimerProps {
  tasks: Task[];
  onPomodoroComplete: (taskId: string) => void;
}

export function PomodoroTimer({ tasks, onPomodoroComplete }: PomodoroTimerProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [time, setTime] = useState(POMODORO_TIME);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tasksForPomodoro = useMemo(() => {
    return tasks.filter(task => {
      if (task.completed || !task.estimatedMinutes) return false;
      const totalPomodoros = Math.ceil(task.estimatedMinutes / 25);
      return (task.pomodorosCompleted || 0) < totalPomodoros;
    });
  }, [tasks]);

  const resetTimer = useCallback((newMode: Mode) => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    let newTime = POMODORO_TIME;
    if (newMode === 'shortBreak') newTime = SHORT_BREAK_TIME;
    if (newMode === 'longBreak') newTime = LONG_BREAK_TIME;
    
    setMode(newMode);
    setTime(newTime);
  }, []);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsActive(false);
            
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.error("Audio play failed", e));
            }
            
            if (mode === 'pomodoro') {
                if(selectedTaskId) {
                    onPomodoroComplete(selectedTaskId);
                }
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
  }, [isActive, mode, pomodoroCount, resetTimer, toast, selectedTaskId, onPomodoroComplete]);
  
  useEffect(() => {
    audioRef.current = new Audio('https://cdn.jsdelivr.net/gh/kristopolous/beep.js@master/dist/beep.mp3');
    audioRef.current.load();
  }, []);

  const handleModeChange = (newMode: Mode) => {
    resetTimer(newMode);
  };
  
  const toggleTimer = () => setIsActive(!isActive);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const modeStyles: Record<Mode, { card: string, timer: string, progress: string }> = {
    pomodoro: { card: 'border-primary bg-primary/5', timer: 'text-primary', progress: 'stroke-primary' },
    shortBreak: { card: 'border-green-500 bg-green-500/5', timer: 'text-green-600', progress: 'stroke-green-500' },
    longBreak: { card: 'border-blue-500 bg-blue-500/5', timer: 'text-blue-500', progress: 'stroke-blue-500' },
  };

  const totalTimeForMode = mode === 'pomodoro' ? POMODORO_TIME : mode === 'shortBreak' ? SHORT_BREAK_TIME : LONG_BREAK_TIME;
  const progress = ((totalTimeForMode - time) / totalTimeForMode) * 100;
  const circumference = 2 * Math.PI * 90; // 2 * pi * radius
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Card className={cn("shadow-lg transition-colors duration-500", modeStyles[mode].card)}>
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <TimerIcon className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
          تایمر پومودورو
        </CardTitle>
        <CardDescription>برای تمرکز بیشتر، یک وظیفه را انتخاب کنید.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <Select onValueChange={(value) => setSelectedTaskId(value)} disabled={isActive}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="یک وظیفه برای تمرکز انتخاب کنید..." />
            </SelectTrigger>
            <SelectContent>
                {tasksForPomodoro.length > 0 ? (
                    tasksForPomodoro.map(task => {
                        const totalPomodoros = Math.ceil(task.estimatedMinutes! / 25);
                        return (
                            <SelectItem key={task.id} value={task.id}>
                                {task.title} (🍅 {task.pomodorosCompleted || 0}/{totalPomodoros})
                            </SelectItem>
                        )
                    })
                ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">هیچ وظیفه‌ای برای پومودورو وجود ندارد.</div>
                )}
            </SelectContent>
        </Select>

        <div className="relative w-56 h-56">
             <svg className="w-full h-full" viewBox="0 0 200 200">
                <circle
                    cx="100"
                    cy="100"
                    r="90"
                    className="stroke-muted/30"
                    strokeWidth="10"
                    fill="transparent"
                />
                <circle
                    cx="100"
                    cy="100"
                    r="90"
                    className={cn("transition-all duration-1000 ease-linear", modeStyles[mode].progress)}
                    strokeWidth="10"
                    fill="transparent"
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                    style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
                />
            </svg>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn("text-6xl font-bold font-mono tracking-tighter", modeStyles[mode].timer)} dir="ltr">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
            </div>
        </div>
        
        <Tabs value={mode} onValueChange={(value) => handleModeChange(value as Mode)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pomodoro">پومودورو</TabsTrigger>
            <TabsTrigger value="shortBreak">استراحت کوتاه</TabsTrigger>
            <TabsTrigger value="longBreak">استراحت طولانی</TabsTrigger>
          </TabsList>
        </Tabs>
        
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
