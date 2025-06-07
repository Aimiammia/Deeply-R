
// Attempt to import ALL functions, including converters, as named exports from the main entry point.
import {
  format,
  getDaysInMonth,
  getDay,
  addMonths,
  subMonths,
  startOfMonth,
  parse,
  isToday,
  isSameDay,
  jalaliToGregorian, // Direct named import
  gregorianToJalali, // Direct named import
} from 'date-fns-jalali';

import { faIR } from 'date-fns-jalali/locale';
import { format as formatGregorian, parseISO as parseISOGregorian, isValid as isValidGregorian } from 'date-fns';

export const JALALI_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const JALALI_DAY_NAMES_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
export const JALALI_DAY_NAMES_LONG = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

// date-fns getDay returns 0 for Sunday. Jalali calendar usually starts with Saturday as 0.
// This helper converts: Saturday (6 in JS) -> 0, ..., Friday (5 in JS) -> 6
const convertDayOfWeek = (day: number): number => (day + 1) % 7;

// Wrapper for parsing Jalali year/month/day to a JS Date object
// This needs to be defined before it's used by getDaysInJalaliMonth and getJalaliMonthFirstDayOfWeek
export const parseJalaliDate = (year: number, month: number, day: number): Date | null => {
  try {
    // Directly use imported jalaliToGregorian
    const gDate = jalaliToGregorian(year, month, day);
    return new Date(gDate.gy, gDate.gm - 1, gDate.gd); // JS Date month is 0-indexed
  } catch (e) {
    console.error("Error parsing Jalali date:", year, month, day, e);
    return null;
  }
};

// Wrapper for getDaysInMonth from date-fns-jalali
export const getDaysInJalaliMonth = (year: number, month: number): number => {
  const dateForMonth = parseJalaliDate(year, month, 1);
  if (!dateForMonth) return 30;
  return getDaysInMonth(dateForMonth); // Directly use imported getDaysInMonth
};

// Wrapper for getJalaliMonthFirstDayOfWeek
export const getJalaliMonthFirstDayOfWeek = (year: number, month: number): number => {
  const firstDayOfMonthJalali = parseJalaliDate(year, month, 1);
  if (!firstDayOfMonthJalali) return 0;
  const firstDayObject = startOfMonth(firstDayOfMonthJalali); // Directly use imported startOfMonth
  return convertDayOfWeek(getDay(firstDayObject)); // Directly use imported getDay
};

// Wrapper for format from date-fns-jalali
export const formatJalaliDateDisplay = (date: Date, formatStr: string = 'PPP'): string => {
  if (!date || !isValidGregorian(date)) return "تاریخ نامعتبر";
  try {
    return format(date, formatStr, { locale: faIR }); // Directly use imported format
  } catch (e) {
    return "خطا در فرمت تاریخ";
  }
};

// Wrapper for getJalaliToday
export const getJalaliToday = (): { year: number; month: number; day: number } => {
  const todayGregorian = new Date();
  // Directly use imported gregorianToJalali
  const jToday = gregorianToJalali(todayGregorian.getFullYear(), todayGregorian.getMonth() + 1, todayGregorian.getDate());
  return { year: jToday.jy, month: jToday.jm, day: jToday.jd };
};

// Re-export addMonths and subMonths with aliases if desired, or directly
export { addMonths as addJalaliMonths, subMonths as subJalaliMonths };

// Wrapper for isToday from date-fns-jalali
export const isJalaliToday = (year: number, month: number, day: number): boolean => {
  try {
    const dateToCheck = parseJalaliDate(year, month, day);
    if (!dateToCheck) return false;
    return isToday(dateToCheck); // Directly use imported isToday
  } catch (e) {
    return false;
  }
};

// Re-export isSameDay from date-fns-jalali, possibly with an alias
export { isSameDay as isSameJalaliDay };

// Re-export the conversion functions if they were successfully imported by name
// These are already in scope if imported by name, but explicit export ensures availability.
export { jalaliToGregorian, gregorianToJalali };


// Hardcoded holidays (example)
const khordad1404Holidays: { [day: number]: { occasion: string, isPublicHoliday: boolean } } = {
  14: { occasion: 'رحلت امام خمینی', isPublicHoliday: true },
  15: { occasion: 'قیام خونین ۱۵ خرداد', isPublicHoliday: true },
  16: { occasion: 'عید سعید قربان', isPublicHoliday: true },
};

export const getJalaliHolidayInfo = (year: number, month: number, day: number): { occasion: string, isPublicHoliday: boolean } | null => {
  if (year === 1404 && month === 3) { // Khordad
    if (day === 24 && month === 3) {
        return { occasion: 'عید سعید غدیر خم (نمونه)', isPublicHoliday: true}
    }
    return khordad1404Holidays[day] || null;
  }
  return null;
};
