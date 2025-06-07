
'use client';

import { useState, useEffect } from 'react';
import {
  JALALI_MONTH_NAMES,
  JALALI_DAY_NAMES_LONG,
  getDaysInJalaliMonth,
  getJalaliMonthFirstDayOfWeek,
  getJalaliToday,
  getJalaliHolidayInfo,
  isJalaliToday as checkIsToday,
  formatJalaliDateDisplay, // For displaying selected birthday date
} from '@/lib/calendar-helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Gift, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BirthdayEntry } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

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

  const [birthdays, setBirthdays] = useState<BirthdayEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBirthdayName, setNewBirthdayName] = useState('');
  const [selectedBirthdayDate, setSelectedBirthdayDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [isInitialBirthdaysLoadComplete, setIsInitialBirthdaysLoadComplete] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const numDays = getDaysInJalaliMonth(currentJalaliYear, currentJalaliMonth);
    setDaysInMonth(Array.from({ length: numDays }, (_, i) => i + 1));
    setFirstDayOfWeek(getJalaliMonthFirstDayOfWeek(currentJalaliYear, currentJalaliMonth));
    // Reset selected birthday date when month changes if form is open
    if (showAddForm) {
        setSelectedBirthdayDate(null);
    }
  }, [currentJalaliYear, currentJalaliMonth, showAddForm]);

  // Load birthdays from localStorage
  useEffect(() => {
    try {
      const storedBirthdays = localStorage.getItem('calendarBirthdays');
      if (storedBirthdays) {
        setBirthdays(JSON.parse(storedBirthdays));
      }
    } catch (error) {
      console.error("Failed to parse birthdays from localStorage", error);
      localStorage.removeItem('calendarBirthdays');
    }
    setIsInitialBirthdaysLoadComplete(true);
  }, []);

  // Save birthdays to localStorage
  useEffect(() => {
    if (isInitialBirthdaysLoadComplete) {
      localStorage.setItem('calendarBirthdays', JSON.stringify(birthdays));
    }
  }, [birthdays, isInitialBirthdaysLoadComplete]);

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

  const handleDayClick = (day: number) => {
    if (showAddForm) {
      setSelectedBirthdayDate({ year: currentJalaliYear, month: currentJalaliMonth, day });
    }
    // Future: else, handle displaying events for the day
  };
  
  const handleSaveBirthday = () => {
    if (!newBirthdayName.trim() || !selectedBirthdayDate) {
      toast({
        title: "خطا",
        description: "لطفاً نام و تاریخ تولد را مشخص کنید.",
        variant: "destructive",
      });
      return;
    }
    const newBirthday: BirthdayEntry = {
      id: crypto.randomUUID(),
      name: newBirthdayName.trim(),
      jYear: selectedBirthdayDate.year,
      jMonth: selectedBirthdayDate.month,
      jDay: selectedBirthdayDate.day,
      createdAt: new Date().toISOString(),
    };
    setBirthdays(prev => [...prev, newBirthday].sort((a,b) => a.jDay - b.jDay)); // Sort by day of month
    setNewBirthdayName('');
    setSelectedBirthdayDate(null);
    setShowAddForm(false);
    toast({
      title: "تولد اضافه شد",
      description: `تولد "${newBirthday.name}" با موفقیت اضافه شد.`,
    });
  };

  const handleDeleteBirthday = (id: string) => {
    const birthdayToDelete = birthdays.find(b => b.id === id);
    setBirthdays(prev => prev.filter(b => b.id !== id));
    if (birthdayToDelete) {
        toast({
            title: "تولد حذف شد",
            description: `تولد "${birthdayToDelete.name}" حذف شد.`,
            variant: "destructive",
        });
    }
  };

  const isBirthdayOnDate = (year: number, month: number, day: number): boolean => {
    return birthdays.some(b => b.jYear === year && b.jMonth === month && b.jDay === day);
  };

  const birthdaysInCurrentMonth = birthdays.filter(
    b => b.jYear === currentJalaliYear && b.jMonth === currentJalaliMonth
  ).sort((a,b) => a.jDay - b.jDay);


  const renderDayCells = () => {
    const dayCells = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      dayCells.push(<div key={`empty-prev-${i}`} className="p-1 sm:p-2 border border-transparent"></div>);
    }

    daysInMonth.map(day => {
      const isToday = checkIsToday(currentJalaliYear, currentJalaliMonth, day);
      const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
      const isFriday = dayOfWeek === 6;
      const holidayInfo = getJalaliHolidayInfo(currentJalaliYear, currentJalaliMonth, day);
      const isPublicHoliday = holidayInfo?.isPublicHoliday || false;
      const hasBirthday = isBirthdayOnDate(currentJalaliYear, currentJalaliMonth, day);
      const isSelectedForNewBirthday = showAddForm && selectedBirthdayDate?.year === currentJalaliYear && selectedBirthdayDate?.month === currentJalaliMonth && selectedBirthdayDate?.day === day;

      dayCells.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={cn(
            "flex flex-col items-center justify-center aspect-square rounded-lg border cursor-pointer transition-colors relative",
            "text-sm sm:text-base p-1 sm:p-2",
            isToday && !isSelectedForNewBirthday && "bg-primary text-primary-foreground font-bold ring-2 ring-primary-foreground ring-offset-1 ring-offset-primary",
            isSelectedForNewBirthday && "bg-blue-500 text-white ring-2 ring-blue-300",
            !isToday && !isSelectedForNewBirthday && isPublicHoliday && "bg-accent/30 text-accent-foreground font-medium",
            !isToday && !isSelectedForNewBirthday && !isPublicHoliday && isFriday && "text-orange-600 dark:text-orange-400 bg-secondary/30",
            !isToday && !isSelectedForNewBirthday && !isPublicHoliday && !isFriday && "bg-card hover:bg-muted/80",
            hasBirthday && !isSelectedForNewBirthday && "shadow-inner shadow-yellow-400/50"
          )}
          title={holidayInfo?.occasion || (hasBirthday ? 'تولد!' : '')}
        >
          <span className="font-bold text-lg sm:text-xl">{day.toLocaleString('fa-IR')}</span>
          {hasBirthday && !isSelectedForNewBirthday && <Gift className="absolute top-1 right-1 h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />}
        </div>
      );
    });

    const totalCells = Math.ceil((firstDayOfWeek + daysInMonth.length) / 7) * 7;
     for (let i = dayCells.length; i < totalCells; i++) {
      dayCells.push(<div key={`empty-next-${i}`} className="p-1 sm:p-2 border border-transparent"></div>);
    }
    
    return dayCells;
  };

  const khordadEvents = currentJalaliYear === 1404 && currentJalaliMonth === 3 ? [
    { day: 14, text: 'رحلت امام خمینی' },
    { day: 15, text: 'قیام خونین ۱۵ خرداد' },
    { day: 16, text: 'عید سعید قربان' },
    { day: 24, text: 'عید سعید غدیر خم (نمونه)' },
  ] : [];

  return (
    <div className="w-full max-w-2xl mx-auto bg-card p-3 sm:p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4 p-2 bg-primary text-primary-foreground rounded-md shadow">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="hover:bg-primary/80">
          <ChevronRight className="h-6 w-6" />
        </Button>
        <div className="text-center">
            <h2 className="text-lg sm:text-xl font-bold">
            {JALALI_MONTH_NAMES[currentJalaliMonth - 1]} {currentJalaliYear.toLocaleString('fa-IR')}
            </h2>
            <p className="text-xs opacity-80">(May - June 2025 / ذی القعده - ذی الحجه ۱۴۴۶)</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNextMonth} className="hover:bg-primary/80">
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Button onClick={handleGoToToday} variant="outline" className="flex-1">
          برو به امروز
        </Button>
        <Button onClick={() => {setShowAddForm(prev => !prev); setSelectedBirthdayDate(null); setNewBirthdayName('');}} variant="outline" className="flex-1">
          <PlusCircle className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
          {showAddForm ? 'لغو افزودن تولد' : 'افزودن تولد جدید'}
        </Button>
      </div>

      {showAddForm && (
        <div className="p-4 border rounded-lg mb-4 space-y-3 bg-secondary/30">
          <h3 className="text-md font-semibold text-primary">فرم افزودن تولد</h3>
          <div>
            <Label htmlFor="birthdayName" className="mb-1 block text-sm">نام صاحب تولد</Label>
            <Input 
              id="birthdayName" 
              type="text" 
              value={newBirthdayName} 
              onChange={(e) => setNewBirthdayName(e.target.value)}
              placeholder="مثلا: مریم" 
            />
          </div>
          <div>
            <Label className="mb-1 block text-sm">تاریخ تولد (از تقویم بالا انتخاب کنید)</Label>
            <div className="p-2 border rounded-md bg-background text-center h-10 flex items-center justify-center">
              {selectedBirthdayDate 
                ? `${selectedBirthdayDate.day.toLocaleString('fa-IR')} ${JALALI_MONTH_NAMES[selectedBirthdayDate.month - 1]} ${selectedBirthdayDate.year.toLocaleString('fa-IR')}`
                : <span className="text-muted-foreground">تاریخی انتخاب نشده</span>
              }
            </div>
          </div>
          <Button onClick={handleSaveBirthday} disabled={!newBirthdayName.trim() || !selectedBirthdayDate} className="w-full">
            ذخیره تولد
          </Button>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-medium text-muted-foreground mb-2">
        {JALALI_DAY_NAMES_LONG.map(dayName => (
          <div key={dayName} className={cn(dayName === 'جمعه' && "text-orange-600 dark:text-orange-400")}>{dayName}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {renderDayCells()}
      </div>
      
      {(khordadEvents.length > 0 || birthdaysInCurrentMonth.length > 0) && <Separator className="my-6" />}

      {birthdaysInCurrentMonth.length > 0 && (
         <div className="mt-4">
          <h3 className="text-md sm:text-lg font-semibold text-primary mb-3">تولدهای این ماه:</h3>
          <ul className="space-y-2">
            {birthdaysInCurrentMonth.map(b => (
              <li key={b.id} className="flex items-center justify-between p-2 border rounded-md bg-background hover:bg-muted/30 text-sm">
                <div className="flex items-center">
                    <Gift className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0" />
                    <span className="font-medium">{b.name}</span>
                    <span className="text-muted-foreground mr-2 rtl:ml-2 rtl:mr-0">
                        ({b.jDay.toLocaleString('fa-IR')} {JALALI_MONTH_NAMES[b.jMonth - 1]})
                    </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteBirthday(b.id)} aria-label={`حذف تولد ${b.name}`}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {khordadEvents.length > 0 && (
         <div className="mt-4 pt-4 border-t">
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
