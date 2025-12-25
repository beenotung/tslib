import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Switzerland mobile phone number *
 *********************************/

/**
 * Mobile numbers start with 07x (074, 075, 076, 077, 078, 079)
 * Format: 0AA BBB BB BB (10 digits with leading 0 in local format)
 * Reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Switzerland
 */
export function is_ch_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+41/, '').trim()
  // Check prefix with leading 0 (local format: 079 123 45 67)
  if (tel.startsWith('0') && tel.length >= 3) {
    const firstTwo = tel.substring(0, 2)
    // Valid mobile prefixes: 07
    return firstTwo === '07'
  }
  // Check prefix without leading 0 (internal format: 79 123 45 67)
  // Should start with 7 (first digit of mobile prefixes)
  if (tel.length >= 1) {
    return tel[0] === '7'
  }
  return false
}

/**
 * with/without +41 prefix
 */
export function is_ch_mobile_phone(tel: number | string): boolean {
  return to_full_ch_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +41xxxxxxxxx if valid (9 digits after country code, NO leading 0 in internal format)
 *          empty string if not valid
 *
 * Format notes:
 * - Local format: 079 123 45 67 (10 digits WITH leading 0) - used in Switzerland
 * - Internal format: +41 79 123 45 67 (9 digits after +41, NO leading 0) - always 9 digits
 * - Display format: +41 79 123 45 67 (formatted by format_ch_mobile_phone)
 */
export function to_full_ch_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Local format: 10 digits with leading 0
  // Example: 079 123 45 67
  // Result: +41 79 123 45 67 (always 9 digits after +41)
  if (
    tel.length === 10 &&
    tel.startsWith('0') &&
    is_ch_mobile_phone_prefix(tel)
  ) {
    return '+41' + tel.substring(1)
  }

  // Country code 41 (without +): 10 digits with leading 0
  // Example: 41 079 123 45 67
  // Result: +41 79 123 45 67 (always 9 digits after +41)
  if (
    tel.length === 10 + 2 &&
    tel.startsWith('41') &&
    tel.substring(2).startsWith('0') &&
    is_ch_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+41' + tel.substring(3)
  }

  // Country code +41: 10 digits with leading 0, or 9 digits without leading 0
  // Examples: +41 079 123 45 67 (with 0) or +41 79 123 45 67 (without 0)
  // Result: +41 79 123 45 67 (always 9 digits after +41)
  if (
    tel.length === 10 + 3 &&
    tel.startsWith('+41') &&
    tel.substring(3).startsWith('0') &&
    is_ch_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+41' + tel.substring(4)
  }
  if (
    tel.length === 9 + 3 &&
    tel.startsWith('+41') &&
    is_ch_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  return ''
}

/**
 * @returns +41 7x xxx xx xx if valid
 */
export function format_ch_mobile_phone(tel: string | number): string {
  tel = to_full_ch_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+41 7x xxx xx xx')
}

