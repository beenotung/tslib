import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Germany mobile phone number *
 *********************************/

/**
 * Mobile numbers start with 015, 016, or 017
 * Format: 0AA BBB BBBB (variable length with leading 0 in local format)
 * Reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Germany
 */
export function is_de_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+49/, '').trim()
  // Check prefix with leading 0 (local format: 0151 12345678)
  if (tel.startsWith('0') && tel.length >= 4) {
    const firstThree = tel.substring(0, 3)
    // Valid mobile prefixes: 015, 016, 017
    return ['015', '016', '017'].includes(firstThree)
  }
  // Check prefix without leading 0 (internal format: 151 12345678)
  // Should start with 15, 16, or 17 (first two digits of mobile prefixes)
  if (tel.length >= 2) {
    const firstTwo = tel.substring(0, 2)
    return ['15', '16', '17'].includes(firstTwo)
  }
  return false
}

/**
 * with/without +49 prefix
 */
export function is_de_mobile_phone(tel: number | string): boolean {
  return to_full_de_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +49xxxxxxxxx if valid (variable length after country code, NO leading 0 in internal format)
 *          empty string if not valid
 *
 * Format notes:
 * - Local format: 0151 12345678 (variable length WITH leading 0) - used in Germany
 * - Internal format: +49 151 12345678 (variable length after +49, NO leading 0)
 * - Display format: +49 151 12345678 (formatted by format_de_mobile_phone)
 */
export function to_full_de_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Local format: variable length with leading 0 (typically 11-12 digits total)
  // Example: 0151 12345678
  // Result: +49 151 12345678 (no leading 0)
  if (tel.startsWith('0') && is_de_mobile_phone_prefix(tel)) {
    // Remove leading 0 and validate length (should be 10-11 digits after removing 0)
    const withoutZero = tel.substring(1)
    if (withoutZero.length >= 10 && withoutZero.length <= 11) {
      return '+49' + withoutZero
    }
  }

  // Country code 49 (without +): variable length with leading 0
  // Example: 49 0151 12345678
  // Result: +49 151 12345678 (no leading 0)
  if (
    tel.startsWith('49') &&
    tel.substring(2).startsWith('0') &&
    is_de_mobile_phone_prefix(tel.substring(2))
  ) {
    const withoutZero = tel.substring(3)
    if (withoutZero.length >= 10 && withoutZero.length <= 11) {
      return '+49' + withoutZero
    }
  }

  // Country code +49: variable length with or without leading 0
  // Examples: +49 0151 12345678 (with 0) or +49 151 12345678 (without 0)
  // Result: +49 151 12345678 (no leading 0)
  if (tel.startsWith('+49')) {
    const afterCountryCode = tel.substring(3)
    if (afterCountryCode.startsWith('0') && is_de_mobile_phone_prefix(afterCountryCode)) {
      const withoutZero = afterCountryCode.substring(1)
      if (withoutZero.length >= 10 && withoutZero.length <= 11) {
        return '+49' + withoutZero
      }
    } else if (is_de_mobile_phone_prefix(afterCountryCode)) {
      if (afterCountryCode.length >= 10 && afterCountryCode.length <= 11) {
        return tel
      }
    }
  }

  return ''
}

/**
 * @returns +49 15x xxx xxxx if valid (or similar format)
 */
export function format_de_mobile_phone(tel: string | number): string {
  tel = to_full_de_mobile_phone(tel)
  if (!tel) return tel
  // Format: +49 15x xxx xxxx (11 digits) or +49 15x xxxx xxxx (12 digits)
  const digits = to_tel_digits(tel).replace('+49', '')
  if (digits.length === 11) {
    return format_tel_with_pattern(tel, '+49 xxx xxxx xxxx')
  }
  if (digits.length === 12) {
    return format_tel_with_pattern(tel, '+49 xxxx xxxx xxxx')
  }
  // Default to 11-digit format
  return format_tel_with_pattern(tel, '+49 xxx xxxx xxxx')
}
