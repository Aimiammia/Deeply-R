// This file is intentionally modified to prevent "Module not found" errors
// as the 'date-fns-jalali' package has been removed.
// For a complete cleanup, this file and related calendar components should be deleted.

export const JALALI_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const JALALI_DAY_NAMES_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
export const JALALI_DAY_NAMES_LONG = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export const parseJalaliDate = (year: number, month: number, day: number): Date | null => {
  // Stub implementation
  console.warn("parseJalaliDate is stubbed due to 'date-fns-jalali' removal.");
  return new Date(); // Return a generic date to avoid crashes, not functionally correct
};

export const getDaysInJalaliMonth = (year: number, month: number): number => {
  // Stub implementation
  console.warn("getDaysInJalaliMonth is stubbed due to 'date-fns-jalali' removal.");
  return 30; // Return a default value
};

export const getJalaliMonthFirstDayOfWeek = (year: number, month: number): number => {
  // Stub implementation
  console.warn("getJalaliMonthFirstDayOfWeek is stubbed due to 'date-fns-jalali' removal.");
  return 0; // Saturday as fallback
};

export const formatJalaliDateDisplay = (date: Date, formatStr: string = 'PPP'): string => {
  // Stub implementation
  console.warn("formatJalaliDateDisplay is stubbed due to 'date-fns-jalali' removal.");
  return "تاریخ تقویم (جایگزین)";
};

export const getJalaliToday = (): { year: number; month: number; day: number } => {
  // Stub implementation
  console.warn("getJalaliToday is stubbed due to 'date-fns-jalali' removal.");
  return { year: 1400, month: 1, day: 1 }; // Return default values
};

export const addJalaliMonths = (date: Date, amount: number): Date => {
  // Stub implementation
  console.warn("addJalaliMonths is stubbed due to 'date-fns-jalali' removal.");
  return date;
};

export const subJalaliMonths = (date: Date, amount: number): Date => {
  // Stub implementation
  console.warn("subJalaliMonths is stubbed due to 'date-fns-jalali' removal.");
  return date;
};

export const isJalaliToday = (year: number, month: number, day: number): boolean => {
  // Stub implementation
  console.warn("isJalaliToday is stubbed due to 'date-fns-jalali' removal.");
  return false;
};

export const isSameJalaliDay = (dateLeft: Date, dateRight: Date): boolean => {
  // Stub implementation
  console.warn("isSameJalaliDay is stubbed due to 'date-fns-jalali' removal.");
  return false;
};

export const getJalaliHolidayInfo = (year: number, month: number, day: number): { occasion: string, isPublicHoliday: boolean } | null => {
  // Stub implementation
  console.warn("getJalaliHolidayInfo is stubbed due to 'date-fns-jalali' removal.");
  return null;
};

export const jalaliToGregorian = (jy: number, jm: number, jd: number): { gy: number, gm: number, gd: number } => {
  // Stub implementation
  console.warn("jalaliToGregorian is stubbed due to 'date-fns-jalali' removal.");
  return { gy: 2000, gm: 1, gd: 1 }; // Return default values
};

export const gregorianToJalali = (gy: number, gm: number, gd: number): { jy: number, jm: number, jd: number } => {
  // Stub implementation
  console.warn("gregorianToJalali is stubbed due to 'date-fns-jalali' removal.");
  return { jy: 1400, jm: 1, jd: 1 }; // Return default values
};
