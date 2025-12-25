import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Spain mobile phone number *
 *********************************/

/**
 * Mobile numbers start with 6xx or 7xx (600-699, 700-799)
 * Format: 9 digits total (no leading 0 in local format)
 * Reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Spain
 */
export function is_es_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+34/, '').trim()
  // Check prefix (local format: 612 345 678 or 712 345 678)
  if (tel.length >= 1) {
    const firstDigit = tel[0]
    // Valid mobile prefixes: 6xx, 7xx
    return firstDigit === '6' || firstDigit === '7'
  }
  return false
}

/**
 * with/without +34 prefix
 */
export function is_es_mobile_phone(tel: number | string): boolean {
  return to_full_es_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +34xxxxxxxxx if valid (9 digits after country code)
 *          empty string if not valid
 *
 * Format notes:
 * - Local format: 612 345 678 (9 digits, NO leading 0) - used in Spain
 * - Internal format: +34 612 345 678 (9 digits after +34)
 * - Display format: +34 612 345 678 (formatted by format_es_mobile_phone)
 */
export function to_full_es_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Local format: 9 digits (no leading 0)
  // Example: 612 345 678
  // Result: +34 612 345 678
  if (tel.length === 9 && is_es_mobile_phone_prefix(tel)) {
    return '+34' + tel
  }

  // Country code 34 (without +): 9 digits
  // Example: 34 612 345 678
  // Result: +34 612 345 678
  if (
    tel.length === 9 + 2 &&
    tel.startsWith('34') &&
    is_es_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+' + tel
  }

  // Country code +34: 9 digits
  // Example: +34 612 345 678
  // Result: +34 612 345 678
  if (
    tel.length === 9 + 3 &&
    tel.startsWith('+34') &&
    is_es_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  return ''
}

/**
 * @returns +34 6xx xxx xxx or +34 7xx xxx xxx if valid
 */
export function format_es_mobile_phone(tel: string | number): string {
  tel = to_full_es_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+34 xxx xxx xxx')
}
