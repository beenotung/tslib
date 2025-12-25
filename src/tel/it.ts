import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Italy mobile phone number *
 *********************************/

/**
 * Mobile numbers start with 3xx (300-399)
 * Format: 0AA BBB BBBB (variable length with leading 0 in local format)
 * Reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Italy
 */
export function is_it_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+39/, '').trim()
  // Check prefix with leading 0 (local format: 0312 3456789)
  if (tel.startsWith('0') && tel.length >= 4) {
    const firstThree = tel.substring(0, 3)
    // Valid mobile prefixes: 03x (300-399)
    return firstThree.startsWith('03')
  }
  // Check prefix without leading 0 (internal format: 312 3456789)
  // Should start with 3 (first digit of mobile prefixes)
  if (tel.length >= 1) {
    return tel[0] === '3'
  }
  return false
}

/**
 * with/without +39 prefix
 */
export function is_it_mobile_phone(tel: number | string): boolean {
  return to_full_it_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +39xxxxxxxxx if valid (variable length after country code, NO leading 0 in internal format)
 *          empty string if not valid
 *
 * Format notes:
 * - Local format: 0312 3456789 (variable length WITH leading 0) - used in Italy
 * - Internal format: +39 312 3456789 (variable length after +39, NO leading 0)
 * - Display format: +39 312 3456789 (formatted by format_it_mobile_phone)
 */
export function to_full_it_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Local format: variable length with leading 0 (typically 10-11 digits total)
  // Example: 0312 3456789
  // Result: +39 312 3456789 (no leading 0)
  if (tel.startsWith('0') && is_it_mobile_phone_prefix(tel)) {
    const withoutZero = tel.substring(1)
    if (withoutZero.length >= 9 && withoutZero.length <= 10) {
      return '+39' + withoutZero
    }
  }

  // Country code 39 (without +): variable length with leading 0
  // Example: 39 0312 3456789
  // Result: +39 312 3456789 (no leading 0)
  if (
    tel.startsWith('39') &&
    tel.substring(2).startsWith('0') &&
    is_it_mobile_phone_prefix(tel.substring(2))
  ) {
    const withoutZero = tel.substring(3)
    if (withoutZero.length >= 9 && withoutZero.length <= 10) {
      return '+39' + withoutZero
    }
  }

  // Country code +39: variable length with or without leading 0
  // Examples: +39 0312 3456789 (with 0) or +39 312 3456789 (without 0)
  // Result: +39 312 3456789 (no leading 0)
  if (tel.startsWith('+39')) {
    const afterCountryCode = tel.substring(3)
    if (
      afterCountryCode.startsWith('0') &&
      is_it_mobile_phone_prefix(afterCountryCode)
    ) {
      const withoutZero = afterCountryCode.substring(1)
      if (withoutZero.length >= 9 && withoutZero.length <= 10) {
        return '+39' + withoutZero
      }
    } else if (is_it_mobile_phone_prefix(afterCountryCode)) {
      if (afterCountryCode.length >= 9 && afterCountryCode.length <= 10) {
        return tel
      }
    }
  }

  return ''
}

/**
 * @returns +39 3xx xxx xxxx if valid
 */
export function format_it_mobile_phone(tel: string | number): string {
  tel = to_full_it_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+39 3xx xxx xxxx')
}
