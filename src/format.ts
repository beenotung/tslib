/**
 * Created by beenotung on 3/9/17.
 */

import { isEngChar, to_plural } from './en';
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
const time_units_en: Array<[number, string]> = [
  [CENTURY, 'century'],
  [DECADE, 'decade'],
  [YEAR, 'year'],
  [MONTH, 'month'],
  [WEEK, 'week'],
  [DAY, 'day'],
  [HOUR, 'hour'],
  [MINUTE, 'minute'],
  [SECOND, 'second'],
];
const time_units_zh: Array<[number, string]> = [
  [CENTURY, '世紀'],
  [YEAR, '年'],
  [MONTH, '月'],
  [WEEK, '週'],
  [DAY, '日'],
  [HOUR, '小時'],
  [MINUTE, '分鐘'],
  [SECOND, '秒'],
];
/* tslint:disable:quotemark */
const word_en = {
  instantly: 'instantly',
  'just now': 'just now',
  hence: 'hence',
  ago: 'ago',
};
const word_zh = {
  instantly: '頃刻',
  'just now': '剛剛',
  hence: '後',
  ago: '前',
};
/* tslint:enable:quotemark */
let word = word_en;

let time_units: Array<[number, string]> = time_units_en;
let locale = getEnvLocale() || 'en';

export function setLang(
  lang: 'en' | 'en-US' | 'en-GK' | 'zh' | 'zh-HK' | 'zh-TW',
) {
  locale = lang;
  if (lang.includes('zh')) {
    time_units = time_units_zh;
    word = word_zh;
  } else {
    time_units = time_units_en;
    word = word_en;
  }
}

setLang(locale as any);

function concatWords(a: string, b: string): string {
  if (isEngChar(a[a.length - 1]) || isEngChar(b[0])) {
    return a + ' ' + b;
  }
  return a + b;
}

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
  const locales = options.locales || getEnvLocale() || locale;
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

const roundUnits = time_units_en.map(([unit]) => unit).sort((a, b) => b - a);

function roundTime(timeDiff: number): number {
  const absDiff = Math.abs(timeDiff);
  for (const unit of roundUnits) {
    if (absDiff > unit) {
      if (timeDiff > 0) {
        return Math.floor(timeDiff / unit) * unit;
      } else {
        return Math.ceil(timeDiff / unit) * unit;
      }
    }
  }
  return timeDiff;
}

export function format_long_short_time(
  time: number,
  options?: {
    threshold?: number; // default WEEK
    locales?: string;
    empty?: string;
  },
) {
  // if within 1-week, format relative time, else format absolute time
  const diff = time - Date.now();
  if (Math.abs(diff) < (options?.threshold || WEEK)) {
    return format_relative_time(roundTime(diff));
  }
  return format_datetime(time);
  /*
  return new Intl.DateTimeFormat('zh-HK', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    year: 'numeric',
    // hour12: true,
  }).format(new Date());
  */
}

export function format_time_duration(delta: number, digit = 1): string {
  const diff = Math.abs(delta);
  const res = (n: number, unit: string): string => {
    const p = Math.pow(10, digit);
    n = Math.round(n * p) / p;
    if (n > 1) {
      unit = to_plural(unit);
    }
    return n + ' ' + unit;
  };
  for (const [size, unit] of time_units) {
    if (diff > size) {
      return res(diff / size, unit);
    }
  }
  return word.instantly;
}

export function format_relative_time(delta: number, digit = 1): string {
  const s = format_time_duration(delta, digit);
  if (s === word.instantly) {
    return word['just now'];
  }
  if (delta > 0) {
    return concatWords(s, word.hence);
  } else {
    return concatWords(s, word.ago);
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

/**
 * format: YYYYMMDD-HHMM
 * less accurate, for human reading
 * */
export function format_time_code(time: number, separator = '-') {
  const t = new Date(time);
  const y = t.getFullYear();
  const m = format_2_digit(t.getMonth() + 1);
  const d = format_2_digit(t.getDate());
  const H = format_2_digit(t.getHours());
  const M = format_2_digit(t.getMinutes());
  return y + m + d + separator + H + M;
}

/**
 * format: YYYYMMDD-HHMM-SS-sss
 * more accurate, for filename
 * */
export function format_timestamp_code(time: number, separator = '-') {
  const t = new Date(time);
  const y = t.getFullYear();
  const m = format_2_digit(t.getMonth() + 1);
  const d = format_2_digit(t.getDate());
  const H = format_2_digit(t.getHours());
  const M = format_2_digit(t.getMinutes());
  const S = format_2_digit(t.getSeconds());
  const s = format_n_digit(t.getMilliseconds(), 3);
  return y + m + d + separator + H + M + separator + S + separator + s;
}

export function format_n_digit(x: number, n: number, prefix = '0'): string {
  let s = Math.abs(x).toString();
  if (x < 0) {
    n--;
  }
  if (s.length < n) {
    s = prefix.repeat(n - s.length) + s;
  }
  if (x < 0) {
    s = '-' + s;
  }
  return s;
}

export function format_percentage(p: number, n_decimal: number = 2): string {
  return Math.round(p * Math.pow(10, 2 + n_decimal)) / 100 + '%';
}
