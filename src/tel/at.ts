import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Austria mobile phone number *
 *********************************/

/**
 * Mobile numbers start with 06 or 0660
 * Format: 0AA BBB BBBB (variable length with leading 0 in local format)
 * Reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Austria
 */
export function is_at_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+43/, '').trim()
  // Check prefix with leading 0 (local format: 0660 12345678 or 0680 12345678)
  if (tel.startsWith('0') && tel.length >= 3) {
    const firstTwo = tel.substring(0, 2)
    // Valid mobile prefixes: 06 (for 0660, 0680, etc.)
    if (firstTwo === '06') {
      return true
    }
    // Also check for 0660 specifically
    if (tel.length >= 4 && tel.substring(0, 4) === '0660') {
      return true
    }
  }
  // Check prefix without leading 0 (internal format: 660 12345678 or 680 12345678)
  // Should start with 6 (first digit of mobile prefixes)
  if (tel.length >= 1) {
    return tel[0] === '6'
  }
  return false
}

/**
 * with/without +43 prefix
 */
export function is_at_mobile_phone(tel: number | string): boolean {
  return to_full_at_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +43xxxxxxxxx if valid (variable length after country code, NO leading 0 in internal format)
 *          empty string if not valid
 *
 * Format notes:
 * - Local format: 0660 12345678 (variable length WITH leading 0) - used in Austria
 * - Internal format: +43 660 12345678 (variable length after +43, NO leading 0)
 * - Display format: +43 660 12345678 (formatted by format_at_mobile_phone)
 */
export function to_full_at_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Local format: variable length with leading 0 (typically 10-13 digits total)
  // Example: 0660 12345678
  // Result: +43 660 12345678 (no leading 0)
  if (tel.startsWith('0') && is_at_mobile_phone_prefix(tel)) {
    const withoutZero = tel.substring(1)
    // Mobile numbers are typically 10-12 digits after removing leading 0
    if (withoutZero.length >= 10 && withoutZero.length <= 12) {
      return '+43' + withoutZero
    }
  }

  // Country code 43 (without +): variable length with leading 0
  // Example: 43 0660 12345678
  // Result: +43 660 12345678 (no leading 0)
  if (
    tel.startsWith('43') &&
    tel.substring(2).startsWith('0') &&
    is_at_mobile_phone_prefix(tel.substring(2))
  ) {
    const withoutZero = tel.substring(3)
    if (withoutZero.length >= 10 && withoutZero.length <= 12) {
      return '+43' + withoutZero
    }
  }

  // Country code +43: variable length with or without leading 0
  // Examples: +43 0660 12345678 (with 0) or +43 660 12345678 (without 0)
  // Result: +43 660 12345678 (no leading 0)
  if (tel.startsWith('+43')) {
    const afterCountryCode = tel.substring(3)
    if (
      afterCountryCode.startsWith('0') &&
      is_at_mobile_phone_prefix(afterCountryCode)
    ) {
      const withoutZero = afterCountryCode.substring(1)
      if (withoutZero.length >= 10 && withoutZero.length <= 12) {
        return '+43' + withoutZero
      }
    } else if (is_at_mobile_phone_prefix(afterCountryCode)) {
      if (afterCountryCode.length >= 10 && afterCountryCode.length <= 12) {
        return tel
      }
    }
  }

  return ''
}

/**
 * @returns +43 6xx xxx xxxx if valid (or similar format)
 */
export function format_at_mobile_phone(tel: string | number): string {
  tel = to_full_at_mobile_phone(tel)
  if (!tel) return tel
  // Format: +43 660 1234 5678 (11 digits)
  const digits = to_tel_digits(tel).replace('+43', '')
  if (digits.length === 11) {
    return format_tel_with_pattern(tel, '+43 xxx xxxx xxxx')
  }
  if (digits.length === 10) {
    return format_tel_with_pattern(tel, '+43 xxx xxx xxxx')
  }
  if (digits.length === 12) {
    return format_tel_with_pattern(tel, '+43 xxxx xxxx xxxx')
  }
  return format_tel_with_pattern(tel, '+43 xxx xxxx xxxx')
}
