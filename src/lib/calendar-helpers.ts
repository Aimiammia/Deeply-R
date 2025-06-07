
import {
  format as formatJalaliOriginal, // Renamed to avoid conflict
  getDaysInMonth as getDaysInJalaliMonthLib,
  getDay as getJalaliDayOfWeekLib, // Returns 0 for Sunday, 1 for Monday...
  addMonths as addJalaliMonthsLib,
  subMonths as subJalaliMonthsLib,
  startOfMonth as startOfJalaliMonthLib,
  parse as parseJalaliOriginal, // Renamed
  isToday as isJalaliTodayLib,
  isSameDay as isSameJalaliDayAliased,
  jalaliToGregorian as jalaliToGregorianLib,
  gregorianToJalali as gregorianToJalaliLib,
} from 'date-fns-jalali';
import { faIR } from 'date-fns-jalali/locale';
import { format as formatGregorian, parseISO as parseISOGregorian, isValid as isValidGregorian } from 'date-fns';


export const JALALI_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const JALALI_DAY_NAMES_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
export const JALALI_DAY_NAMES_LONG = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];


const convertDayOfWeek = (day: number): number => (day + 1) % 7;

export const getDaysInJalaliMonth = (year: number, month: number): number => {
  const date = new Date(year, month - 1, 1);
  return getDaysInJalaliMonthLib(date);
};

export const getJalaliMonthFirstDayOfWeek = (year: number, month: number): number => {
  const firstDayOfMonth = startOfJalaliMonthLib(new Date(year, month - 1, 1));
  return convertDayOfWeek(getJalaliDayOfWeekLib(firstDayOfMonth));
};

export const formatJalaliDateDisplay = (date: Date, formatStr: string = 'PPP'): string => {
  if (!date || !isValidGregorian(date)) return "تاریخ نامعتبر";
  try {
    return formatJalaliOriginal(date, formatStr, { locale: faIR });
  } catch (e) {
    return "خطا در فرمت تاریخ";
  }
};

export const parseJalaliDate = (year: number, month: number, day: number): Date | null => {
  // date-fns-jalali parse expects a string. We'll construct one.
  // And it uses 0-indexed month for parsing from JS Date, but 1-indexed for formatting.
  // To be safe, we'll create a JS date with these jalali components, then format it to string, then parse that string.
  // Or, more simply, create a Gregorian date that date-fns-jalali can work with.
  // The library is a bit inconsistent with month indexing.
  // Let's try using jalaliToGregorian to convert to a JS Date directly
  try {
    const gDate = jalaliToGregorianLib(year, month, day);
    return new Date(gDate.gy, gDate.gm - 1, gDate.gd); // JS Date month is 0-indexed
  } catch (e) {
    return null;
  }
};


export const getJalaliToday = (): { year: number; month: number; day: number } => {
  const today = new Date();
  // Use gregorianToJalali for robust conversion
  const jToday = gregorianToJalaliLib(today.getFullYear(), today.getMonth() + 1, today.getDate());
  return { year: jToday.jy, month: jToday.jm, day: jToday.jd };
};


export const addJalaliMonths = (date: Date, amount: number): Date => addJalaliMonthsLib(date, amount);
export const subJalaliMonths = (date: Date, amount: number): Date => subJalaliMonthsLib(date, amount);

export const isJalaliToday = (year: number, month: number, day: number): boolean => {
  try {
    const dateToCheck = parseJalaliDate(year, month, day);
    if (!dateToCheck) return false;
    return isJalaliTodayLib(dateToCheck);
  } catch (e) {
    return false;
  }
};

export const isSameJalaliDay = isSameJalaliDayAliased;
export const jalaliToGregorian = jalaliToGregorianLib;
export const gregorianToJalali = gregorianToJalaliLib;


const khordad1404Holidays: { [day: number]: { occasion: string, isPublicHoliday: boolean } } = {
  14: { occasion: 'رحلت امام خمینی', isPublicHoliday: true },
  15: { occasion: 'قیام خونین ۱۵ خرداد', isPublicHoliday: true },
  16: { occasion: 'عید سعید قربان', isPublicHoliday: true },
};

export const getJalaliHolidayInfo = (year: number, month: number, day: number): { occasion: string, isPublicHoliday: boolean } | null => {
  if (year === 1404 && month === 3) {
    return khordad1404Holidays[day] || null;
  }
  return null;
};
