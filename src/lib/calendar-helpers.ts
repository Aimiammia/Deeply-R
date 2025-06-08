
import moment from 'jalali-moment';
import { parseISO as parseISOGregorian } from 'date-fns'; // Keep for parseGenericDate
import { format as formatGregorianDateFns } from 'date-fns'; // Keep for PersianCalendarView
import { faIR as faIRLocale } from 'date-fns/locale'; // Keep for PersianCalendarView


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
  // Sample holidays for 1403
  if (year === 1403) {
    if (month === 1) { // Farvardin
      if (day === 1) return { occasion: 'عید نوروز / آغاز سال نو', isPublicHoliday: true, day };
      if (day === 2) return { occasion: 'عید نوروز', isPublicHoliday: true, day };
      if (day === 3) return { occasion: 'عید نوروز', isPublicHoliday: true, day };
      if (day === 4) return { occasion: 'عید نوروز', isPublicHoliday: true, day };
      if (day === 12) return { occasion: 'روز جمهوری اسلامی ایران', isPublicHoliday: true, day };
      if (day === 13) return { occasion: 'روز طبیعت (سیزده بدر)', isPublicHoliday: true, day };
    }
    if (month === 7) { // Mehr
        if (day === 3) return { occasion: 'شهادت امام رضا (ع) (نمونه)', isPublicHoliday: true, day };
        if (day === 11) return { occasion: 'شهادت امام حسن عسکری (ع) (نمونه)', isPublicHoliday: true, day };
    }
    // Add more 1403 holidays as needed
  }

  // Sample holidays for 1404 (example)
  if (year === 1404) {
    if (month === 1 && day === 1) return { occasion: 'عید نوروز (نمونه ۱۴۰۴)', isPublicHoliday: true, day };
    if (month === 1 && day === 13) return { occasion: 'روز طبیعت (سیزده بدر) (نمونه ۱۴۰۴)', isPublicHoliday: true, day };
  }
  // Add more official holidays as needed or integrate with a dynamic API

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

// Keep these exports for potential use by other components, though PersianCalendarView uses its own fns imports now
export { formatGregorianDateFns, faIRLocale };

