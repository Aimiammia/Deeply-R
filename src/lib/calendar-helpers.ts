
// Import the whole module as a namespace
import * as JalaliFNS from 'date-fns-jalali';

import { format as formatGregorianDateFns, parseISO } from 'date-fns';
import { faIR as faIRLocale } from 'date-fns/locale';

export const JALALI_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const JALALI_DAY_NAMES_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
export const JALALI_DAY_NAMES_LONG = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export const parseJalaliDate = (year: number, month: number, day: number): Date | null => {
  try {
    const dateStr = `${String(year).padStart(4, '0')}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    return JalaliFNS.parse(dateStr, 'yyyy/MM/dd', new Date());
  } catch (e) {
    console.error("Error parsing Jalali date:", year, month, day, e);
    return null;
  }
};

export const getDaysInJalaliMonth = (year: number, month: number): number => {
  const date = parseJalaliDate(year, month, 1);
  return date ? JalaliFNS.getDaysInMonth(date) : 30;
};

export const getJalaliMonthFirstDayOfWeek = (year: number, month: number): number => {
  const firstDayOfMonth = parseJalaliDate(year, month, 1);
  if (!firstDayOfMonth) return 0; // Default to Saturday
  return JalaliFNS.getDay(firstDayOfMonth); // 0 for Saturday .. 6 for Friday
};

export const formatJalaliDateDisplay = (date: Date, formatStr: string = 'PPP'): string => {
  try {
    return JalaliFNS.format(date, formatStr, { locale: faIRLocale });
  } catch (e) {
    return "تاریخ نامعتبر";
  }
};

export const getJalaliToday = (): { year: number; month: number; day: number } => {
  const todayGregorian = new Date();
  if (typeof JalaliFNS.gregorianToJalali === 'function') {
    const todayJalaliResult = JalaliFNS.gregorianToJalali(todayGregorian.getFullYear(), todayGregorian.getMonth() + 1, todayGregorian.getDate());
    return { year: todayJalaliResult.jy, month: todayJalaliResult.jm, day: todayJalaliResult.jd };
  }
  console.error("'gregorianToJalali' is not available in 'date-fns-jalali'. Returning fallback.");
  const fallbackDate = JalaliFNS.parse('1400/01/01', 'yyyy/MM/dd', new Date()); // A default Jalali date
  return {
    year: parseInt(JalaliFNS.format(fallbackDate, 'yyyy')),
    month: parseInt(JalaliFNS.format(fallbackDate, 'M')),
    day: parseInt(JalaliFNS.format(fallbackDate, 'd'))
  };
};

export const addJalaliMonths = (date: Date, amount: number): Date => {
  return JalaliFNS.addMonths(date, amount);
};

export const subJalaliMonths = (date: Date, amount: number): Date => {
  return JalaliFNS.subMonths(date, amount);
};

export const isJalaliToday = (year: number, month: number, day: number): boolean => {
  const targetDate = parseJalaliDate(year, month, day);
  return targetDate ? JalaliFNS.isToday(targetDate) : false;
};

export const isSameJalaliDay = (dateLeft: Date | null, dateRight: Date | null): boolean => {
  if (!dateLeft || !dateRight) return false;
  return JalaliFNS.isSameDay(dateLeft, dateRight);
};

export const jalaliToGregorian = (jy: number, jm: number, jd: number): { gy: number, gm: number, gd: number } => {
  if (typeof JalaliFNS.jalaliToGregorian === 'function') {
    return JalaliFNS.jalaliToGregorian(jy, jm, jd);
  }
  console.error("'jalaliToGregorian' is not a function in 'date-fns-jalali'. Check package. Returning fallback.");
  return { gy: 1970, gm: 1, gd: 1 };
};

export const gregorianToJalali = (gy: number, gm: number, gd: number): { jy: number, jm: number, jd: number } => {
  if (typeof JalaliFNS.gregorianToJalali === 'function') {
    return JalaliFNS.gregorianToJalali(gy, gm, gd);
  }
  console.error("'gregorianToJalali' is not a function in 'date-fns-jalali'. Check package. Returning fallback.");
  return { jy: 1348, jm: 10, jd: 11 };
};

// Sample holiday info. In a real app, this would be more dynamic.
export const getJalaliHolidayInfo = (year: number, month: number, day: number): { occasion: string, isPublicHoliday: boolean, day: number } | null => {
  // Khordad 1404 Examples
  if (year === 1404 && month === 3 && day === 14) return { occasion: 'رحلت امام خمینی', isPublicHoliday: true, day };
  if (year === 1404 && month === 3 && day === 15) return { occasion: 'قیام خونین ۱۵ خرداد', isPublicHoliday: true, day };
  if (year === 1404 && month === 3 && day === 16) return { occasion: 'عید سعید قربان', isPublicHoliday: true, day };
  if (year === 1404 && month === 3 && day === 24) return { occasion: 'عید سعید غدیر خم', isPublicHoliday: true, day };
  
  // Placeholder for other holidays - expand as needed
  return null;
};
