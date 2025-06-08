
import {
  format as formatJalali,
  parse as parseJalali,
  getDaysInMonth as getDaysInJalaliMonthNative,
  getDay as getJalaliDayOfWeek, // 0 (Shanbeh) to 6 (Jomeh)
  isToday as isJalaliTodayNative,
  addMonths as addJalaliMonthsNative,
  subMonths as subJalaliMonthsNative,
  startOfMonth as startOfJalaliMonth,
  isSameDay as isSameJalaliDayNative,
  jalaliToGregorian as jtg,
  gregorianToJalali as gtj,
} from 'date-fns-jalali';
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
    const dateStr = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    // Ensure the reference date for parsing is consistent, e.g., new Date() or a fixed date.
    // Using new Date() is fine for parsing a full date string like yyyy/MM/dd.
    return parseJalali(dateStr, 'yyyy/MM/dd', new Date());
  } catch (e) {
    console.error("Error parsing Jalali date:", year, month, day, e);
    return null;
  }
};

export const getDaysInJalaliMonth = (year: number, month: number): number => {
  const date = parseJalaliDate(year, month, 1);
  return date ? getDaysInJalaliMonthNative(date) : 30;
};

export const getJalaliMonthFirstDayOfWeek = (year: number, month: number): number => {
  const firstDayOfMonth = parseJalaliDate(year, month, 1);
  if (!firstDayOfMonth) return 0; // Default to Saturday
  return getJalaliDayOfWeek(firstDayOfMonth); // 0 for Saturday .. 6 for Friday
};

export const formatJalaliDateDisplay = (date: Date, formatStr: string = 'PPP'): string => {
  try {
    return formatJalali(date, formatStr, { locale: faIRLocale });
  } catch (e) {
    return "تاریخ نامعتبر";
  }
};

export const getJalaliToday = (): { year: number; month: number; day: number } => {
  const todayGregorian = new Date();
  const todayJalaliResult = gtj(todayGregorian.getFullYear(), todayGregorian.getMonth() + 1, todayGregorian.getDate());
  return { year: todayJalaliResult.jy, month: todayJalaliResult.jm, day: todayJalaliResult.jd };
};

export const addJalaliMonths = (date: Date, amount: number): Date => {
  return addJalaliMonthsNative(date, amount);
};

export const subJalaliMonths = (date: Date, amount: number): Date => {
  return subJalaliMonthsNative(date, amount);
};

export const isJalaliToday = (year: number, month: number, day: number): boolean => {
  const targetDate = parseJalaliDate(year, month, day);
  return targetDate ? isJalaliTodayNative(targetDate) : false;
};

export const isSameJalaliDay = (dateLeft: Date | null, dateRight: Date | null): boolean => {
  if (!dateLeft || !dateRight) return false;
  return isSameJalaliDayNative(dateLeft, dateRight);
};

export const jalaliToGregorian = (jy: number, jm: number, jd: number): { gy: number, gm: number, gd: number } => {
  return jtg(jy, jm, jd);
};

export const gregorianToJalali = (gy: number, gm: number, gd: number): { jy: number, jm: number, jd: number } => {
  return gtj(gy, gm, gd);
};

// Sample holiday info. In a real app, this would be more dynamic.
export const getJalaliHolidayInfo = (year: number, month: number, day: number): { occasion: string, isPublicHoliday: boolean } | null => {
  // Khordad 1404 Examples
  if (year === 1404 && month === 3 && day === 14) return { occasion: 'رحلت امام خمینی', isPublicHoliday: true };
  if (year === 1404 && month === 3 && day === 15) return { occasion: 'قیام خونین ۱۵ خرداد', isPublicHoliday: true };
  if (year === 1404 && month === 3 && day === 16) return { occasion: 'عید سعید قربان', isPublicHoliday: true };
  if (year === 1404 && month === 3 && day === 24) return { occasion: 'عید سعید غدیر خم', isPublicHoliday: true };
  
  // Placeholder for other holidays - expand as needed
  return null;
};
