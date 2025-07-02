
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
import { useSharedState } from '@/hooks/useSharedState';


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

  const [birthdays, setBirthdays, birthdaysLoading] = useSharedState<BirthdayEntry[]>('calendarBirthdaysDeeply', []);
  const [events, setEvents, eventsLoading] = useSharedState<CalendarEvent[]>('calendarEventsDeeply', []);

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
      dayCells.push(<div key={`empty-prev-${i}`} className="p-1 sm:p-2"></div>);
    }

    daysInMonthArray.forEach(day => {
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
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          type="button"
          className={cn(
            "flex flex-col items-center justify-center aspect-square rounded-full h-auto text-sm transition-colors relative group",
            isSelectedForNew && "bg-primary text-primary-foreground font-bold hover:bg-primary/90 ring-2 ring-offset-2 ring-primary",
            !isSelectedForNew && isTodayCell && "bg-accent text-accent-foreground",
            !isSelectedForNew && !isTodayCell && "hover:bg-accent hover:text-accent-foreground",
            !isSelectedForNew && isPublicHoliday && "text-destructive dark:text-red-400 font-semibold",
            !isSelectedForNew && !isPublicHoliday && isFriday && "text-orange-600 dark:text-orange-400"
          )}
          title={cellTitle || undefined}
        >
          <span className="text-lg font-bold">{day.toLocaleString('fa-IR')}</span>
          <div className="absolute bottom-1.5 flex items-center justify-center gap-1 h-1.5">
            {isPublicHoliday && <div className="h-1.5 w-1.5 rounded-full bg-destructive/80" title={holidayInfo?.occasion}></div>}
            {hasBirthday && <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" title={`تولد: ${dayBirthdays.map(b => b.name).join(', ')}`}></div>}
            {hasEvent && <div className="h-1.5 w-1.5 rounded-full bg-green-500" title={`رویداد: ${dayEvents.map(e => e.name).join(', ')}`}></div>}
          </div>
        </button>
      );
    });
    
    const totalCells = Math.ceil((firstDayOfWeekIndex + daysInMonthArray.length) / 7) * 7;
     for (let i = dayCells.length; i < totalCells; i++) {
      dayCells.push(<div key={`empty-next-${i}`} className="p-1 sm:p-2"></div>);
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
    <div className="w-full max-w-2xl mx-auto bg-popover text-popover-foreground p-4 rounded-xl shadow-md border">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="rounded-full">
          <ChevronRight className="h-5 w-5" />
        </Button>
        <div className="text-center">
            <h2 className="text-lg font-semibold">
                {JALALI_MONTH_NAMES[currentJalaliMonth - 1]} {currentJalaliYear.toLocaleString('fa-IR', {useGrouping:false})}
            </h2>
            <p className="text-xs text-muted-foreground">{getGregorianMonthRangeDisplay}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNextMonth} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <Input 
            type="number" 
            value={inputYear} 
            onChange={(e) => setInputYear(e.target.value)} 
            placeholder="سال شمسی" 
            className="text-center text-sm bg-background focus:ring-primary h-9"
            min="1000" max="2000"
        />
        <Input 
            type="number" 
            value={inputMonth} 
            onChange={(e) => setInputMonth(e.target.value)} 
            placeholder="ماه (۱-۱۲)" 
            className="text-center text-sm bg-background focus:ring-primary h-9"
            min="1" max="12"
        />
        <Button onClick={handleGoToInputDate} variant="secondary" className="w-full text-sm shadow-sm h-9">برو به تاریخ</Button>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <Button onClick={handleGoToToday} variant="outline" className="h-9 text-sm">
          <CalendarIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> امروز
        </Button>
        <Button onClick={() => {setShowAddBirthdayForm(prev => !prev); setSelectedBirthdayDate(null); setNewBirthdayName(''); setShowAddEventForm(false); setEditingEvent(null);}} variant={showAddBirthdayForm ? "default" : "outline"} className="h-9 text-sm">
          <Gift className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
          {showAddBirthdayForm ? 'بستن فرم' : 'افزودن تولد'}
        </Button>
         <Button onClick={() => {setShowAddEventForm(prev => !prev); setSelectedEventDate(null); setNewEventName(''); setNewEventDescription(''); setEditingEvent(null); setShowAddBirthdayForm(false);}} variant={(showAddEventForm || editingEvent) ? "default" : "outline"} className="h-9 text-sm">
          <CalendarPlus className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
          {showAddEventForm ? (editingEvent ? 'بستن فرم' : 'بستن فرم') : 'افزودن رویداد'}
        </Button>
      </div>

       {showAddBirthdayForm && (
        <div className="p-4 border rounded-xl mb-4 space-y-3 bg-secondary/40 shadow-inner">
          <h3 className="text-md font-semibold text-primary">فرم افزودن تولد</h3>
          <div>
            <Label htmlFor="birthdayName" className="mb-1 block text-sm font-medium">نام صاحب تولد</Label>
            <Input id="birthdayName" type="text" value={newBirthdayName} onChange={(e) => setNewBirthdayName(e.target.value)} placeholder="مثلا: مریم" className="bg-background text-sm"/>
          </div>
          <div>
            <Label className="mb-1 block text-sm font-medium">تاریخ تولد (از تقویم بالا انتخاب کنید)</Label>
            <div className="p-2 border rounded-xl bg-background text-center h-10 flex items-center justify-center text-sm">
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
        <div className="p-4 border rounded-xl mb-4 space-y-3 bg-secondary/40 shadow-inner">
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
            <div className="p-2 border rounded-xl bg-background text-center h-10 flex items-center justify-center text-sm">
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

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
        {JALALI_DAY_NAMES_LONG.map(dayName => (
          <div key={dayName} className={cn("py-1", dayName === 'جمعه' && "text-red-500 dark:text-red-400")}>{dayName.substring(0,1)}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {renderDayCells()}
      </div>

      {(currentMonthOfficialHolidays.length > 0 || birthdaysInCurrentMonth.length > 0 || eventsInCurrentMonth.length > 0) && <Separator className="my-4" />}

      {birthdaysInCurrentMonth.length > 0 && (
         <div className="mb-4 p-3 border rounded-xl bg-yellow-500/10 shadow-inner">
          <h3 className="text-md font-semibold text-yellow-700 dark:text-yellow-400 mb-2 flex items-center">
            <Gift className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" /> تولدهای این ماه:
          </h3>
          <ul className="space-y-1.5">
            {birthdaysInCurrentMonth.map(b => (
              <li key={b.id} className="flex items-center justify-between p-2 rounded-xl bg-card/80 hover:bg-muted/40 text-sm shadow-sm">
                <div className="flex items-center">
                    <span className="font-medium text-foreground">{b.name}</span>
                    <span className="text-muted-foreground mr-2 rtl:ml-2 rtl:mr-0 text-xs">
                        ({b.jDay.toLocaleString('fa-IR')} {JALALI_MONTH_NAMES[b.jMonth - 1]})
                    </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteBirthday(b.id)} aria-label={`حذف تولد ${b.name}`} className="text-destructive/80 hover:text-destructive h-7 w-7">
                    <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {eventsInCurrentMonth.length > 0 && (
         <div className="mb-4 p-3 border rounded-xl bg-green-500/10 shadow-inner">
          <h3 className="text-md font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center">
            <CalendarCheck2 className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" /> رویدادهای شما در این ماه:
          </h3>
          <ul className="space-y-1.5">
            {eventsInCurrentMonth.map(e => (
              <li key={e.id} className="flex items-start justify-between p-2.5 rounded-xl bg-card/80 hover:bg-muted/40 text-sm shadow-sm">
                <div>
                    <span className="font-semibold text-foreground">{e.name}</span>
                    <span className="text-muted-foreground mx-2 rtl:ml-2 rtl:mr-0 text-xs">
                        ({e.jDay.toLocaleString('fa-IR')} {JALALI_MONTH_NAMES[e.jMonth - 1]})
                    </span>
                    {e.description && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{e.description}</p>}
                </div>
                <div className="flex items-center flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => handleEditEvent(e)} aria-label={`ویرایش رویداد ${e.name}`} className="text-blue-600/80 hover:text-blue-700 h-7 w-7">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(e.id)} aria-label={`حذف رویداد ${e.name}`} className="text-destructive/80 hover:text-destructive h-7 w-7">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {currentMonthOfficialHolidays.length > 0 && (
         <div className="mt-4 p-3 border rounded-xl bg-red-500/10 shadow-inner">
          <h3 className="text-md font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center">
            <Moon className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0"/> مناسبت‌های رسمی {JALALI_MONTH_NAMES[currentJalaliMonth - 1]}:
          </h3>
          <ul className="space-y-1 text-sm text-foreground/90">
            {currentMonthOfficialHolidays.map(event => (
              <li key={`${event.day}-${event.occasion}`} className="p-1.5 rounded-xl hover:bg-muted/30"> 
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
