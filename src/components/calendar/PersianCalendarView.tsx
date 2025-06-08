
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  JALALI_MONTH_NAMES,
  JALALI_DAY_NAMES_LONG,
  getDaysInJalaliMonth,
  getJalaliMonthFirstDayOfWeek,
  getJalaliToday,
  getJalaliHolidayInfo,
  isJalaliToday as checkIsToday,
  formatJalaliDateDisplay,
  parseJalaliDate, // This now uses jalali-moment
  jalaliToGregorian, // This now uses jalali-moment
} from '@/lib/calendar-helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Gift, PlusCircle, Trash2, CalendarPlus, Edit2, CalendarCheck2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BirthdayEntry, CalendarEvent } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { format as formatGregorian } from 'date-fns';
import { faIR as faIRLocale } from 'date-fns/locale';


interface PersianCalendarViewProps {
  initialYear?: number;
  initialMonth?: number; // 1-indexed
}

export function PersianCalendarView({ initialYear, initialMonth }: PersianCalendarViewProps) {
  const todayJalali = getJalaliToday();
  const [currentJalaliYear, setCurrentJalaliYear] = useState(initialYear || todayJalali.year);
  const [currentJalaliMonth, setCurrentJalaliMonth] = useState(initialMonth || todayJalali.month); // 1-indexed

  const [daysInMonthArray, setDaysInMonthArray] = useState<number[]>([]);
  const [firstDayOfWeekIndex, setFirstDayOfWeekIndex] = useState(0); // 0 for Saturday, 6 for Friday

  // Birthdays State
  const [birthdays, setBirthdays] = useState<BirthdayEntry[]>([]);
  const [showAddBirthdayForm, setShowAddBirthdayForm] = useState(false);
  const [newBirthdayName, setNewBirthdayName] = useState('');
  const [selectedBirthdayDate, setSelectedBirthdayDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [isInitialBirthdaysLoadComplete, setIsInitialBirthdaysLoadComplete] = useState(false);

  // Events State
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [selectedEventDate, setSelectedEventDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [isInitialEventsLoadComplete, setIsInitialEventsLoadComplete] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Navigation Input State
  const [inputYear, setInputYear] = useState<string>(String(currentJalaliYear));
  const [inputMonth, setInputMonth] = useState<string>(String(currentJalaliMonth));


  const { toast } = useToast();

  useEffect(() => {
    const numDays = getDaysInJalaliMonth(currentJalaliYear, currentJalaliMonth);
    setDaysInMonthArray(Array.from({ length: numDays }, (_, i) => i + 1));
    setFirstDayOfWeekIndex(getJalaliMonthFirstDayOfWeek(currentJalaliYear, currentJalaliMonth));
    
    // Reset selections when month changes if forms are open
    if (showAddBirthdayForm) setSelectedBirthdayDate(null);
    if (showAddEventForm || editingEvent) setSelectedEventDate(null);

    setInputYear(String(currentJalaliYear));
    setInputMonth(String(currentJalaliMonth));
  }, [currentJalaliYear, currentJalaliMonth, showAddBirthdayForm, showAddEventForm, editingEvent]);

  // Load birthdays from localStorage
  useEffect(() => {
    try {
      const storedBirthdays = localStorage.getItem('calendarBirthdaysDeeply');
      if (storedBirthdays) setBirthdays(JSON.parse(storedBirthdays));
    } catch (error) {
      console.error("Failed to parse birthdays from localStorage", error);
      localStorage.removeItem('calendarBirthdaysDeeply');
    }
    setIsInitialBirthdaysLoadComplete(true);
  }, []);

  // Save birthdays to localStorage
  useEffect(() => {
    if (isInitialBirthdaysLoadComplete) {
      localStorage.setItem('calendarBirthdaysDeeply', JSON.stringify(birthdays));
    }
  }, [birthdays, isInitialBirthdaysLoadComplete]);

  // Load events from localStorage
  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem('calendarEventsDeeply');
      if (storedEvents) setEvents(JSON.parse(storedEvents));
    } catch (error) {
      console.error("Failed to parse events from localStorage", error);
      localStorage.removeItem('calendarEventsDeeply');
    }
    setIsInitialEventsLoadComplete(true);
  }, []);

  // Save events to localStorage
  useEffect(() => {
    if (isInitialEventsLoadComplete) {
      localStorage.setItem('calendarEventsDeeply', JSON.stringify(events));
    }
  }, [events, isInitialEventsLoadComplete]);


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
    setCurrentJalaliYear(todayJalali.year);
    setCurrentJalaliMonth(todayJalali.month);
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
      id: crypto.randomUUID(),
      name: newBirthdayName.trim(),
      jYear: selectedBirthdayDate.year, jMonth: selectedBirthdayDate.month, jDay: selectedBirthdayDate.day,
      gDate: nativeDate.toISOString(), // Store Gregorian ISO string
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
        setEvents(prev => prev.map(e => e.id === editingEvent.id ? updatedEvent : e).sort((a,b) => a.jDay - b.jDay)); // Sort by day
        toast({ title: "رویداد ویرایش شد", description: `رویداد "${updatedEvent.name}" با موفقیت ویرایش شد.` });
    } else {
        const newEvent: CalendarEvent = {
          id: crypto.randomUUID(),
          name: newEventName.trim(),
          description: newEventDescription.trim() || null,
          jYear: selectedEventDate.year, jMonth: selectedEventDate.month, jDay: selectedEventDate.day,
          gDate: nativeDate.toISOString(),
          createdAt: new Date().toISOString(),
        };
        setEvents(prev => [...prev, newEvent].sort((a,b) => a.jDay - b.jDay)); // Sort by day
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
    setShowAddBirthdayForm(false); // Ensure birthday form is closed
  };

  const handleDeleteEvent = (id: string) => {
    const eventToDelete = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    if (eventToDelete) toast({ title: "رویداد حذف شد", description: `رویداد "${eventToDelete.name}" حذف شد.`, variant: "destructive" });
  };

  const isBirthdayOnDate = (year: number, month: number, day: number): boolean => {
    return birthdays.some(b => b.jYear === year && b.jMonth === month && b.jDay === day);
  };

  const isEventOnDate = (year: number, month: number, day: number): boolean => {
    return events.some(e => e.jYear === year && e.jMonth === month && e.jDay === day);
  };

  const birthdaysInCurrentMonth = birthdays.filter(
    b => b.jYear === currentJalaliYear && b.jMonth === currentJalaliMonth
  ).sort((a,b) => a.jDay - b.jDay);

  const eventsInCurrentMonth = events.filter(
    e => e.jYear === currentJalaliYear && e.jMonth === currentJalaliMonth
  ).sort((a,b) => a.jDay - b.jDay);

  const handleGoToInputDate = () => {
    const year = parseInt(inputYear);
    const month = parseInt(inputMonth);
    if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12 && year > 1000 && year < 2000) { // Jalali years are typically in this range
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

      const startStr = formatGregorian(gregStartDate, "MMMM yyyy", {locale: faIRLocale});
      const endStr = formatGregorian(gregEndDate, "MMMM yyyy", {locale: faIRLocale});
      
      if (startStr === endStr) return startStr;
      return `${startStr} - ${endStr}`;

    } catch (e) {
        console.error("Error calculating Gregorian month range:", e);
        return "نامشخص";
    }
  }, [currentJalaliYear, currentJalaliMonth]);


  const renderDayCells = () => {
    const dayCells = [];
    for (let i = 0; i < firstDayOfWeekIndex; i++) {
      dayCells.push(<div key={`empty-prev-${i}`} className="p-1 sm:p-2 border border-transparent"></div>);
    }

    daysInMonthArray.map(day => {
      const isToday = checkIsToday(currentJalaliYear, currentJalaliMonth, day);
      // Calculate day of week based on our 0=Saturday convention
      const dayOfWeekArrayIndex = (firstDayOfWeekIndex + day - 1) % 7; 
      const isFriday = dayOfWeekArrayIndex === 6; // Friday (index 6 in our JALALI_DAY_NAMES_LONG)

      const holidayInfo = getJalaliHolidayInfo(currentJalaliYear, currentJalaliMonth, day);
      const isPublicHoliday = holidayInfo?.isPublicHoliday || false;
      const hasBirthday = isBirthdayOnDate(currentJalaliYear, currentJalaliMonth, day);
      const hasEvent = isEventOnDate(currentJalaliYear, currentJalaliMonth, day);
      const isSelectedForNew = 
        (showAddBirthdayForm && selectedBirthdayDate?.day === day && selectedBirthdayDate?.month === currentJalaliMonth && selectedBirthdayDate?.year === currentJalaliYear) ||
        ((showAddEventForm || editingEvent) && selectedEventDate?.day === day && selectedEventDate?.month === currentJalaliMonth && selectedEventDate?.year === currentJalaliYear);

      dayCells.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={cn(
            "flex flex-col items-center justify-start aspect-square rounded-lg border cursor-pointer transition-colors relative group pt-1",
            "text-sm sm:text-base",
            isToday && !isSelectedForNew && "bg-primary text-primary-foreground font-bold ring-2 ring-primary-foreground ring-offset-1 ring-offset-primary",
            isSelectedForNew && "bg-blue-500 text-white ring-2 ring-blue-300",
            !isToday && !isSelectedForNew && isPublicHoliday && "bg-accent/30 text-accent-foreground font-medium",
            !isToday && !isSelectedForNew && !isPublicHoliday && isFriday && "text-orange-600 dark:text-orange-400 bg-secondary/30",
            !isToday && !isSelectedForNew && !isPublicHoliday && !isFriday && "bg-card hover:bg-muted/80",
             hasBirthday && !isSelectedForNew && "shadow-inner shadow-yellow-400/50",
             hasEvent && !isSelectedForNew && !hasBirthday && "shadow-inner shadow-green-400/50",
             hasEvent && hasBirthday && !isSelectedForNew && "shadow-inner shadow-purple-400/50"
          )}
          title={holidayInfo?.occasion || (hasBirthday ? 'تولد!' : '') || (hasEvent ? 'رویداد!' : '')}
        >
          <span className="font-bold text-lg sm:text-xl">{day.toLocaleString('fa-IR')}</span>
          <div className="flex items-center justify-center gap-1 mt-auto mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {hasBirthday && !isSelectedForNew && <Gift className="h-3 w-3 text-yellow-500" />}
            {hasEvent && !isSelectedForNew && <CalendarCheck2 className="h-3 w-3 text-green-500" />}
          </div>
           {hasEvent && !isSelectedForNew && !hasBirthday && <div className="absolute bottom-1 left-1 h-1.5 w-1.5 rounded-full bg-green-500"></div>}
           {hasBirthday && !isSelectedForNew && !hasEvent && <div className="absolute bottom-1 left-1 h-1.5 w-1.5 rounded-full bg-yellow-500"></div>}
           {hasEvent && hasBirthday && !isSelectedForNew && <div className="absolute bottom-1 left-1 h-1.5 w-1.5 rounded-full bg-purple-500"></div>}
        </div>
      );
    });

    const totalCells = Math.ceil((firstDayOfWeekIndex + daysInMonthArray.length) / 7) * 7;
     for (let i = dayCells.length; i < totalCells; i++) {
      dayCells.push(<div key={`empty-next-${i}`} className="p-1 sm:p-2 border border-transparent"></div>);
    }
    
    return dayCells;
  };
  
  const currentMonthOfficialHolidays = daysInMonthArray
    .map(day => getJalaliHolidayInfo(currentJalaliYear, currentJalaliMonth, day))
    .filter(Boolean) as { occasion: string, isPublicHoliday: boolean, day: number }[];

  return (
    <div className="w-full max-w-3xl mx-auto bg-card p-3 sm:p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4 p-2 bg-primary text-primary-foreground rounded-md shadow">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="hover:bg-primary/80">
          <ChevronRight className="h-6 w-6" /> {/* Icon for prev month in RTL */}
        </Button>
        <div className="text-center">
            <h2 className="text-lg sm:text-xl font-bold">
            {JALALI_MONTH_NAMES[currentJalaliMonth - 1]} {currentJalaliYear.toLocaleString('fa-IR')}
            </h2>
            <p className="text-xs opacity-80">{getGregorianMonthRangeDisplay}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNextMonth} className="hover:bg-primary/80">
          <ChevronLeft className="h-6 w-6" /> {/* Icon for next month in RTL */}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <Input 
            type="number" 
            value={inputYear} 
            onChange={(e) => setInputYear(e.target.value)} 
            placeholder="سال شمسی" 
            className="text-center"
            min="1000" max="2000" // Typical Jalali year range
        />
        <Input 
            type="number" 
            value={inputMonth} 
            onChange={(e) => setInputMonth(e.target.value)} 
            placeholder="ماه (۱-۱۲)" 
            className="text-center"
            min="1" max="12"
        />
        <Button onClick={handleGoToInputDate} variant="secondary" className="w-full">برو به تاریخ</Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Button onClick={handleGoToToday} variant="outline" className="flex-1">
          امروز
        </Button>
        <Button onClick={() => {setShowAddBirthdayForm(prev => !prev); setSelectedBirthdayDate(null); setNewBirthdayName(''); setShowAddEventForm(false); setEditingEvent(null);}} variant="outline" className="flex-1">
          <Gift className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
          {showAddBirthdayForm ? 'لغو افزودن تولد' : 'افزودن تولد'}
        </Button>
         <Button onClick={() => {setShowAddEventForm(prev => !prev); setSelectedEventDate(null); setNewEventName(''); setNewEventDescription(''); setEditingEvent(null); setShowAddBirthdayForm(false);}} variant="outline" className="flex-1">
          <CalendarPlus className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
          {showAddEventForm ? (editingEvent ? 'لغو ویرایش رویداد' : 'لغو افزودن رویداد') : 'افزودن رویداد'}
        </Button>
      </div>

      {showAddBirthdayForm && (
        <div className="p-4 border rounded-lg mb-4 space-y-3 bg-secondary/30">
          <h3 className="text-md font-semibold text-primary">فرم افزودن تولد</h3>
          <div>
            <Label htmlFor="birthdayName" className="mb-1 block text-sm">نام صاحب تولد</Label>
            <Input id="birthdayName" type="text" value={newBirthdayName} onChange={(e) => setNewBirthdayName(e.target.value)} placeholder="مثلا: مریم" />
          </div>
          <div>
            <Label className="mb-1 block text-sm">تاریخ تولد (از تقویم بالا انتخاب کنید)</Label>
            <div className="p-2 border rounded-md bg-background text-center h-10 flex items-center justify-center">
              {selectedBirthdayDate && parseJalaliDate(selectedBirthdayDate.year, selectedBirthdayDate.month, selectedBirthdayDate.day)
                ? formatJalaliDateDisplay(parseJalaliDate(selectedBirthdayDate.year, selectedBirthdayDate.month, selectedBirthdayDate.day)!, 'jD jMMMM jYYYY')
                : <span className="text-muted-foreground">تاریخی انتخاب نشده</span>
              }
            </div>
          </div>
          <Button onClick={handleSaveBirthday} disabled={!newBirthdayName.trim() || !selectedBirthdayDate} className="w-full">ذخیره تولد</Button>
        </div>
      )}

      {(showAddEventForm || editingEvent) && (
        <div className="p-4 border rounded-lg mb-4 space-y-3 bg-secondary/30">
          <h3 className="text-md font-semibold text-primary">{editingEvent ? 'فرم ویرایش رویداد' : 'فرم افزودن رویداد'}</h3>
          <div>
            <Label htmlFor="eventName" className="mb-1 block text-sm">نام رویداد</Label>
            <Input id="eventName" type="text" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} placeholder="مثلا: جلسه پروژه" />
          </div>
           <div>
            <Label htmlFor="eventDescription" className="mb-1 block text-sm">توضیحات (اختیاری)</Label>
            <Textarea id="eventDescription" value={newEventDescription} onChange={(e) => setNewEventDescription(e.target.value)} placeholder="جزئیات بیشتر..." rows={2}/>
          </div>
          <div>
            <Label className="mb-1 block text-sm">تاریخ رویداد (از تقویم بالا انتخاب کنید)</Label>
            <div className="p-2 border rounded-md bg-background text-center h-10 flex items-center justify-center">
              {selectedEventDate && parseJalaliDate(selectedEventDate.year, selectedEventDate.month, selectedEventDate.day)
                ? formatJalaliDateDisplay(parseJalaliDate(selectedEventDate.year, selectedEventDate.month, selectedEventDate.day)!, 'jD jMMMM jYYYY')
                : <span className="text-muted-foreground">تاریخی انتخاب نشده</span>
              }
            </div>
          </div>
          <Button onClick={handleSaveEvent} disabled={!newEventName.trim() || !selectedEventDate} className="w-full">
            {editingEvent ? 'ذخیره تغییرات رویداد' : 'ذخیره رویداد'}
          </Button>
        </div>
      )}


      <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-medium text-muted-foreground mb-2">
        {JALALI_DAY_NAMES_LONG.map(dayName => (
          <div key={dayName} className={cn("py-1", dayName === 'جمعه' && "text-orange-600 dark:text-orange-400")}>{dayName}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {renderDayCells()}
      </div>
      
      {(currentMonthOfficialHolidays.length > 0 || birthdaysInCurrentMonth.length > 0 || eventsInCurrentMonth.length > 0) && <Separator className="my-6" />}

      {birthdaysInCurrentMonth.length > 0 && (
         <div className="mb-6">
          <h3 className="text-md sm:text-lg font-semibold text-primary mb-3 flex items-center">
            <Gift className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" /> تولدهای این ماه:
          </h3>
          <ul className="space-y-2">
            {birthdaysInCurrentMonth.map(b => (
              <li key={b.id} className="flex items-center justify-between p-2 border rounded-md bg-background hover:bg-muted/30 text-sm">
                <div className="flex items-center">
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

      {eventsInCurrentMonth.length > 0 && (
         <div className="mb-6">
          <h3 className="text-md sm:text-lg font-semibold text-primary mb-3 flex items-center">
            <CalendarCheck2 className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" /> رویدادهای این ماه:
          </h3>
          <ul className="space-y-2">
            {eventsInCurrentMonth.map(e => (
              <li key={e.id} className="flex items-start justify-between p-3 border rounded-md bg-background hover:bg-muted/30 text-sm">
                <div>
                    <span className="font-semibold text-foreground">{e.name}</span>
                    <span className="text-muted-foreground mx-2 rtl:ml-2 rtl:mr-0 text-xs">
                        ({e.jDay.toLocaleString('fa-IR')} {JALALI_MONTH_NAMES[e.jMonth - 1]})
                    </span>
                    {e.description && <p className="text-xs text-muted-foreground mt-1">{e.description}</p>}
                </div>
                <div className="flex items-center flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => handleEditEvent(e)} aria-label={`ویرایش رویداد ${e.name}`} className="text-blue-600 hover:text-blue-700">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(e.id)} aria-label={`حذف رویداد ${e.name}`} className="text-destructive hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {currentMonthOfficialHolidays.length > 0 && (
         <div className="mt-4 pt-4 border-t">
          <h3 className="text-md sm:text-lg font-semibold text-primary mb-2">مناسبت‌های {JALALI_MONTH_NAMES[currentJalaliMonth - 1]}:</h3>
          <ul className="space-y-1 text-sm text-foreground">
            {currentMonthOfficialHolidays.map(event => (
              <li key={`${event.day}-${event.occasion}`}> 
                <span className="font-medium text-accent">{event.day.toLocaleString('fa-IR')} {JALALI_MONTH_NAMES[currentJalaliMonth - 1]}:</span> {event.occasion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
