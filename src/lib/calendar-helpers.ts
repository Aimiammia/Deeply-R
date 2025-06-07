
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

// Import gregorianToJalali and jalaliToGregorian using their defined subpath exports.
// This relies on the 'exports' map in date-fns-jalali's package.json
// to resolve to their respective ESM files (e.g., date-fns-jalali/esm/gregorianToJalali.js).
import gregorianToJalali from 'date-fns-jalali/gregorianToJalali';
import jalaliToGregorian from 'date-fns-jalali/jalaliToGregorian';

import { faIR } from 'date-fns-jalali/locale';
import { format as formatGregorian, parseISO as parseISOGregorian, isValid as isValidGregorian } from 'date-fns';

export const JALALI_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const JALALI_DAY_NAMES_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
export const JALALI_DAY_NAMES_LONG = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

const convertDayOfWeek = (jsDayOfWeek: number): number => (jsDayOfWeek + 1) % 7;

export const parseJalaliDate = (year: number, month: number, day: number): Date | null => {
  try {
    const gDate = jalaliToGregorian(year, month, day);
    return new Date(gDate.gy, gDate.gm - 1, gDate.gd);
  } catch (e) {
    console.error("Error parsing Jalali date:", year, month, day, e);
    return null;
  }
};

export const getDaysInJalaliMonthLocal = (year: number, month: number): number => {
  const dateForMonth = parseJalaliDate(year, month, 1);
  if (!dateForMonth) return 30;
  return getDaysInMonth(dateForMonth);
};

export const getJalaliMonthFirstDayOfWeek = (year: number, month: number): number => {
  const firstDayOfMonthJalali = parseJalaliDate(year, month, 1);
  if (!firstDayOfMonthJalali) return 0;
  const firstDayObject = startOfMonth(firstDayOfMonthJalali);
  return convertDayOfWeek(getDay(firstDayObject));
};

export const formatJalaliDateDisplay = (date: Date, formatStr: string = 'PPP'): string => {
  if (!date || !isValidGregorian(date)) return "تاریخ نامعتبر";
  try {
    return format(date, formatStr, { locale: faIR });
  } catch (e) {
    console.error("Error formatting Jalali date:", e);
    return "خطا در فرمت تاریخ";
  }
};

export const getJalaliToday = (): { year: number; month: number; day: number } => {
  const todayGregorian = new Date();
  const jToday = gregorianToJalali(todayGregorian.getFullYear(), todayGregorian.getMonth() + 1, todayGregorian.getDate());
  return { year: jToday.jy, month: jToday.jm, day: jToday.jd };
};

export { addMonths as addJalaliMonths, subMonths as subJalaliMonths };

export const isJalaliTodayLocal = (year: number, month: number, day: number): boolean => {
  try {
    const dateToCheck = parseJalaliDate(year, month, day);
    if (!dateToCheck) return false;
    return isToday(dateToCheck);
  } catch (e) {
    return false;
  }
};

export { isSameDay as isSameJalaliDay };

// Re-exporting the conversion functions for use elsewhere, ensuring they are the correctly imported ones.
// The original file already re-exports jalaliToGregorian and gregorianToJalali if they are imported.
// No change needed here if the imports above are correct.

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
