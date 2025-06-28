'use client';

import type { Habit } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { SmilePlus } from 'lucide-react';

interface TodayHabitsProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
}

export function TodayHabits({ habits, onToggleHabit }: TodayHabitsProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p className="mb-4">تمام عادت‌های امروز انجام شده‌اند. آفرین!</p>
         <Button asChild variant="secondary">
            <Link href="/section/5">
                <SmilePlus className="ml-2 h-4 w-4" />
                مدیریت عادت‌ها
            </Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {habits.map(habit => (
        <li key={habit.id} className="flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-muted/50">
          <Checkbox 
            id={`dashboard-habit-${habit.id}`} 
            onCheckedChange={() => onToggleHabit(habit.id)}
          />
          <label 
            htmlFor={`dashboard-habit-${habit.id}`}
            className="flex-grow cursor-pointer text-base"
          >
            {habit.name}
          </label>
        </li>
      ))}
    </ul>
  );
}
