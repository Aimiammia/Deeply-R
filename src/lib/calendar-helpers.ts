
import moment from 'jalali-moment';
import { format as formatGregorianDateFns, parseISO as parseISOGregorian } from 'date-fns';
import { faIR as faIRLocale } from 'date-fns/locale';

export const JALALI_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const JALALI_DAY_NAMES_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
// Ensure Saturday is the first day (index 0)
export const JALALI_DAY_NAMES_LONG = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export const parseJalaliDate = (year: number, month: number, day: number): Date | null => {
  try {
    const dateStr = `${String(year).padStart(4, '0')}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    const m = moment(dateStr, 'jYYYY/jMM/jDD');
    return m.isValid() ? m.toDate() : null;
  } catch (e) {
    console.error("Error parsing Jalali date with jalali-moment:", year, month, day, e);
    return null;
  }
};

export const getDaysInJalaliMonth = (year: number, month: number): number => {
  // jalali-moment's jMonth is 0-indexed
  return moment.jDaysInMonth(year, month - 1);
};

export const getJalaliMonthFirstDayOfWeek = (year: number, month: number): number => {
  const dateStr = `${String(year).padStart(4, '0')}/${String(month).padStart(2, '0')}/01`;
  const m = moment(dateStr, 'jYYYY/jMM/jDD');
  // moment().day() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday for fa locale.
  // We want 0 for Saturday, 1 for Sunday, ..., 6 for Friday.
  return (m.day() + 1) % 7;
};

export const formatJalaliDateDisplay = (date: Date, formatStr: string = 'jYYYY/jMM/jDD'): string => {
  try {
    return moment(date).locale('fa').format(formatStr);
  } catch (e) {
    console.error("Error formatting Jalali date with jalali-moment:", date, e);
    return "تاریخ نامعتبر";
  }
};

export const getJalaliToday = (): { year: number; month: number; day: number } => {
  const m = moment();
  return { year: m.jYear(), month: m.jMonth() + 1, day: m.jDate() };
};

export const addJalaliMonths = (date: Date, amount: number): Date => {
  return moment(date).add(amount, 'jMonths').toDate();
};

export const subJalaliMonths = (date: Date, amount: number): Date => {
  return moment(date).subtract(amount, 'jMonths').toDate();
};

export const isJalaliToday = (year: number, month: number, day: number): boolean => {
  const mDate = moment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD');
  return mDate.isValid() ? moment().isSame(mDate, 'jDay') : false;
};

export const isSameJalaliDay = (dateLeft: Date | null, dateRight: Date | null): boolean => {
  if (!dateLeft || !dateRight) return false;
  return moment(dateLeft).isSame(moment(dateRight), 'jDay');
};

export const jalaliToGregorian = (jy: number, jm: number, jd: number): { gy: number, gm: number, gd: number } | null => {
  const m = moment(`${jy}/${jm}/${jd}`, 'jYYYY/jMM/jDD');
  if (!m.isValid()) return null;
  return { gy: m.year(), gm: m.month() + 1, gd: m.date() };
};

export const gregorianToJalali = (gy: number, gm: number, gd: number): { jy: number, jm: number, jd: number } | null => {
  const m = moment({ year: gy, month: gm - 1, day: gd }); // moment months are 0-indexed
  if (!m.isValid()) return null;
  return { jy: m.jYear(), jm: m.jMonth() + 1, jd: m.jDate() };
};

export const getJalaliHolidayInfo = (year: number, month: number, day: number): { occasion: string, isPublicHoliday: boolean, day: number } | null => {
  // Khordad 1404 Examples
  if (year === 1404 && month === 3 && day === 14) return { occasion: 'رحلت امام خمینی', isPublicHoliday: true, day };
  if (year === 1404 && month === 3 && day === 15) return { occasion: 'قیام خونین ۱۵ خرداد', isPublicHoliday: true, day };
  if (year === 1404 && month === 3 && day === 16) return { occasion: 'عید سعید قربان', isPublicHoliday: true, day };
  if (year === 1404 && month === 3 && day === 24) return { occasion: 'عید سعید غدیر خم', isPublicHoliday: true, day };
  
  // Mehr 1403 (Approx current year for testing)
  if (year === 1403 && month === 7 && day === 3) return { occasion: 'شهادت امام رضا (ع)', isPublicHoliday: true, day }; // Example
  if (year === 1403 && month === 7 && day === 11) return { occasion: 'شهادت امام حسن عسکری (ع)', isPublicHoliday: true, day }; // Example

  return null;
};

// Helper for parsing ISO string dates from localStorage or server
export const parseGenericDate = (dateString: string): Date | null => {
    try {
        // Try parsing as ISO (common format from server/localStorage)
        const d = parseISOGregorian(dateString);
        if (!isNaN(d.getTime())) return d;
    } catch (e) {
        // ignore
    }
    // Add other parsing strategies if needed
    console.warn("Could not parse date string:", dateString);
    return null;
};
