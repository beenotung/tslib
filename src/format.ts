/**
 * Created by beenotung on 3/9/17.
 */

import { getEnvLocale } from './locale';
import {
  CENTURY,
  DAY,
  DECADE,
  HOUR,
  MINUTE,
  MONTH,
  SECOND,
  WEEK,
  YEAR,
} from './time';

const size_units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const time_units: Array<[number, string]> = [
  [CENTURY, 'century'],
  [DECADE, 'decade'],
  [YEAR, 'year'],
  [MONTH, 'month'],
  [WEEK, 'week'],
  [365 * DAY, 'month'],
  [WEEK, 'week'],
  [DAY, 'day'],
  [HOUR, 'hour'],
  [MINUTE, 'minute'],
  [SECOND, 'second'],
];

export function format_byte(n_byte: number, n_decimal = 2): string {
  let acc = n_byte;
  for (const size_unit of size_units) {
    if (acc < 1024) {
      return acc.toFixed(n_decimal) + ' ' + size_unit;
    }
    acc /= 1024;
  }
  return (
    (acc * 1024).toFixed(n_decimal) + ' ' + size_units[size_units.length - 1]
  );
}

export function format_datetime(
  time: number,
  options: { locales?: string; empty?: string } = {},
) {
  if (!time) {
    return options.empty || '-';
  }
  const locales = options.locales || getEnvLocale() || 'en';
  return new Date(time).toLocaleString(locales, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
  });
}

export function format_time_duration(delta: number, digit = 1): string {
  const diff = Math.abs(delta);
  const res = (n: number, unit: string): string => {
    const p = Math.pow(10, digit);
    n = Math.round(n * p) / p;
    if (n > 1) {
      if (unit.endsWith('y')) {
        unit = unit.replace(/y$/, 'ies');
      } else {
        unit = unit + 's';
      }
    }
    return n + ' ' + unit;
  };
  for (const [size, unit] of time_units) {
    if (diff > size) {
      return res(diff / size, unit);
    }
  }
  return 'instantly';
}

export function format_relative_time(delta: number, digit = 1): string {
  const s = format_time_duration(delta, digit);
  if (s === 'instantly') {
    return 'just now';
  }
  if (delta > 0) {
    return s + ' hence';
  } else {
    return s + ' ago';
  }
}

/**
 * mainly for formatting month, date, hour, minute, and second
 * @param x: [0..60]
 * */
export function format_2_digit(x: number): string {
  if (x < 10) {
    return '0' + x;
  }
  return x.toString();
}

export function format_n_digit(x: number, n: number): string {
  let s = Math.abs(x).toString();
  if (x < 0) {
    n--;
  }
  if (s.length < n) {
    s = '0'.repeat(n - s.length) + s;
  }
  if (x < 0) {
    s = '-' + s;
  }
  return s;
}
