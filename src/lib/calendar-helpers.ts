
// Import utility functions from date-fns-jalali using their defined subpath exports.
// This relies on the 'exports' map in date-fns-jalali's package.json
// to resolve to their respective ESM files.
import format from 'date-fns-jalali/format';
import getDaysInMonth from 'date-fns-jalali/getDaysInMonth';
import getDay from 'date-fns-jalali/getDay';
import addMonths from 'date-fns-jalali/addMonths';
import subMonths from 'date-fns-jalali/subMonths';
import startOfMonth from 'date-fns-jalali/startOfMonth';
import parse from 'date-fns-jalali/parse';
import isToday from 'date-fns-jalali/isToday';
import isSameDay from 'date-fns-jalali/isSameDay';

// Import gregorianToJalali and jalaliToGregorian using their subpath exports.
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
    // Ensure month is 1-indexed for jalaliToGregorian
    const gDate = jalaliToGregorian(year, month, day);
    return new Date(gDate.gy, gDate.gm - 1, gDate.gd); // month for Date constructor is 0-indexed
  } catch (e) {
    console.error("Error parsing Jalali date:", year, month, day, e);
    return null;
  }
};

// Renamed to avoid conflict with imported getDaysInMonth
export const getDaysInJalaliMonth = (year: number, month: number): number => {
  const dateForMonth = parseJalaliDate(year, month, 1);
  if (!dateForMonth) return 30; // Fallback
  return getDaysInMonth(dateForMonth);
};

export const getJalaliMonthFirstDayOfWeek = (year: number, month: number): number => {
  const firstDayOfMonthJalali = parseJalaliDate(year, month, 1);
  if (!firstDayOfMonthJalali) return 0; // Saturday as fallback
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
  // Ensure month is 1-indexed for gregorianToJalali
  const jToday = gregorianToJalali(todayGregorian.getFullYear(), todayGregorian.getMonth() + 1, todayGregorian.getDate());
  return { year: jToday.jy, month: jToday.jm, day: jToday.jd };
};

// Re-exporting with potentially clearer names if used elsewhere, or just use them directly.
export { addMonths as addJalaliMonths, subMonths as subJalaliMonths };

// Renamed to avoid conflict with imported isToday
export const isJalaliToday = (year: number, month: number, day: number): boolean => {
  try {
    const dateToCheck = parseJalaliDate(year, month, day);
    if (!dateToCheck) return false;
    return isToday(dateToCheck);
  } catch (e) {
    return false;
  }
};

export { isSameDay as isSameJalaliDay };


const khordad1404Holidays: { [day: number]: { occasion: string, isPublicHoliday: boolean } } = {
  14: { occasion: 'رحلت امام خمینی', isPublicHoliday: true },
  15: { occasion: 'قیام خونین ۱۵ خرداد', isPublicHoliday: true },
  16: { occasion: 'عید سعید قربان', isPublicHoliday: true },
  // Note: Khordad 1404 (June 2025) - Ghadir might be around 24th or 25th Khordad
  // For example purposes, let's assume 24th
};

export const getJalaliHolidayInfo = (year: number, month: number, day: number): { occasion: string, isPublicHoliday: boolean } | null => {
  if (year === 1404 && month === 3) { // Khordad is the 3rd month
    if (day === 24 && month === 3) { // Example for Ghadir
        return { occasion: 'عید سعید غدیر خم (نمونه)', isPublicHoliday: true}
    }
    return khordad1404Holidays[day] || null;
  }
  // Add more holidays for other months/years if needed
  return null;
};

// Exporting jalaliToGregorian and gregorianToJalali so they can be used by other modules if needed.
// This doesn't change their import within this file, just makes them available externally.
export { jalaliToGregorian, gregorianToJalali };
