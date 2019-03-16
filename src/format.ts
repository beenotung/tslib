/**
 * Created by beenotung on 3/9/17.
 */

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
  return new Date(time).toLocaleString(options.locales || 'en', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
  });
}

export function format_relative_time(delta: number, digit = 1) {
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
    if (delta > 0) {
      return ['after', n, unit].join(' ');
    } else {
      return [n, unit, 'ago'].join(' ');
    }
  };
  for (const [size, unit] of time_units) {
    if (diff > size) {
      return res(diff / size, unit);
    }
  }
  return 'just now';
}
