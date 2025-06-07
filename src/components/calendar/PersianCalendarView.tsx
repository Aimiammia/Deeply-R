
'use client';

import { useState, useEffect } from 'react';
import {
  JALALI_MONTH_NAMES,
  JALALI_DAY_NAMES_LONG,
  getDaysInJalaliMonth,
  getJalaliMonthFirstDayOfWeek,
  getJalaliToday,
  addJalaliMonths,
  subJalaliMonths,
  formatJalaliDateDisplay,
  getJalaliHolidayInfo,
  isJalaliToday as checkIsToday,
} from '@/lib/calendar-helpers';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersianCalendarViewProps {
  initialYear?: number;
  initialMonth?: number; // 1-indexed
}

export function PersianCalendarView({ initialYear, initialMonth }: PersianCalendarViewProps) {
  const today = getJalaliToday();
  const [currentJalaliYear, setCurrentJalaliYear] = useState(initialYear || today.year);
  const [currentJalaliMonth, setCurrentJalaliMonth] = useState(initialMonth || today.month); // 1-indexed

  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0); // 0 for Saturday, 6 for Friday

  useEffect(() => {
    const numDays = getDaysInJalaliMonth(currentJalaliYear, currentJalaliMonth);
    setDaysInMonth(Array.from({ length: numDays }, (_, i) => i + 1));
    setFirstDayOfWeek(getJalaliMonthFirstDayOfWeek(currentJalaliYear, currentJalaliMonth));
  }, [currentJalaliYear, currentJalaliMonth]);

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
  
  const handleGoToToday = () => {
    setCurrentJalaliYear(today.year);
    setCurrentJalaliMonth(today.month);
  };

  const renderDayCells = () => {
    const dayCells = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      dayCells.push(<div key={`empty-prev-${i}`} className="p-1 sm:p-2 border border-transparent"></div>);
    }

    // Add cells for each day of the month
    daysInMonth.map(day => {
      const isToday = checkIsToday(currentJalaliYear, currentJalaliMonth, day);
      const dayOfWeek = (firstDayOfWeek + day - 1) % 7; // 0=Sat, ..., 6=Fri
      const isFriday = dayOfWeek === 6;
      const holidayInfo = getJalaliHolidayInfo(currentJalaliYear, currentJalaliMonth, day);
      const isPublicHoliday = holidayInfo?.isPublicHoliday || false;

      dayCells.push(
        <div
          key={day}
          className={cn(
            "flex flex-col items-center justify-center aspect-square rounded-lg border cursor-pointer transition-colors",
            "text-sm sm:text-base",
            isToday ? "bg-primary text-primary-foreground font-bold ring-2 ring-primary-foreground ring-offset-1 ring-offset-primary" : 
            isPublicHoliday ? "bg-accent/30 text-accent-foreground font-medium" :
            isFriday ? "text-orange-600 dark:text-orange-400 bg-secondary/30" : "bg-card hover:bg-muted/80",
            "p-1 sm:p-2"
          )}
          title={holidayInfo?.occasion || ''}
        >
          <span className="font-bold text-lg sm:text-xl">{day.toLocaleString('fa-IR')}</span>
          {/* Placeholder for Gregorian/Hijri day, if needed later */}
          {/* <span className="text-xs text-muted-foreground">{gregorianDay}</span> */}
        </div>
      );
    });

    // Fill remaining cells to complete the grid (e.g. up to 35 or 42 cells)
    const totalCells = Math.ceil((firstDayOfWeek + daysInMonth.length) / 7) * 7;
     for (let i = dayCells.length; i < totalCells; i++) {
      dayCells.push(<div key={`empty-next-${i}`} className="p-1 sm:p-2 border border-transparent"></div>);
    }
    
    return dayCells;
  };

  // Placeholder events for Khordad from image
  const khordadEvents = currentJalaliYear === 1404 && currentJalaliMonth === 3 ? [
    { day: 14, text: 'رحلت امام خمینی' },
    { day: 15, text: 'قیام خونین ۱۵ خرداد' },
    { day: 16, text: 'عید سعید قربان' },
    { day: 24, text: 'عید سعید غدیر خم (نمونه)' }, // Assuming 24th is Ghadir for example
  ] : [];


  return (
    <div className="w-full max-w-2xl mx-auto bg-card p-3 sm:p-4 rounded-lg shadow-lg">
      {/* Header: Month/Year Navigation */}
      <div className="flex items-center justify-between mb-4 p-2 bg-primary text-primary-foreground rounded-md shadow">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="hover:bg-primary/80">
          <ChevronRight className="h-6 w-6" /> {/* ChevronRight for RTL prev */}
        </Button>
        <div className="text-center">
            <h2 className="text-lg sm:text-xl font-bold">
            {JALALI_MONTH_NAMES[currentJalaliMonth - 1]} {currentJalaliYear.toLocaleString('fa-IR')}
            </h2>
             {/* Placeholder for Gregorian/Hijri month names */}
            <p className="text-xs opacity-80">(May - June 2025 / ذی القعده - ذی الحجه ۱۴۴۶)</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNextMonth} className="hover:bg-primary/80">
          <ChevronLeft className="h-6 w-6" /> {/* ChevronLeft for RTL next */}
        </Button>
      </div>
      
      <Button onClick={handleGoToToday} variant="outline" className="w-full mb-4">
        برو به امروز
      </Button>

      {/* Day of Week Headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-medium text-muted-foreground mb-2">
        {JALALI_DAY_NAMES_LONG.map(dayName => (
          <div key={dayName} className={cn(dayName === 'جمعه' && "text-orange-600 dark:text-orange-400")}>{dayName}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {renderDayCells()}
      </div>
      
      {/* Events/Holidays List */}
      {khordadEvents.length > 0 && (
         <div className="mt-6 pt-4 border-t">
          <h3 className="text-md sm:text-lg font-semibold text-primary mb-2">مناسبت‌های {JALALI_MONTH_NAMES[currentJalaliMonth - 1]}:</h3>
          <ul className="space-y-1 text-sm text-foreground">
            {khordadEvents.map(event => (
              <li key={event.day}>
                <span className="font-medium text-accent">{event.day.toLocaleString('fa-IR')} {JALALI_MONTH_NAMES[currentJalaliMonth - 1]}:</span> {event.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
