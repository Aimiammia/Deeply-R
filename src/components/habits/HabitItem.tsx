
'use client';

import type { Habit } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Award } from 'lucide-react'; // Added Award
import { Badge } from '@/components/ui/badge'; // Added Badge
import { format, parseISO, startOfDay, differenceInCalendarDays, isSameDay, subDays } from 'date-fns'; // Added date-fns functions
import { faIR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useMemo, memo } from 'react'; // Added useMemo and memo
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

const calculateCurrentStreak = (completionISODates: string[]): number => {
  if (!completionISODates || completionISODates.length === 0) {
    return 0;
  }

  const today = startOfDay(new Date());
  // Ensure dates are Date objects, at start of day, unique, and sorted ascending
  const completedDays = [...new Set(completionISODates)]
    .map(iso => startOfDay(parseISO(iso)))
    .sort((a, b) => a.getTime() - b.getTime());

  if (completedDays.length === 0) {
    return 0;
  }

  let currentStreak = 0;
  const lastCompletedDay = completedDays[completedDays.length - 1];

  // A streak is only "current" if the last completion was today or yesterday
  if (!isSameDay(lastCompletedDay, today) && !isSameDay(lastCompletedDay, subDays(today, 1))) {
    return 0;
  }

  for (let i = completedDays.length - 1; i >= 0; i--) {
    if (i === completedDays.length - 1) { // The last completed day in the sorted list
      currentStreak = 1;
    } else {
      // Check if the current day is one day after the previous day in the (reversed) list
      if (differenceInCalendarDays(completedDays[i+1], completedDays[i]) === 1) {
        currentStreak++;
      } else {
        // Streak is broken, and since we iterate from most recent, this is the streak we care about
        break;
      }
    }
  }
  return currentStreak;
};


const HabitItemComponent = ({ habit, onToggleCompletion, onDeleteHabit }: HabitItemProps) => {
  const todayISOString = startOfDay(new Date()).toISOString().split('T')[0]; 

  const isCompletedToday = habit.completions?.includes(todayISOString);

  const handleToggle = () => {
    onToggleCompletion(habit.id, todayISOString);
  };

  const currentStreak = useMemo(() => calculateCurrentStreak(habit.completions || []), [habit.completions]);
  const has21DayStreak = currentStreak >= 21;

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
        {has21DayStreak && (
          <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700 border-green-300 shadow-sm">
            <Award className="mr-1 h-3.5 w-3.5 rtl:ml-1 rtl:mr-0" /> {currentStreak.toLocaleString('fa-IR')} روز پیوسته!
          </Badge>
        )}
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

export const HabitItem = memo(HabitItemComponent);
// Removed React.memo wrapper as it's already applied to HabitItemComponent
// export { HabitItem };
