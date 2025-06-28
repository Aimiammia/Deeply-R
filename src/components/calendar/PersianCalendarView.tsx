
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  JALALI_MONTH_NAMES,
  JALALI_DAY_NAMES_LONG,
  getDaysInJalaliMonth,
  getJalaliMonthFirstDayOfWeek,
  getJalaliToday,
  getJalaliHolidayInfo,
  isJalaliToday as checkIsToday,
  formatJalaliDateDisplay,
  parseJalaliDate,
  jalaliToGregorian,
} from '@/lib/calendar-helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Gift, PlusCircle, Trash2, CalendarPlus, Edit2, CalendarCheck2, CalendarIcon, Moon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BirthdayEntry, CalendarEvent } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { format as formatGregorian, parseISO as parseISOGregorian } from 'date-fns';
import { faIR as faIRLocale } from 'date-fns/locale';
import { generateId } from '@/lib/utils';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';


interface PersianCalendarViewProps {
  initialYear?: number;
  initialMonth?: number; // 1-indexed
}

export function PersianCalendarView({ initialYear, initialMonth }: PersianCalendarViewProps) {
  const componentLoadToday = getJalaliToday();
  const [currentJalaliYear, setCurrentJalaliYear] = useState(initialYear || componentLoadToday.year);
  const [currentJalaliMonth, setCurrentJalaliMonth] = useState(initialMonth || componentLoadToday.month);

  const [daysInMonthArray, setDaysInMonthArray] = useState<number[]>([]);
  const [firstDayOfWeekIndex, setFirstDayOfWeekIndex] = useState(0);

  const [birthdays, setBirthdays, birthdaysLoading] = useLocalStorageState<BirthdayEntry[]>('calendarBirthdaysDeeply', []);
  const [events, setEvents, eventsLoading] = useLocalStorageState<CalendarEvent[]>('calendarEventsDeeply', []);

  const [showAddBirthdayForm, setShowAddBirthdayForm] = useState(false);
  const [newBirthdayName, setNewBirthdayName] = useState('');
  const [selectedBirthdayDate, setSelectedBirthdayDate] = useState<{ year: number; month: number; day: number } | null>(null);

  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [selectedEventDate, setSelectedEventDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const [inputYear, setInputYear] = useState<string>(String(currentJalaliYear));
  const [inputMonth, setInputMonth] = useState<string>(String(currentJalaliMonth));

  const { toast } = useToast();
  
  const dataIsLoading = birthdaysLoading || eventsLoading;

  useEffect(() => {
    const numDays = getDaysInJalaliMonth(currentJalaliYear, currentJalaliMonth);
    setDaysInMonthArray(Array.from({ length: numDays }, (_, i) => i + 1));
    setFirstDayOfWeekIndex(getJalaliMonthFirstDayOfWeek(currentJalaliYear, currentJalaliMonth));
    
    if (showAddBirthdayForm) setSelectedBirthdayDate(null);
    if (showAddEventForm || editingEvent) setSelectedEventDate(null);

    setInputYear(String(currentJalaliYear));
    setInputMonth(String(currentJalaliMonth));
  }, [currentJalaliYear, currentJalaliMonth, showAddBirthdayForm, showAddEventForm, editingEvent]);

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
    const freshToday = getJalaliToday();
    setCurrentJalaliYear(freshToday.year);
    setCurrentJalaliMonth(freshToday.month);
  };

  const handleDayClick = (day: number) => {
    if (showAddBirthdayForm) {
      setSelectedBirthdayDate({ year: currentJalaliYear, month: currentJalaliMonth, day });
    } else if (showAddEventForm || editingEvent) {
       setSelectedEventDate({ year: currentJalaliYear, month: currentJalaliMonth, day });
    }
  };
  
  const handleSaveBirthday = () => {
    if (!newBirthdayName.trim() || !selectedBirthdayDate) {
      toast({ title: "خطا", description: "لطفاً نام و تاریخ تولد را مشخص کنید.", variant: "destructive" });
      return;
    }
    const nativeDate = parseJalaliDate(selectedBirthdayDate.year, selectedBirthdayDate.month, selectedBirthdayDate.day);
    if (!nativeDate) {
        toast({ title: "خطا", description: "تاریخ تولد نامعتبر است.", variant: "destructive" });
        return;
    }
    const newBirthday: BirthdayEntry = {
      id: generateId(),
      name: newBirthdayName.trim(),
      jYear: selectedBirthdayDate.year, jMonth: selectedBirthdayDate.month, jDay: selectedBirthdayDate.day,
      gDate: nativeDate.toISOString(),
      createdAt: new Date().toISOString(),
    };
    setBirthdays(prev => [...prev, newBirthday].sort((a,b) => a.jDay - b.jDay));
    setNewBirthdayName(''); setSelectedBirthdayDate(null); setShowAddBirthdayForm(false);
    toast({ title: "تولد اضافه شد", description: `تولد "${newBirthday.name}" با موفقیت اضافه شد.` });
  };

  const handleDeleteBirthday = (id: string) => {
    const birthdayToDelete = birthdays.find(b => b.id === id);
    setBirthdays(prev => prev.filter(b => b.id !== id));
    if (birthdayToDelete) toast({ title: "تولد حذف شد", description: `تولد "${birthdayToDelete.name}" حذف شد.`, variant: "destructive" });
  };

  const handleSaveEvent = () => {
    if (!newEventName.trim() || !selectedEventDate) {
      toast({ title: "خطا", description: "لطفاً نام و تاریخ رویداد را مشخص کنید.", variant: "destructive" });
      return;
    }
    const nativeDate = parseJalaliDate(selectedEventDate.year, selectedEventDate.month, selectedEventDate.day);
    if (!nativeDate) {
        toast({ title: "خطا", description: "تاریخ رویداد نامعتبر است.", variant: "destructive" });
        return;
    }

    if (editingEvent) {
        const updatedEvent: CalendarEvent = {
            ...editingEvent,
            name: newEventName.trim(),
            description: newEventDescription.trim() || null,
            jYear: selectedEventDate.year,
            jMonth: selectedEventDate.month,
            jDay: selectedEventDate.day,
            gDate: nativeDate.toISOString(),
        };
        setEvents(prev => prev.map(e => e.id === editingEvent.id ? updatedEvent : e).sort((a,b) => a.jDay - b.jDay));
        toast({ title: "رویداد ویرایش شد", description: `رویداد "${updatedEvent.name}" با موفقیت ویرایش شد.` });
    } else {
        const newEvent: CalendarEvent = {
          id: generateId(),
          name: newEventName.trim(),
          description: newEventDescription.trim() || null,
          jYear: selectedEventDate.year, jMonth: selectedEventDate.month, jDay: selectedEventDate.day,
          gDate: nativeDate.toISOString(),
          createdAt: new Date().toISOString(),
        };
        setEvents(prev => [...prev, newEvent].sort((a,b) => a.jDay - b.jDay));
        toast({ title: "رویداد اضافه شد", description: `رویداد "${newEvent.name}" با موفقیت اضافه شد.` });
    }
    setNewEventName(''); setNewEventDescription(''); setSelectedEventDate(null); setShowAddEventForm(false); setEditingEvent(null);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setNewEventName(event.name);
    setNewEventDescription(event.description || '');
    setSelectedEventDate({year: event.jYear, month: event.jMonth, day: event.jDay});
    setShowAddEventForm(true); 
    setShowAddBirthdayForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    const eventToDelete = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    if (eventToDelete) toast({ title: "رویداد حذف شد", description: `رویداد "${eventToDelete.name}" حذف شد.`, variant: "destructive" });
  };

  const getEventsForDay = useCallback((year: number, month: number, day: number): CalendarEvent[] => {
    return events.filter(e => e.jYear === year && e.jMonth === month && e.jDay === day);
  }, [events]);

  const getBirthdaysForDay = useCallback((month: number, day: number): BirthdayEntry[] => {
    return birthdays.filter(b => b.jMonth === month && b.jDay === day);
  }, [birthdays]);
  
  const handleGoToInputDate = () => {
    const year = parseInt(inputYear);
    const month = parseInt(inputMonth);
    if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12 && year >= 1000 && year <= 2000) { // Typical Jalali range
      setCurrentJalaliYear(year);
      setCurrentJalaliMonth(month);
    } else {
      toast({ title: "تاریخ نامعتبر", description: "لطفا سال و ماه شمسی معتبری وارد کنید (مثال: سال ۱۴۰۳، ماه ۷).", variant: "destructive"});
    }
  };

  const getGregorianMonthRangeDisplay = useMemo(() => {
    try {
      const firstJalaliDayGregorianParts = jalaliToGregorian(currentJalaliYear, currentJalaliMonth, 1);
      if (!firstJalaliDayGregorianParts) return "نامشخص";
      
      const numDaysInJalali = getDaysInJalaliMonth(currentJalaliYear, currentJalaliMonth);
      const lastJalaliDayGregorianParts = jalaliToGregorian(currentJalaliYear, currentJalaliMonth, numDaysInJalali);
      if (!lastJalaliDayGregorianParts) return "نامشخص";

      const gregStartDate = new Date(firstJalaliDayGregorianParts.gy, firstJalaliDayGregorianParts.gm - 1, firstJalaliDayGregorianParts.gd);
      const gregEndDate = new Date(lastJalaliDayGregorianParts.gy, lastJalaliDayGregorianParts.gm - 1, lastJalaliDayGregorianParts.gd);
      
      const startStr = formatGregorian(gregStartDate, "d MMMM yyyy", {locale: faIRLocale});
      const endStr = formatGregorian(gregEndDate, "d MMMM yyyy", {locale: faIRLocale});
      
      if (gregStartDate.getFullYear() === gregEndDate.getFullYear() && gregStartDate.getMonth() === gregEndDate.getMonth()){
        return `${formatGregorian(gregStartDate, "d", {locale: faIRLocale})} - ${endStr}`;
      }
      return `${startStr} - ${endStr}`;
    } catch (e) {
        console.error("Error calculating Gregorian month range:", e);
        return "نامشخص";
    }
  }, [currentJalaliYear, currentJalaliMonth]);

  const renderDayCells = () => {
    const dayCells = [];
    for (let i = 0; i < firstDayOfWeekIndex; i++) {
      dayCells.push(<div key={`empty-prev-${i}`} className="h-16 sm:h-20 border border-transparent rounded-lg"></div>);
    }

    daysInMonthArray.map(day => {
      const isTodayCell = checkIsToday(currentJalaliYear, currentJalaliMonth, day);
      const dayOfWeekArrayIndex = (firstDayOfWeekIndex + day - 1) % 7; 
      const isFriday = dayOfWeekArrayIndex === 6;

      const holidayInfo = getJalaliHolidayInfo(currentJalaliYear, currentJalaliMonth, day);
      const isPublicHoliday = holidayInfo?.isPublicHoliday || false;
      
      const dayBirthdays = getBirthdaysForDay(currentJalaliMonth, day);
      const dayEvents = getEventsForDay(currentJalaliYear, currentJalaliMonth, day);
      const hasBirthday = dayBirthdays.length > 0;
      const hasEvent = dayEvents.length > 0;

      const isSelectedForNew = 
        (showAddBirthdayForm && selectedBirthdayDate?.day === day && selectedBirthdayDate?.month === currentJalaliMonth && selectedBirthdayDate?.year === currentJalaliYear) ||
        ((showAddEventForm || editingEvent) && selectedEventDate?.day === day && selectedEventDate?.month === currentJalaliMonth && selectedEventDate?.year === currentJalaliYear);

      let cellTitle = holidayInfo?.occasion || '';
      if (hasBirthday) cellTitle += (cellTitle ? ' | ' : '') + dayBirthdays.map(b => `تولد ${b.name}`).join(', ');
      if (hasEvent) cellTitle += (cellTitle ? ' | ' : '') + dayEvents.map(e => e.name).join(', ');

      dayCells.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={cn(
            "flex flex-col items-center justify-start h-16 sm:h-20 rounded-lg border cursor-pointer transition-all duration-150 ease-in-out relative group p-1.5 text-center shadow-sm hover:shadow-md",
            isTodayCell && !isSelectedForNew && "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary shadow-lg scale-105",
            isSelectedForNew && "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary-foreground shadow-lg scale-105",
            !isTodayCell && !isSelectedForNew && isPublicHoliday && "bg-destructive/10 text-destructive-foreground font-medium",
            !isTodayCell && !isSelectedForNew && !isPublicHoliday && isFriday && "text-orange-600 dark:text-orange-400 bg-orange-500/10",
            !isTodayCell && !isSelectedForNew && !isPublicHoliday && !isFriday && "bg-card hover:bg-muted/60",
          )}
          title={cellTitle || undefined}
        >
          <span className="font-bold text-sm sm:text-base">{day.toLocaleString('fa-IR')}</span>
          <div className="flex items-center justify-center gap-1 mt-auto mb-0.5 h-2.5 opacity-70 group-hover:opacity-100">
            {isPublicHoliday && <div className="h-1.5 w-1.5 rounded-full bg-destructive/70"></div>}
            {hasBirthday && <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>}
            {hasEvent && <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>}
          </div>
          {holidayInfo?.occasion && <p className="text-[10px] sm:text-xs leading-tight truncate opacity-60 group-hover:opacity-100 transition-opacity hidden sm:block">{holidayInfo.occasion.split(' ')[0]}</p>}
        </div>
      );
    });

    const totalCells = Math.ceil((firstDayOfWeekIndex + daysInMonthArray.length) / 7) * 7;
     for (let i = dayCells.length; i < totalCells; i++) {
      dayCells.push(<div key={`empty-next-${i}`} className="h-16 sm:h-20 border border-transparent rounded-lg"></div>);
    }
    
    return dayCells;
  };
  
  const currentMonthOfficialHolidays = daysInMonthArray
    .map(day => getJalaliHolidayInfo(currentJalaliYear, currentJalaliMonth, day))
    .filter(Boolean) as { occasion: string, isPublicHoliday: boolean, day: number }[];

  const birthdaysInCurrentMonth = useMemo(() => birthdays.filter(b => b.jMonth === currentJalaliMonth).sort((a,b) => a.jDay - b.jDay), [birthdays, currentJalaliMonth]);
  const eventsInCurrentMonth = useMemo(() => events.filter(e => e.jYear === currentJalaliYear && e.jMonth === currentJalaliMonth).sort((a,b) => a.jDay - b.jDay), [events, currentJalaliYear, currentJalaliMonth]);


  if (dataIsLoading) {
    return (
        <div className="flex justify-center items-center min-h-[500px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-card p-3 sm:p-4 rounded-lg shadow-xl border">
      <div className="flex items-center justify-between mb-4 p-3 bg-primary text-primary-foreground rounded-lg shadow">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="hover:bg-primary/80 text-primary-foreground">
          <ChevronRight className="h-6 w-6" />
        </Button>
        <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {JALALI_MONTH_NAMES[currentJalaliMonth - 1]} {currentJalaliYear.toLocaleString('fa-IR', {useGrouping:false})}
            </h2>
            <p className="text-xs sm:text-sm opacity-90 font-light">{getGregorianMonthRangeDisplay}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNextMonth} className="hover:bg-primary/80 text-primary-foreground">
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 p-3 border rounded-md bg-muted/30 shadow-sm">
        <Input 
            type="number" 
            value={inputYear} 
            onChange={(e) => setInputYear(e.target.value)} 
            placeholder="سال شمسی" 
            className="text-center h-9 text-sm bg-background focus:ring-primary"
            min="1000" max="2000"
        />
        <Input 
            type="number" 
            value={inputMonth} 
            onChange={(e) => setInputMonth(e.target.value)} 
            placeholder="ماه (۱-۱۲)" 
            className="text-center h-9 text-sm bg-background focus:ring-primary"
            min="1" max="12"
        />
        <Button onClick={handleGoToInputDate} variant="secondary" className="w-full h-9 text-sm shadow hover:bg-primary/20">برو به تاریخ</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <Button onClick={handleGoToToday} variant="outline" className="text-sm shadow-sm hover:border-primary">
          <CalendarIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> امروز
        </Button>
        <Button onClick={() => {setShowAddBirthdayForm(prev => !prev); setSelectedBirthdayDate(null); setNewBirthdayName(''); setShowAddEventForm(false); setEditingEvent(null);}} variant={showAddBirthdayForm ? "default" : "outline"} className="text-sm shadow-sm hover:border-primary">
          <Gift className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
          {showAddBirthdayForm ? 'بستن فرم تولد' : 'افزودن تولد'}
        </Button>
         <Button onClick={() => {setShowAddEventForm(prev => !prev); setSelectedEventDate(null); setNewEventName(''); setNewEventDescription(''); setEditingEvent(null); setShowAddBirthdayForm(false);}} variant={(showAddEventForm || editingEvent) ? "default" : "outline"} className="text-sm shadow-sm hover:border-primary">
          <CalendarPlus className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
          {showAddEventForm ? (editingEvent ? 'بستن فرم ویرایش' : 'بستن فرم رویداد') : 'افزودن رویداد'}
        </Button>
      </div>

      {showAddBirthdayForm && (
        <div className="p-4 border rounded-lg mb-4 space-y-3 bg-secondary/40 shadow-md">
          <h3 className="text-md font-semibold text-primary">فرم افزودن تولد</h3>
          <div>
            <Label htmlFor="birthdayName" className="mb-1 block text-sm font-medium">نام صاحب تولد</Label>
            <Input id="birthdayName" type="text" value={newBirthdayName} onChange={(e) => setNewBirthdayName(e.target.value)} placeholder="مثلا: مریم" className="bg-background text-sm"/>
          </div>
          <div>
            <Label className="mb-1 block text-sm font-medium">تاریخ تولد (از تقویم بالا انتخاب کنید)</Label>
            <div className="p-2 border rounded-md bg-background text-center h-10 flex items-center justify-center text-sm">
              {selectedBirthdayDate && parseJalaliDate(selectedBirthdayDate.year, selectedBirthdayDate.month, selectedBirthdayDate.day)
                ? formatJalaliDateDisplay(parseJalaliDate(selectedBirthdayDate.year, selectedBirthdayDate.month, selectedBirthdayDate.day)!, 'jD jMMMM jYYYY')
                : <span className="text-muted-foreground">تاریخی انتخاب نشده</span>
              }
            </div>
          </div>
          <Button onClick={handleSaveBirthday} disabled={!newBirthdayName.trim() || !selectedBirthdayDate} className="w-full text-sm">ذخیره تولد</Button>
        </div>
      )}

      {(showAddEventForm || editingEvent) && (
        <div className="p-4 border rounded-lg mb-4 space-y-3 bg-secondary/40 shadow-md">
          <h3 className="text-md font-semibold text-primary">{editingEvent ? 'فرم ویرایش رویداد' : 'فرم افزودن رویداد'}</h3>
          <div>
            <Label htmlFor="eventName" className="mb-1 block text-sm font-medium">نام رویداد</Label>
            <Input id="eventName" type="text" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} placeholder="مثلا: جلسه پروژه" className="bg-background text-sm"/>
          </div>
           <div>
            <Label htmlFor="eventDescription" className="mb-1 block text-sm font-medium">توضیحات (اختیاری)</Label>
            <Textarea id="eventDescription" value={newEventDescription} onChange={(e) => setNewEventDescription(e.target.value)} placeholder="جزئیات بیشتر..." rows={2} className="bg-background text-sm"/>
          </div>
          <div>
            <Label className="mb-1 block text-sm font-medium">تاریخ رویداد (از تقویم بالا انتخاب کنید)</Label>
            <div className="p-2 border rounded-md bg-background text-center h-10 flex items-center justify-center text-sm">
              {selectedEventDate && parseJalaliDate(selectedEventDate.year, selectedEventDate.month, selectedEventDate.day)
                ? formatJalaliDateDisplay(parseJalaliDate(selectedEventDate.year, selectedEventDate.month, selectedEventDate.day)!, 'jD jMMMM jYYYY')
                : <span className="text-muted-foreground">تاریخی انتخاب نشده</span>
              }
            </div>
          </div>
          <Button onClick={handleSaveEvent} disabled={!newEventName.trim() || !selectedEventDate} className="w-full text-sm">
            {editingEvent ? 'ذخیره تغییرات رویداد' : 'ذخیره رویداد'}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-medium text-muted-foreground mb-2 py-2 border-y">
        {JALALI_DAY_NAMES_LONG.map(dayName => (
          <div key={dayName} className={cn("py-1", dayName === 'جمعه' && "text-orange-600 dark:text-orange-400 font-semibold")}>{dayName}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {renderDayCells()}
      </div>
      
      {(currentMonthOfficialHolidays.length > 0 || birthdaysInCurrentMonth.length > 0 || eventsInCurrentMonth.length > 0) && <Separator className="my-4" />}

      {birthdaysInCurrentMonth.length > 0 && (
         <div className="mb-4 p-3 border rounded-lg bg-yellow-500/10 shadow">
          <h3 className="text-md font-semibold text-yellow-700 dark:text-yellow-400 mb-2 flex items-center">
            <Gift className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" /> تولدهای این ماه:
          </h3>
          <ul className="space-y-1.5">
            {birthdaysInCurrentMonth.map(b => (
              <li key={b.id} className="flex items-center justify-between p-2 rounded-md bg-card/80 hover:bg-muted/40 text-sm shadow-sm">
                <div className="flex items-center">
                    <span className="font-medium text-foreground">{b.name}</span>
                    <span className="text-muted-foreground mr-2 rtl:ml-2 rtl:mr-0 text-xs">
                        ({b.jDay.toLocaleString('fa-IR')} {JALALI_MONTH_NAMES[b.jMonth - 1]})
                    </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteBirthday(b.id)} aria-label={`حذف تولد ${b.name}`} className="text-destructive/80 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {eventsInCurrentMonth.length > 0 && (
         <div className="mb-4 p-3 border rounded-lg bg-green-500/10 shadow">
          <h3 className="text-md font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center">
            <CalendarCheck2 className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" /> رویدادهای شما در این ماه:
          </h3>
          <ul className="space-y-1.5">
            {eventsInCurrentMonth.map(e => (
              <li key={e.id} className="flex items-start justify-between p-2.5 rounded-md bg-card/80 hover:bg-muted/40 text-sm shadow-sm">
                <div>
                    <span className="font-semibold text-foreground">{e.name}</span>
                    <span className="text-muted-foreground mx-2 rtl:ml-2 rtl:mr-0 text-xs">
                        ({e.jDay.toLocaleString('fa-IR')} {JALALI_MONTH_NAMES[e.jMonth - 1]})
                    </span>
                    {e.description && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{e.description}</p>}
                </div>
                <div className="flex items-center flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => handleEditEvent(e)} aria-label={`ویرایش رویداد ${e.name}`} className="text-blue-600/80 hover:text-blue-700">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(e.id)} aria-label={`حذف رویداد ${e.name}`} className="text-destructive/80 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {currentMonthOfficialHolidays.length > 0 && (
         <div className="mt-4 p-3 border rounded-lg bg-red-500/10 shadow">
          <h3 className="text-md font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center">
            <Moon className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0"/> مناسبت‌های رسمی {JALALI_MONTH_NAMES[currentJalaliMonth - 1]}:
          </h3>
          <ul className="space-y-1 text-sm text-foreground/90">
            {currentMonthOfficialHolidays.map(event => (
              <li key={`${event.day}-${event.occasion}`} className="p-1.5 rounded-md hover:bg-muted/30"> 
                <span className="font-medium text-red-600 dark:text-red-300">{event.day.toLocaleString('fa-IR')} {JALALI_MONTH_NAMES[currentJalaliMonth - 1]}:</span> {event.occasion}
                {event.isPublicHoliday && <span className="text-xs text-red-500 mr-1 rtl:ml-1 rtl:mr-0">(تعطیل رسمی)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
