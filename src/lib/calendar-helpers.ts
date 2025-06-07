
import * as jalaliFns from 'date-fns-jalali';
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

export const getDaysInJalaliMonth = (year: number, month: number): number => {
  const dateForMonth = parseJalaliDate(year, month, 1);
  if (!dateForMonth) return 30; 
  return jalaliFns.getDaysInMonth(dateForMonth);
};

export const getJalaliMonthFirstDayOfWeek = (year: number, month: number): number => {
  const firstDayOfMonthJalali = parseJalaliDate(year, month, 1);
  if (!firstDayOfMonthJalali) return 0; 

  const firstDayObject = jalaliFns.startOfMonth(firstDayOfMonthJalali);
  return convertDayOfWeek(jalaliFns.getDay(firstDayObject));
};

export const formatJalaliDateDisplay = (date: Date, formatStr: string = 'PPP'): string => {
  if (!date || !isValidGregorian(date)) return "تاریخ نامعتبر";
  try {
    return jalaliFns.format(date, formatStr, { locale: faIR });
  } catch (e) {
    return "خطا در فرمت تاریخ";
  }
};

export const parseJalaliDate = (year: number, month: number, day: number): Date | null => {
  try {
    const gDate = jalaliFns.jalaliToGregorian(year, month, day);
    return new Date(gDate.gy, gDate.gm - 1, gDate.gd);
  } catch (e) {
    console.error("Error parsing Jalali date:", year, month, day, e);
    return null;
  }
};


export const getJalaliToday = (): { year: number; month: number; day: number } => {
  const todayGregorian = new Date();
  const jToday = jalaliFns.gregorianToJalali(todayGregorian.getFullYear(), todayGregorian.getMonth() + 1, todayGregorian.getDate());
  return { year: jToday.jy, month: jToday.jm, day: jToday.jd };
};


export const addJalaliMonths = jalaliFns.addMonths;
export const subJalaliMonths = jalaliFns.subMonths;

export const isJalaliToday = (year: number, month: number, day: number): boolean => {
  try {
    const dateToCheck = parseJalaliDate(year, month, day);
    if (!dateToCheck) return false;
    return jalaliFns.isToday(dateToCheck);
  } catch (e) {
    return false;
  }
};

export const isSameJalaliDay = jalaliFns.isSameDay;

// Explicitly export the core conversion functions under the desired names
export const jalaliToGregorian = jalaliFns.jalaliToGregorian;
export const gregorianToJalali = jalaliFns.gregorianToJalali;


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
