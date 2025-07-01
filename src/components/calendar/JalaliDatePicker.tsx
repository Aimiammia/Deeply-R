
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  JALALI_MONTH_NAMES,
  JALALI_DAY_NAMES_LONG,
  getDaysInJalaliMonth,
  getJalaliMonthFirstDayOfWeek,
  getJalaliToday,
  isJalaliToday as checkIsJalaliToday,
  parseJalaliDate,
  gregorianToJalali,
} from '@/lib/calendar-helpers';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface JalaliDatePickerProps {
  value?: Date; // Gregorian Date object
  onChange: (date: Date) => void;
  initialYear?: number;
  initialMonth?: number; // 1-indexed
}

export function JalaliDatePicker({ value, onChange, initialYear, initialMonth }: JalaliDatePickerProps) {
  const componentLoadToday = getJalaliToday(); // For initial state
  
  const [currentJalaliYear, setCurrentJalaliYear] = useState(() => {
    if (value) {
      const jalaliDate = gregorianToJalali(value.getFullYear(), value.getMonth() + 1, value.getDate());
      return jalaliDate?.jy || initialYear || componentLoadToday.year;
    }
    return initialYear || componentLoadToday.year;
  });

  const [currentJalaliMonth, setCurrentJalaliMonth] = useState(() => { // 1-indexed
    if (value) {
      const jalaliDate = gregorianToJalali(value.getFullYear(), value.getMonth() + 1, value.getDate());
      return jalaliDate?.jm || initialMonth || componentLoadToday.month;
    }
    return initialMonth || componentLoadToday.month;
  });

  const [daysInMonthArray, setDaysInMonthArray] = useState<number[]>([]);
  const [firstDayOfWeekIndex, setFirstDayOfWeekIndex] = useState(0); // 0 for Saturday

  useEffect(() => {
    const numDays = getDaysInJalaliMonth(currentJalaliYear, currentJalaliMonth);
    setDaysInMonthArray(Array.from({ length: numDays }, (_, i) => i + 1));
    setFirstDayOfWeekIndex(getJalaliMonthFirstDayOfWeek(currentJalaliYear, currentJalaliMonth));
  }, [currentJalaliYear, currentJalaliMonth]);

  const selectedJalaliDate = useMemo(() => {
    if (!value) return null;
    const gYear = value.getFullYear();
    const gMonth = value.getMonth() + 1; // JS month is 0-indexed
    const gDay = value.getDate();
    return gregorianToJalali(gYear, gMonth, gDay);
  }, [value]);

  const handlePrevMonth = () => {
    if (currentJalaliMonth === 1) {
      setCurrentJalaliYear(currentJalaliYear - 1);
      setCurrentJalaliMonth(12);
    } else {
      setCurrentJalaliMonth(currentJalaliMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentJalaliMonth === 12) {
      setCurrentJalaliYear(currentJalaliYear + 1);
      setCurrentJalaliMonth(1);
    } else {
      setCurrentJalaliMonth(currentJalaliMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const gregorianDate = parseJalaliDate(currentJalaliYear, currentJalaliMonth, day);
    if (gregorianDate) {
      onChange(gregorianDate);
    }
  };
  
  const handleGoToToday = () => {
    const freshToday = getJalaliToday(); // Get the absolute latest "today"
    setCurrentJalaliYear(freshToday.year);
    setCurrentJalaliMonth(freshToday.month);
  };

  const renderDayCells = () => {
    const dayCells = [];
    for (let i = 0; i < firstDayOfWeekIndex; i++) {
      dayCells.push(<div key={`empty-prev-${i}`} className="p-1 sm:p-2"></div>);
    }

    daysInMonthArray.forEach(day => {
      const isTodayForCell = checkIsJalaliToday(currentJalaliYear, currentJalaliMonth, day);
      const dayOfWeekArrayIndex = (firstDayOfWeekIndex + day - 1) % 7; 
      const isFriday = dayOfWeekArrayIndex === 6;

      const isSelected = selectedJalaliDate?.jy === currentJalaliYear &&
                         selectedJalaliDate?.jm === currentJalaliMonth &&
                         selectedJalaliDate?.jd === day;

      dayCells.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          type="button"
          className={cn(
            "flex items-center justify-center aspect-square rounded-full h-9 w-9 text-sm transition-colors",
            isSelected && "bg-primary text-primary-foreground font-bold hover:bg-primary/90",
            !isSelected && isTodayForCell && "bg-accent text-accent-foreground",
            !isSelected && !isTodayForCell && "hover:bg-accent hover:text-accent-foreground",
            !isSelected && isFriday && "text-red-500 dark:text-red-400"
          )}
        >
          {day.toLocaleString('fa-IR')}
        </button>
      );
    });
    
    const totalCells = Math.ceil((firstDayOfWeekIndex + daysInMonthArray.length) / 7) * 7;
     for (let i = dayCells.length; i < totalCells; i++) {
      dayCells.push(<div key={`empty-next-${i}`} className="p-1 sm:p-2"></div>);
    }

    return dayCells;
  };

  return (
    <div className="w-full max-w-xs mx-auto bg-popover text-popover-foreground p-4 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="rounded-full">
          <ChevronRight className="h-5 w-5" />
        </Button>
        <div className="text-center font-semibold text-lg">
            {JALALI_MONTH_NAMES[currentJalaliMonth - 1]} {currentJalaliYear.toLocaleString('fa-IR', {useGrouping: false})}
        </div>
        <Button variant="ghost" size="icon" onClick={handleNextMonth} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
        {JALALI_DAY_NAMES_LONG.map(dayName => (
          <div key={dayName} className={cn("py-1", dayName === 'جمعه' && "text-red-500 dark:text-red-400")}>{dayName.substring(0,1)}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 place-items-center">
        {renderDayCells()}
      </div>

      <Button onClick={handleGoToToday} variant="secondary" size="sm" className="w-full mt-4">
          برو به امروز
      </Button>
    </div>
  );
}
