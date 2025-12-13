import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Thailand mobile phone number *
 *********************************/

/**
 * starts with 06, 08, or 09 (two-digit prefix)
 * Mobile prefixes: 06x (060-068), 08x (080-089), 09x (090-099)
 * reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Thailand
 */
export function is_th_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+66/, '').trim()
  // Check prefix with leading 0 (local format: 081 234 5678)
  if (tel.startsWith('0') && tel.length >= 3) {
    const firstTwo = tel.substring(0, 2)
    // Valid prefixes: 06, 08, 09
    return firstTwo === '06' || firstTwo === '08' || firstTwo === '09'
  }
  // Check prefix without leading 0 (internal format: 81 234 5678)
  // Should start with 6, 8, or 9 (first digit of mobile prefixes)
  if (tel.length >= 1) {
    const firstDigit = tel[0]
    return firstDigit === '6' || firstDigit === '8' || firstDigit === '9'
  }
  return false
}

/**
 * with/without +66 prefix
 */
export function is_th_mobile_phone(tel: number | string): boolean {
  return to_full_th_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +66xxxxxxxxx if valid (9 digits after country code)
 *          empty string if not valid
 */
export function to_full_th_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Country code +66: 10 digits with leading 0, or 9 digits without leading 0
  // Examples: +66 081 234 5678 (with 0) or +66 81 234 5678 (without 0)
  // Result: +66 81 234 5678 (always 9 digits after +66, NO leading 0)
  if (
    tel.length === 10 + 3 &&
    tel.startsWith('+66') &&
    tel.substring(3).startsWith('0') &&
    is_th_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+66' + tel.substring(4)
  }
  if (
    tel.length === 9 + 3 &&
    tel.startsWith('+66') &&
    is_th_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  // Country code 66 (without +): 10 digits with leading 0, or 9 digits without leading 0
  // Examples: 66 081 234 5678 (with 0) or 66 81 234 5678 (without 0)
  // Result: +66 81 234 5678 (always 9 digits after +66, NO leading 0)
  if (
    tel.length === 10 + 2 &&
    tel.startsWith('66') &&
    tel.substring(2).startsWith('0') &&
    is_th_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+66' + tel.substring(3)
  }
  if (
    tel.length === 9 + 2 &&
    tel.startsWith('66') &&
    is_th_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+' + tel
  }

  // Local format: 10 digits with leading 0, or 9 digits without leading 0
  // Examples: 081 234 5678 (with 0) or 81 234 5678 (without 0)
  // Result: +66 81 234 5678 (always 9 digits after +66, NO leading 0)
  if (
    tel.length === 10 &&
    tel.startsWith('0') &&
    is_th_mobile_phone_prefix(tel)
  ) {
    return '+66' + tel.substring(1)
  }
  if (tel.length === 9 && is_th_mobile_phone_prefix(tel)) {
    return '+66' + tel
  }

  return ''
}

/**
 * @returns +66 AA BBB BBBB if valid
 */
export function format_th_mobile_phone(tel: string | number): string {
  tel = to_full_th_mobile_phone(tel)
  if (!tel) return tel

  // Remove leading zero if present (legacy support)
  const digits = to_tel_digits(tel).replace('+66', '')
  if (digits.length === 10 && digits.startsWith('0')) {
    tel = '+66' + digits.substring(1)
  }

  return format_tel_with_pattern(tel, '+66 AA BBB BBBB')
}
