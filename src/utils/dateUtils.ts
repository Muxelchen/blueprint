// Complete date utilities for frontend
export type DateFormat = 'ISO' | 'US' | 'EU' | 'relative' | 'custom';
export type TimeUnit =
  | 'milliseconds'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'months'
  | 'years';

// Date creation and parsing
export const createDate = (input?: string | number | Date): Date => {
  if (!input) return new Date();
  return new Date(input);
};

export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (!isNaN(date.getTime())) return date;

  // Custom parsing for common formats
  const formats = [
    /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
    /^(\d{2})\/(\d{2})\/(\d{4})$/, // MM/DD/YYYY
    /^(\d{2})-(\d{2})-(\d{4})$/, // DD-MM-YYYY
  ];

  for (const regex of formats) {
    const match = dateString.match(regex);
    if (match) {
      const [, part1, part2, part3] = match;
      // Try different interpretations
      const attempts = [
        new Date(parseInt(part3), parseInt(part1) - 1, parseInt(part2)),
        new Date(parseInt(part1), parseInt(part2) - 1, parseInt(part3)),
      ];

      for (const attempt of attempts) {
        if (!isNaN(attempt.getTime())) return attempt;
      }
    }
  }

  return null;
};

// Date formatting
export const formatDateString = (
  date: Date | string | number,
  format: DateFormat = 'ISO',
  locale = 'en-US'
): string => {
  const d = createDate(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  switch (format) {
    case 'ISO':
      return d.toISOString().split('T')[0];
    case 'US':
      return d.toLocaleDateString('en-US');
    case 'EU':
      return d.toLocaleDateString('en-GB');
    case 'relative':
      return formatRelativeTime(d, locale);
    default:
      return d.toLocaleDateString(locale);
  }
};

// Relative time formatting
export const formatRelativeTime = (date: Date | string | number, locale = 'en-US'): string => {
  const d = createDate(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const intervals = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      return rtf.format(
        diffInSeconds > 0 ? -count : count,
        interval.unit as Intl.RelativeTimeFormatUnit
      );
    }
  }

  return rtf.format(0, 'second');
};

// Date arithmetic
export const addTime = (date: Date | string | number, amount: number, unit: TimeUnit): Date => {
  const d = createDate(date);

  switch (unit) {
    case 'milliseconds':
      return new Date(d.getTime() + amount);
    case 'seconds':
      return new Date(d.getTime() + amount * 1000);
    case 'minutes':
      return new Date(d.getTime() + amount * 60 * 1000);
    case 'hours':
      return new Date(d.getTime() + amount * 60 * 60 * 1000);
    case 'days':
      return new Date(d.getTime() + amount * 24 * 60 * 60 * 1000);
    case 'weeks':
      return new Date(d.getTime() + amount * 7 * 24 * 60 * 60 * 1000);
    case 'months':
      const newDate = new Date(d);
      newDate.setMonth(d.getMonth() + amount);
      return newDate;
    case 'years':
      const yearDate = new Date(d);
      yearDate.setFullYear(d.getFullYear() + amount);
      return yearDate;
    default:
      return d;
  }
};

export const subtractTime = (
  date: Date | string | number,
  amount: number,
  unit: TimeUnit
): Date => {
  return addTime(date, -amount, unit);
};

// Date comparison
export const isSameDay = (
  date1: Date | string | number,
  date2: Date | string | number
): boolean => {
  const d1 = createDate(date1);
  const d2 = createDate(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const isBefore = (date1: Date | string | number, date2: Date | string | number): boolean => {
  return createDate(date1).getTime() < createDate(date2).getTime();
};

export const isAfter = (date1: Date | string | number, date2: Date | string | number): boolean => {
  return createDate(date1).getTime() > createDate(date2).getTime();
};

export const isBetween = (
  date: Date | string | number,
  start: Date | string | number,
  end: Date | string | number
): boolean => {
  const d = createDate(date);
  const s = createDate(start);
  const e = createDate(end);

  return d.getTime() >= s.getTime() && d.getTime() <= e.getTime();
};

// Date range utilities
export const getDaysDifference = (
  date1: Date | string | number,
  date2: Date | string | number
): number => {
  const d1 = createDate(date1);
  const d2 = createDate(date2);

  const diffInMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
};

export const getWeeksDifference = (
  date1: Date | string | number,
  date2: Date | string | number
): number => {
  return Math.floor(getDaysDifference(date1, date2) / 7);
};

export const getMonthsDifference = (
  date1: Date | string | number,
  date2: Date | string | number
): number => {
  const d1 = createDate(date1);
  const d2 = createDate(date2);

  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
};

// Date range generation
export const generateDateRange = (
  start: Date | string | number,
  end: Date | string | number,
  step: number = 1,
  unit: TimeUnit = 'days'
): Date[] => {
  const startDate = createDate(start);
  const endDate = createDate(end);
  const dates: Date[] = [];

  let current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current = addTime(current, step, unit);
  }

  return dates;
};

// Business day utilities
export const isWeekend = (date: Date | string | number): boolean => {
  const d = createDate(date);
  const dayOfWeek = d.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
};

export const isBusinessDay = (date: Date | string | number): boolean => {
  return !isWeekend(date);
};

export const getNextBusinessDay = (date: Date | string | number): Date => {
  let nextDay = addTime(date, 1, 'days');

  while (isWeekend(nextDay)) {
    nextDay = addTime(nextDay, 1, 'days');
  }

  return nextDay;
};

export const getPreviousBusinessDay = (date: Date | string | number): Date => {
  let prevDay = subtractTime(date, 1, 'days');

  while (isWeekend(prevDay)) {
    prevDay = subtractTime(prevDay, 1, 'days');
  }

  return prevDay;
};

// Calendar utilities
export const getStartOfMonth = (date: Date | string | number): Date => {
  const d = createDate(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

export const getEndOfMonth = (date: Date | string | number): Date => {
  const d = createDate(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
};

export const getStartOfWeek = (date: Date | string | number, startOfWeek = 0): Date => {
  const d = createDate(date);
  const day = d.getDay();
  const diff = (day < startOfWeek ? 7 : 0) + day - startOfWeek;

  return subtractTime(d, diff, 'days');
};

export const getEndOfWeek = (date: Date | string | number, startOfWeek = 0): Date => {
  return addTime(getStartOfWeek(date, startOfWeek), 6, 'days');
};

export const getDaysInMonth = (date: Date | string | number): number => {
  const d = createDate(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
};

export const getWeekOfYear = (date: Date | string | number): number => {
  const d = createDate(date);
  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;

  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Timezone utilities
export const convertToTimezone = (date: Date | string | number, timezone: string): Date => {
  const d = createDate(date);

  try {
    // Use the provided timezone to format the date
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    // Get date parts in target timezone
    const parts = formatter.formatToParts(d);
    const dateParts: Record<string, number> = {};

    // Extract values from parts
    parts.forEach(part => {
      if (['year', 'month', 'day', 'hour', 'minute', 'second'].includes(part.type)) {
        dateParts[part.type] = parseInt(part.value, 10);
      }
    });

    // Adjust month (JavaScript months are 0-based)
    if (dateParts.month) dateParts.month -= 1;

    // Create new date with timezone-adjusted values
    return new Date(
      dateParts.year || d.getFullYear(),
      dateParts.month !== undefined ? dateParts.month : d.getMonth(),
      dateParts.day || d.getDate(),
      dateParts.hour || d.getHours(),
      dateParts.minute || d.getMinutes(),
      dateParts.second || d.getSeconds()
    );
  } catch {
    return d;
  }
};

export const getTimezoneOffset = (timezone: string): number => {
  try {
    const now = new Date();
    const localOffset = now.getTimezoneOffset();
    const targetDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const targetOffset = (now.getTime() - targetDate.getTime()) / 60000;

    return targetOffset - localOffset;
  } catch {
    return 0;
  }
};

export const formatTimezoneOffset = (offsetMinutes: number): string => {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absOffset = Math.abs(offsetMinutes);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;

  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Age calculation
export const calculateAge = (birthDate: Date | string | number): number => {
  const birth = createDate(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

// Utility constants
export const MILLISECONDS_IN_SECOND = 1000;
export const MILLISECONDS_IN_MINUTE = 60 * 1000;
export const MILLISECONDS_IN_HOUR = 60 * 60 * 1000;
export const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
export const MILLISECONDS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const SHORT_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Date validation
export const isValidDate = (date: any): boolean => {
  const d = createDate(date);
  return !isNaN(d.getTime());
};

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export default {
  createDate,
  parseDate,
  formatDateString,
  formatRelativeTime,
  addTime,
  subtractTime,
  isSameDay,
  isBefore,
  isAfter,
  isBetween,
  getDaysDifference,
  getWeeksDifference,
  getMonthsDifference,
  generateDateRange,
  isWeekend,
  isBusinessDay,
  getNextBusinessDay,
  getPreviousBusinessDay,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfWeek,
  getEndOfWeek,
  getDaysInMonth,
  getWeekOfYear,
  convertToTimezone,
  getTimezoneOffset,
  formatTimezoneOffset,
  calculateAge,
  isValidDate,
  isLeapYear,
};
