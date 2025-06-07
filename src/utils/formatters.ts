// Complete data formatting utilities for frontend
export type FormatType =
  | 'currency'
  | 'percentage'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime'
  | 'fileSize'
  | 'duration';

export interface FormatOptions {
  locale?: string;
  currency?: string;
  decimals?: number;
  useGrouping?: boolean;
  timezone?: string;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  prefix?: string;
  suffix?: string;
}

// Number formatting
export const formatNumber = (value: number | string, options: FormatOptions = {}): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';

  const { locale = 'en-US', decimals = 2, useGrouping = true, prefix = '', suffix = '' } = options;

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping,
  }).format(num);

  return `${prefix}${formatted}${suffix}`;
};

// Currency formatting
export const formatCurrency = (value: number | string, options: FormatOptions = {}): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0.00';

  const { locale = 'en-US', currency = 'USD', decimals = 2 } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

// Percentage formatting
export const formatPercentage = (value: number | string, options: FormatOptions = {}): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0%';

  const { locale = 'en-US', decimals = 1 } = options;

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num / 100);
};

// Date formatting
export const formatDate = (value: Date | string | number, options: FormatOptions = {}): string => {
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const { locale = 'en-US', dateStyle = 'medium', timezone } = options;

  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeZone: timezone,
  }).format(date);
};

// Time formatting
export const formatTime = (value: Date | string | number, options: FormatOptions = {}): string => {
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Invalid Time';

  const { locale = 'en-US', timeStyle = 'medium', timezone } = options;

  return new Intl.DateTimeFormat(locale, {
    timeStyle,
    timeZone: timezone,
  }).format(date);
};

// DateTime formatting
export const formatDateTime = (
  value: Date | string | number,
  options: FormatOptions = {}
): string => {
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Invalid DateTime';

  const { locale = 'en-US', dateStyle = 'medium', timeStyle = 'short', timezone } = options;

  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle,
    timeZone: timezone,
  }).format(date);
};

// File size formatting
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Duration formatting
export const formatDuration = (
  milliseconds: number,
  format: 'short' | 'long' = 'short'
): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (format === 'long') {
    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours % 24 > 0) parts.push(`${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`);
    if (minutes % 60 > 0) parts.push(`${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`);
    if (seconds % 60 > 0) parts.push(`${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`);

    return parts.length > 0 ? parts.join(', ') : '0 seconds';
  }

  // Short format
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

// Relative time formatting
export const formatRelativeTime = (date: Date | string | number, locale = 'en-US'): string => {
  const targetDate = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(-diffInHours, 'hour');
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(-diffInDays, 'day');
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(-diffInMonths, 'month');
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return rtf.format(-diffInYears, 'year');
};

// Phone number formatting
export const formatPhoneNumber = (phoneNumber: string, format = 'US'): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (format === 'US') {
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
  }

  return phoneNumber; // Return original if can't format
};

// Credit card formatting
export const formatCreditCard = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ').trim();
};

// Social Security Number formatting
export const formatSSN = (ssn: string): string => {
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
  }
  return ssn;
};

// Generic formatter function
export const formatValue = (value: any, type: FormatType, options: FormatOptions = {}): string => {
  try {
    switch (type) {
      case 'currency':
        return formatCurrency(value, options);
      case 'percentage':
        return formatPercentage(value, options);
      case 'number':
        return formatNumber(value, options);
      case 'date':
        return formatDate(value, options);
      case 'time':
        return formatTime(value, options);
      case 'datetime':
        return formatDateTime(value, options);
      case 'fileSize':
        return formatFileSize(value, options.decimals);
      case 'duration':
        return formatDuration(value);
      default:
        return String(value);
    }
  } catch (error) {
    console.error(`Error formatting value ${value} as ${type}:`, error);
    return String(value);
  }
};

// Text formatting utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const titleCase = (str: string): string => {
  return str.toLowerCase().split(' ').map(capitalize).join(' ');
};

export const camelCase = (str: string): string => {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
};

export const kebabCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const snakeCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

// Truncate text
export const truncate = (str: string, length: number, suffix = '...'): string => {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
};

// Format list with proper conjunction
export const formatList = (items: string[], conjunction = 'and'): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);

  return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
};
