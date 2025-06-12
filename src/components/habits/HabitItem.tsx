
'use client';

import type { Habit } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { format, parseISO, startOfDay } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HabitItemProps {
  habit: Habit;
  onToggleCompletion: (habitId: string, date: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

export function HabitItem({ habit, onToggleCompletion, onDeleteHabit }: HabitItemProps) {
  const todayISOString = startOfDay(new Date()).toISOString().split('T')[0]; 

  const isCompletedToday = habit.completions?.includes(todayISOString);

  const handleToggle = () => {
    onToggleCompletion(habit.id, todayISOString);
  };

  return (
    <li className="flex items-center justify-between gap-3 p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 flex-grow">
        <Checkbox
          id={`habit-${habit.id}`}
          checked={isCompletedToday}
          onCheckedChange={handleToggle}
          aria-label={isCompletedToday ? `علامت زدن عادت "${habit.name}" به عنوان انجام نشده برای امروز` : `علامت زدن عادت "${habit.name}" به عنوان انجام شده برای امروز`}
        />
        <label
          htmlFor={`habit-${habit.id}`}
          className={cn(
            "flex-grow cursor-pointer text-base",
            isCompletedToday && "line-through text-muted-foreground"
          )}
        >
          {habit.name}
        </label>
      </div>
      <div className="flex items-center flex-shrink-0">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="حذف عادت">
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تایید حذف عادت</AlertDialogTitle>
              <AlertDialogDescription>
                آیا از حذف عادت "{habit.name}" مطمئن هستید؟ این عمل قابل بازگشت نیست.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>لغو</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteHabit(habit.id)} variant="destructive">
                حذف عادت
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
};
// Removed React.memo wrapper
export { HabitItem };
