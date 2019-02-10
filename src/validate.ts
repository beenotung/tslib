import { isNumber } from './lang';

export function is_hk_mobile_phone_prefix(s: string): boolean {
  switch (s[0]) {
    case '6':
    case '9':
    case '5':
      return true;
    default:
      return false;
  }
}

/**
 * with/without +852 prefix
 * */
export function is_hk_mobile_phone(x: number | string): boolean {
  if (!x) {
    return false;
  }
  let s = x.toString();
  if (s.length === 8 + 3 && s.startsWith('852')) {
    s = s.substr(3);
  } else if (s.length === 8 + 4 && s.startsWith('+852')) {
    s = s.substr(4);
  }
  return s.length === 8 && is_hk_mobile_phone_prefix(s);
}

/**
 * very forgiving
 *
 * @return +852xxxxyyyy if valid
 *         empty string if not valid
 * */
export function to_full_hk_mobile_phone(s: string | number): string {
  if (typeof s === 'number') {
    s = s.toString();
  }
  s = s
    .split('')
    .filter(x => isNumber(x))
    .join('');

  if (s.length === 8 && is_hk_mobile_phone_prefix(s)) {
    return '+852' + s;
  }
  if (
    s.length === 8 + 3 &&
    s.startsWith('852') &&
    is_hk_mobile_phone_prefix(s.substr(3))
  ) {
    return '+' + s;
  }
  if (
    s.length === 8 + 4 &&
    s.startsWith('+852') &&
    is_hk_mobile_phone_prefix(s.substr(4))
  ) {
    return s;
  }
  return '';
}
