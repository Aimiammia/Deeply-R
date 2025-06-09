
'use client';

import type { Habit } from '@/types';
import { HabitItem } from './HabitItem';
import { ListChecks, SmilePlus } from 'lucide-react'; // SmilePlus as an "empty state" icon for habits

interface HabitListProps {
  habits: Habit[];
  onToggleCompletion: (habitId: string, date: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

export function HabitList({ habits, onToggleCompletion, onDeleteHabit }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border-t mt-4">
        <SmilePlus className="mx-auto h-12 w-12 mb-4 text-primary/70" />
        <p className="text-md">هنوز عادتی برای پیگیری اضافه نشده است.</p>
        <p className="text-sm">اولین عادت روزانه خود را از طریق فرم بالا ایجاد کنید!</p>
      </div>
    );
  }

  const sortedHabits = [...habits].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mt-6 border-t pt-4">
        <h4 className="text-md font-semibold text-foreground mb-3">عادت‌های من (امروز)</h4>
        <ul className="border rounded-md shadow-sm bg-card">
        {sortedHabits.map((habit) => (
            <HabitItem
            key={habit.id}
            habit={habit}
            onToggleCompletion={onToggleCompletion}
            onDeleteHabit={onDeleteHabit}
            />
        ))}
        </ul>
    </div>
  );
}
