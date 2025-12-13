import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Vietnam mobile phone number *
 *********************************/

/**
 * Checks if the number starts with a valid Vietnam mobile phone prefix
 *
 * Valid prefixes: 09x, 08x, 07x, 03x, or 05x (where x is any digit)
 * Format: 09/08/07/05/03xx xxx xxx (10 digits with leading 0 in local format)
 * Reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Vietnam
 */
export function is_vn_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+84/, '').trim()
  // Check prefix with leading 0 (local format: 091 234 5678)
  if (tel.startsWith('0') && tel.length >= 3) {
    const firstTwo = tel.substring(0, 2)
    // Valid prefixes: 09, 08, 07, 03, 05
    return ['09', '08', '07', '03', '05'].includes(firstTwo)
  }
  // Check prefix without leading 0 (internal format: 91 234 5678)
  // Should start with 9, 8, 7, 3, or 5 (first digit of mobile prefixes)
  if (tel.length >= 1) {
    const firstDigit = tel[0]
    return ['9', '8', '7', '3', '5'].includes(firstDigit)
  }
  return false
}

/**
 * with/without +84 prefix
 */
export function is_vn_mobile_phone(tel: number | string): boolean {
  return to_full_vn_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +84xxxxxxxxx if valid (9 digits after country code, NO leading 0 in internal format)
 *          empty string if not valid
 *
 * Format notes:
 * - Local format: 091 234 5678 (10 digits WITH leading 0) - used in Vietnam
 * - Internal format: +84 98 765 4321 (9 digits after +84, NO leading 0) - always 9 digits
 * - Display format: +84 98 765 4321 (formatted by format_vn_mobile_phone)
 */
export function to_full_vn_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Local format: 10 digits with leading 0, or 9 digits without leading 0
  // Examples: 091 234 5678 (with 0) or 91 234 5678 (without 0)
  // Result: +84 98 765 4321 (always 9 digits after +84)
  if (
    tel.length === 10 &&
    tel.startsWith('0') &&
    is_vn_mobile_phone_prefix(tel)
  ) {
    return '+84' + tel.substring(1)
  }
  if (tel.length === 9 && is_vn_mobile_phone_prefix(tel)) {
    return '+84' + tel
  }

  // Country code 84 (without +): 10 digits with leading 0, or 9 digits without leading 0
  // Examples: 84 091 234 5678 (with 0) or 84 91 234 5678 (without 0)
  // Result: +84 98 765 4321 (always 9 digits after +84)
  if (
    tel.length === 10 + 2 &&
    tel.startsWith('84') &&
    tel.substring(2).startsWith('0') &&
    is_vn_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+84' + tel.substring(3)
  }
  if (
    tel.length === 9 + 2 &&
    tel.startsWith('84') &&
    is_vn_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+' + tel
  }

  // Country code +84: 10 digits with leading 0, or 9 digits without leading 0
  // Examples: +84 091 234 5678 (with 0) or +84 91 234 5678 (without 0)
  // Result: +84 98 765 4321 (always 9 digits after +84)
  if (
    tel.length === 10 + 3 &&
    tel.startsWith('+84') &&
    tel.substring(3).startsWith('0') &&
    is_vn_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+84' + tel.substring(4)
  }
  if (
    tel.length === 9 + 3 &&
    tel.startsWith('+84') &&
    is_vn_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  return ''
}

/**
 * @returns +84 AA BBB BBBB if valid
 */
export function format_vn_mobile_phone(tel: string | number): string {
  tel = to_full_vn_mobile_phone(tel)
  if (!tel) return tel

  // Remove leading zero if present (legacy support)
  const digits = to_tel_digits(tel).replace('+84', '')
  if (digits.length === 10 && digits.startsWith('0')) {
    tel = '+84' + digits.substring(1)
  }

  return format_tel_with_pattern(tel, '+84 AA BBB BBBB')
}
