import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Belgium mobile phone number *
 *********************************/

/**
 * Mobile numbers start with 04
 * Format: 0AA BBB BB BB (9 digits with leading 0 in local format)
 * Reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Belgium
 */
export function is_be_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+32/, '').trim()
  // Check prefix with leading 0 (local format: 0471 23 45 67)
  if (tel.startsWith('0') && tel.length >= 3) {
    const firstTwo = tel.substring(0, 2)
    // Valid mobile prefix: 04
    return firstTwo === '04'
  }
  // Check prefix without leading 0 (internal format: 471 23 45 67)
  // Should start with 4 (first digit of mobile prefix)
  if (tel.length >= 1) {
    return tel[0] === '4'
  }
  return false
}

/**
 * with/without +32 prefix
 */
export function is_be_mobile_phone(tel: number | string): boolean {
  return to_full_be_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +32xxxxxxxxx if valid (9 digits after country code, NO leading 0 in internal format)
 *          empty string if not valid
 *
 * Format notes:
 * - Local format: 0471 23 45 67 (9 digits WITH leading 0) - used in Belgium
 * - Internal format: +32 471 23 45 67 (9 digits after +32, NO leading 0) - always 9 digits
 * - Display format: +32 471 23 45 67 (formatted by format_be_mobile_phone)
 */
export function to_full_be_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Local format: 10 digits with leading 0 (9 digits after removing 0)
  // Example: 0471 23 45 67
  // Result: +32 471 23 45 67 (always 9 digits after +32)
  if (
    tel.length === 10 &&
    tel.startsWith('0') &&
    is_be_mobile_phone_prefix(tel)
  ) {
    return '+32' + tel.substring(1)
  }

  // Country code 32 (without +): 10 digits with leading 0
  // Example: 32 0471 23 45 67
  // Result: +32 471 23 45 67 (always 9 digits after +32)
  if (
    tel.length === 10 + 2 &&
    tel.startsWith('32') &&
    tel.substring(2).startsWith('0') &&
    is_be_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+32' + tel.substring(3)
  }

  // Country code +32: 10 digits with leading 0, or 9 digits without leading 0
  // Examples: +32 0471 23 45 67 (with 0) or +32 471 23 45 67 (without 0)
  // Result: +32 471 23 45 67 (always 9 digits after +32)
  if (
    tel.length === 10 + 3 &&
    tel.startsWith('+32') &&
    tel.substring(3).startsWith('0') &&
    is_be_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+32' + tel.substring(4)
  }
  if (
    tel.length === 9 + 3 &&
    tel.startsWith('+32') &&
    is_be_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  return ''
}

/**
 * @returns +32 4xx xx xx xx if valid
 */
export function format_be_mobile_phone(tel: string | number): string {
  tel = to_full_be_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+32 4xx xx xx xx')
}
