
// Import standard utility functions as named exports from the main entry point.
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
} from 'date-fns-jalali';

// Import gregorianToJalali and jalaliToGregorian from their specific ESM submodules,
// explicitly pointing to the .js files.
// This is an attempt to bypass potential issues with package.json "exports" map resolution.
import gregorianToJalali from 'date-fns-jalali/esm/gregorianToJalali.js';
import jalaliToGregorian from 'date-fns-jalali/esm/jalaliToGregorian.js';

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
const convertDayOfWeek = (jsDayOfWeek: number): number => (jsDayOfWeek + 1) % 7;

// Wrapper for parsing Jalali year/month/day to a JS Date object
export const parseJalaliDate = (year: number, month: number, day: number): Date | null => {
  try {
    // gregorianToJalali and jalaliToGregorian expect 1-indexed months
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
  if (!dateForMonth) return 30; // Fallback
  return getDaysInMonth(dateForMonth);
};

// Wrapper for getJalaliMonthFirstDayOfWeek
export const getJalaliMonthFirstDayOfWeek = (year: number, month: number): number => {
  const firstDayOfMonthJalali = parseJalaliDate(year, month, 1);
  if (!firstDayOfMonthJalali) return 0; // Fallback
  const firstDayObject = startOfMonth(firstDayOfMonthJalali);
  return convertDayOfWeek(getDay(firstDayObject));
};

// Wrapper for format from date-fns-jalali
export const formatJalaliDateDisplay = (date: Date, formatStr: string = 'PPP'): string => {
  if (!date || !isValidGregorian(date)) return "تاریخ نامعتبر";
  try {
    return format(date, formatStr, { locale: faIR });
  } catch (e) {
    return "خطا در فرمت تاریخ";
  }
};

// Wrapper for getJalaliToday
export const getJalaliToday = (): { year: number; month: number; day: number } => {
  const todayGregorian = new Date();
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
    return isToday(dateToCheck);
  } catch (e) {
    return false;
  }
};

// Re-export isSameDay from date-fns-jalali
export { isSameDay as isSameJalaliDay };

// Re-export the conversion functions that were imported by specific path
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
