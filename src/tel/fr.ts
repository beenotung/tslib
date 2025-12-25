import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * France mobile phone number *
 *********************************/

/**
 * Mobile numbers start with 06 or 07
 * Format: 0A BB BB BB BB (10 digits with leading 0 in local format)
 * Reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_France
 */
export function is_fr_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+33/, '').trim()
  // Check prefix with leading 0 (local format: 06 12 34 56 78)
  if (tel.startsWith('0') && tel.length >= 2) {
    const secondDigit = tel[1]
    // Valid mobile prefixes: 06, 07
    return secondDigit === '6' || secondDigit === '7'
  }
  // Check prefix without leading 0 (internal format: 6 12 34 56 78 or 7 12 34 56 78)
  // Should start with 6 or 7 (first digit of mobile prefixes)
  if (tel.length >= 1) {
    const firstDigit = tel[0]
    return firstDigit === '6' || firstDigit === '7'
  }
  return false
}

/**
 * with/without +33 prefix
 */
export function is_fr_mobile_phone(tel: number | string): boolean {
  return to_full_fr_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +33xxxxxxxxx if valid (9 digits after country code, NO leading 0 in internal format)
 *          empty string if not valid
 *
 * Format notes:
 * - Local format: 06 12 34 56 78 (10 digits WITH leading 0) - used in France
 * - Internal format: +33 6 12 34 56 78 (9 digits after +33, NO leading 0) - always 9 digits
 * - Display format: +33 6 12 34 56 78 (formatted by format_fr_mobile_phone)
 */
export function to_full_fr_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Local format: 10 digits with leading 0
  // Example: 06 12 34 56 78
  // Result: +33 6 12 34 56 78 (always 9 digits after +33)
  if (
    tel.length === 10 &&
    tel.startsWith('0') &&
    is_fr_mobile_phone_prefix(tel)
  ) {
    return '+33' + tel.substring(1)
  }

  // Country code 33 (without +): 10 digits with leading 0
  // Example: 33 06 12 34 56 78
  // Result: +33 6 12 34 56 78 (always 9 digits after +33)
  if (
    tel.length === 10 + 2 &&
    tel.startsWith('33') &&
    tel.substring(2).startsWith('0') &&
    is_fr_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+33' + tel.substring(3)
  }

  // Country code +33: 10 digits with leading 0, or 9 digits without leading 0
  // Examples: +33 06 12 34 56 78 (with 0) or +33 6 12 34 56 78 (without 0)
  // Result: +33 6 12 34 56 78 (always 9 digits after +33)
  if (
    tel.length === 10 + 3 &&
    tel.startsWith('+33') &&
    tel.substring(3).startsWith('0') &&
    is_fr_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+33' + tel.substring(4)
  }
  if (
    tel.length === 9 + 3 &&
    tel.startsWith('+33') &&
    is_fr_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  return ''
}

/**
 * @returns +33 x xx xx xx xx if valid
 */
export function format_fr_mobile_phone(tel: string | number): string {
  tel = to_full_fr_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+33 x xx xx xx xx')
}
