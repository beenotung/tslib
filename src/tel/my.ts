import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Malaysia mobile phone number *
 *********************************/

/**
 * starts with 01x (010, 011, 012, 013, 014, 016, 017, 018, 019)
 * reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Malaysia
 */
export function is_my_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+60/, '').trim()
  // Remove leading 0 if present
  if (tel.startsWith('0')) {
    tel = tel.substring(1)
  }
  // After removing leading 0, should start with 1, then 0, 1, 2, 3, 4, 6, 7, 8, or 9
  if (tel.length < 2) return false
  if (tel[0] !== '1') return false
  const secondDigit = tel[1]
  return ['0', '1', '2', '3', '4', '6', '7', '8', '9'].includes(secondDigit)
}

/**
 * with/without +60 prefix
 */
export function is_my_mobile_phone(tel: number | string): boolean {
  return to_full_my_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +60xxxxxxxxx if valid (9-10 digits after country code)
 *          empty string if not valid
 *
 * Format notes:
 * - Local format: 012 345 6789 (10 digits WITH leading 0) or 011 1234 5678 (11 digits WITH leading 0) - used in Malaysia
 * - Internal format: +60 12 345 6789 (9-10 digits after +60, NO leading 0)
 * - Display format: +60 12 345 6789 (formatted by format_my_mobile_phone)
 */
export function to_full_my_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Local format: 10-11 digits with leading 0, or 9 digits without leading 0
  // Examples: 012 345 6789 (with 0) or 12 345 6789 (without 0, 9 digits only)
  // Result: +60 12 345 6789 (always 9-10 digits after +60, NO leading 0)
  if (
    (tel.length === 10 || tel.length === 11) &&
    tel.startsWith('0') &&
    is_my_mobile_phone_prefix(tel)
  ) {
    return '+60' + tel.substring(1)
  }
  // 9 digits starting with 1x (local format without leading 0)
  // Note: Only 9 digits are allowed without leading 0, not 10 digits
  // Malaysia mobile numbers should always have leading 0 in local format
  if (tel.length === 9 && is_my_mobile_phone_prefix(tel)) {
    return '+60' + tel
  }

  // Country code 60 (without +): 10-11 digits with leading 0, or 9-10 digits without leading 0
  // Examples: 60 012 345 6789 (with 0) or 60 12 345 6789 (without 0)
  // Result: +60 12 345 6789 (always 9-10 digits after +60, NO leading 0)
  if (
    tel.startsWith('60') &&
    (tel.length === 10 + 2 || tel.length === 11 + 2) &&
    tel.substring(2).startsWith('0') &&
    is_my_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+60' + tel.substring(3)
  }
  if (
    tel.startsWith('60') &&
    (tel.length === 9 + 2 || tel.length === 10 + 2) &&
    is_my_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+' + tel
  }

  // Country code +60: 10-11 digits with leading 0, or 9-10 digits without leading 0
  // Examples: +60 012 345 6789 (with 0) or +60 12 345 6789 (without 0)
  // Result: +60 12 345 6789 (always 9-10 digits after +60, NO leading 0)
  if (
    tel.startsWith('+60') &&
    (tel.length === 10 + 3 || tel.length === 11 + 3) &&
    tel.substring(3).startsWith('0') &&
    is_my_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+60' + tel.substring(4)
  }
  if (
    tel.startsWith('+60') &&
    (tel.length === 9 + 3 || tel.length === 10 + 3) &&
    is_my_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  return ''
}

/**
 * @returns +60 XX XXX XXXX if valid (format varies by length: 9 or 10 digits)
 *          - 9 digits: +60 XX XXX XXXX
 *          - 10 digits: +60 XX XXXX XXXX
 */
export function format_my_mobile_phone(tel: string | number): string {
  tel = to_full_my_mobile_phone(tel)
  if (!tel) return tel
  // Malaysia numbers can be 9-10 digits, use flexible pattern
  const digits = tel.replace('+60', '')
  if (digits.length === 9) {
    return format_tel_with_pattern(tel, '+60 XX XXX XXXX')
  } else if (digits.length === 10) {
    return format_tel_with_pattern(tel, '+60 XX XXXX XXXX')
  }
  return tel
}
