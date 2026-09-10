import {
  compareDesc,
  eachDayOfInterval,
  endOfMonth,
  format,
  getHours,
  getYear,
  isAfter,
  isSameMonth,
  isValid,
  isWeekend,
  parseISO,
  startOfDay,
  startOfMonth,
} from 'date-fns';

export function getNow(): Date {
  return new Date();
}

export function parseIsoDate(value: string): Date | null {
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
}

export function formatDateValue(value: Date | string, pattern: string, fallback = ''): string {
  const parsed = typeof value === 'string' ? parseIsoDate(value) : isValid(value) ? value : null;

  if (!parsed) {
    return fallback;
  }

  return format(parsed, pattern);
}

export function toIsoDateInput(value: string, fallback = ''): string {
  return formatDateValue(value, 'yyyy-MM-dd', fallback || value.slice(0, 10));
}

export function toYearMonthKey(value: string): string | null {
  const parsed = parseIsoDate(value);
  return parsed ? format(parsed, 'yyyy-MM') : null;
}

export function toIsoStartOfDay(value: string): string | null {
  const parsed = parseIsoDate(value);
  return parsed ? startOfDay(parsed).toISOString() : null;
}

export function toIsoDateTime(value: string): string | null {
  const parsed = parseIsoDate(value);
  return parsed ? parsed.toISOString() : null;
}

export function getDatesInRange(start: Date, end: Date): Date[] {
  return eachDayOfInterval({ start, end });
}

export function isDateAfter(start: Date, end: Date): boolean {
  return isAfter(start, end);
}

export function isWeekendDate(date: Date): boolean {
  return isWeekend(date);
}

export function isSameMonthDate(date: Date, monthReference: Date): boolean {
  return isSameMonth(date, monthReference);
}

export function getCurrentMonthDays(referenceDate: Date = getNow()): {
  monthStart: Date;
  monthEnd: Date;
  days: Date[];
} {
  const monthStart = startOfMonth(referenceDate);
  const monthEnd = endOfMonth(monthStart);
  return {
    monthStart,
    monthEnd,
    days: eachDayOfInterval({ start: monthStart, end: monthEnd }),
  };
}

export function getMonthLabel(monthIndex: number, year: number): string {
  return format(new Date(year, monthIndex, 1), 'MMM');
}

export function getCurrentYear(): number {
  return getYear(getNow());
}

export function getYearFromIso(value: string): number | null {
  const parsed = parseIsoDate(value);
  return parsed ? getYear(parsed) : null;
}

export function getMonthIndexFromIso(value: string): number | null {
  const parsed = parseIsoDate(value);
  return parsed ? parsed.getMonth() : null;
}

export function getCurrentHour(): number {
  return getHours(getNow());
}

export function compareIsoDateDesc(a: string, b: string): number {
  const aDate = parseIsoDate(a);
  const bDate = parseIsoDate(b);

  if (aDate && bDate) {
    return compareDesc(aDate, bDate);
  }

  if (aDate) {
    return -1;
  }

  if (bDate) {
    return 1;
  }

  return 0;
}
