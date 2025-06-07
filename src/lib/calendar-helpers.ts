
import {
  format as formatJalali,
  getDaysInMonth as getDaysInJalaliMonthLib,
  getDay as getJalaliDayOfWeekLib, // Returns 0 for Sunday, 1 for Monday...
  addMonths as addJalaliMonthsLib,
  subMonths as subJalaliMonthsLib,
  startOfMonth as startOfJalaliMonthLib,
  parse as parseJalali,
  isToday as isJalaliTodayLib,
  isSameDay as isSameJalaliDayAliased, // Use a different alias internally
} from 'date-fns-jalali';
import { faIR } from 'date-fns-jalali/locale';

export const JALALI_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const JALALI_DAY_NAMES_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
export const JALALI_DAY_NAMES_LONG = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];


// Helper to convert date-fns-jalali getDay output (Sun=0 to Sat=6)
// to our desired format (Sat=0 to Fri=6)
const convertDayOfWeek = (day: number): number => {
  return (day + 1) % 7;
};

export const getDaysInJalaliMonth = (year: number, month: number): number => {
  // date-fns-jalali month is 0-indexed (0 for Farvardin, 11 for Esfand)
  const date = new Date(year, month - 1, 1); // JS Date month is 0-indexed
  return getDaysInJalaliMonthLib(date);
};

export const getJalaliMonthFirstDayOfWeek = (year: number, month: number): number => {
  // date-fns-jalali month is 0-indexed
  const firstDayOfMonth = startOfJalaliMonthLib(new Date(year, month - 1, 1));
  return convertDayOfWeek(getJalaliDayOfWeekLib(firstDayOfMonth));
};

export const formatJalaliDateDisplay = (date: Date, formatStr: string = 'PPP'): string => {
  return formatJalali(date, formatStr, { locale: faIR });
};

export const getJalaliToday = (): { year: number; month: number; day: number } => {
  const today = new Date();
  const year = parseInt(formatJalali(today, 'yyyy', { locale: faIR }));
  const month = parseInt(formatJalali(today, 'M', { locale: faIR })); // 1-indexed
  const day = parseInt(formatJalali(today, 'd', { locale: faIR }));
  return { year, month, day };
};

export const addJalaliMonths = (date: Date, amount: number): Date => {
  return addJalaliMonthsLib(date, amount);
};

export const subJalaliMonths = (date: Date, amount: number): Date => {
  return subJalaliMonthsLib(date, amount);
};

export const isJalaliToday = (year: number, month: number, day: number): boolean => {
  const dateToCheck = parseJalali(`${year}/${month}/${day}`, 'yyyy/M/d', new Date(), { locale: faIR });
  return isJalaliTodayLib(dateToCheck);
};

// Export the correctly aliased function from date-fns-jalali
export const isSameJalaliDay = isSameJalaliDayAliased;

// Mock holidays for Khordad 1404
// In a real app, this would come from an API or a more robust data source
const khordad1404Holidays: { [day: number]: { occasion: string, isPublicHoliday: boolean } } = {
  14: { occasion: 'رحلت امام خمینی', isPublicHoliday: true },
  15: { occasion: 'قیام خونین ۱۵ خرداد', isPublicHoliday: true },
  16: { occasion: 'عید سعید قربان', isPublicHoliday: true }, // (Note: Eid dates are Hijri and might shift slightly)
  // 24th in image seems to be Eid Ghadir, but that's also Hijri dependent
  // For example's sake, I'm hardcoding some.
};

export const getJalaliHolidayInfo = (year: number, month: number, day: number): { occasion: string, isPublicHoliday: boolean } | null => {
  if (year === 1404 && month === 3) { // Khordad
    return khordad1404Holidays[day] || null;
  }
  // Add more holidays for other months/years or implement a proper system
  return null;
};
