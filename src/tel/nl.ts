import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Netherlands mobile phone number *
 *********************************/

/**
 * Mobile numbers start with 06
 * Format: 0A BBB BBBB (9 digits with leading 0 in local format)
 * Reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_the_Netherlands
 */
export function is_nl_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+31/, '').trim()
  // Check prefix with leading 0 (local format: 06 12345678)
  if (tel.startsWith('0') && tel.length >= 2) {
    const firstTwo = tel.substring(0, 2)
    // Valid mobile prefix: 06
    return firstTwo === '06'
  }
  // Check prefix without leading 0 (internal format: 6 12345678)
  // Should start with 6 (first digit of mobile prefix)
  if (tel.length >= 1) {
    return tel[0] === '6'
  }
  return false
}

/**
 * with/without +31 prefix
 */
export function is_nl_mobile_phone(tel: number | string): boolean {
  return to_full_nl_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +31xxxxxxxxx if valid (9 digits after country code, NO leading 0 in internal format)
 *          empty string if not valid
 *
 * Format notes:
 * - Local format: 06 12345678 (9 digits WITH leading 0) - used in Netherlands
 * - Internal format: +31 6 12345678 (9 digits after +31, NO leading 0) - always 9 digits
 * - Display format: +31 6 12345678 (formatted by format_nl_mobile_phone)
 */
export function to_full_nl_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Local format: 10 digits with leading 0 (9 digits after removing 0)
  // Example: 06 12345678
  // Result: +31 6 12345678 (always 9 digits after +31)
  if (
    tel.length === 10 &&
    tel.startsWith('0') &&
    is_nl_mobile_phone_prefix(tel)
  ) {
    return '+31' + tel.substring(1)
  }

  // Country code 31 (without +): 10 digits with leading 0
  // Example: 31 06 12345678
  // Result: +31 6 12345678 (always 9 digits after +31)
  if (
    tel.length === 10 + 2 &&
    tel.startsWith('31') &&
    tel.substring(2).startsWith('0') &&
    is_nl_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+31' + tel.substring(3)
  }

  // Country code +31: 10 digits with leading 0, or 9 digits without leading 0
  // Examples: +31 06 12345678 (with 0) or +31 6 12345678 (without 0)
  // Result: +31 6 12345678 (always 9 digits after +31)
  if (
    tel.length === 10 + 3 &&
    tel.startsWith('+31') &&
    tel.substring(3).startsWith('0') &&
    is_nl_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+31' + tel.substring(4)
  }
  if (
    tel.length === 9 + 3 &&
    tel.startsWith('+31') &&
    is_nl_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  return ''
}

/**
 * @returns +31 6 xxxx xxxx if valid
 */
export function format_nl_mobile_phone(tel: string | number): string {
  tel = to_full_nl_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+31 6 xxxx xxxx')
}
