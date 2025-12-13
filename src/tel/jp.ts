import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Japan mobile phone number *
 *********************************/

/**
 * starts with 070, 080, or 090
 * Mobile telephony and data services (PDC, J-CDMA, UMTS)
 * reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Japan
 */
export function is_jp_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+81/, '').trim()
  // Check if it starts with 070, 080, or 090 (with leading 0)
  if (tel.startsWith('0') && tel.length >= 3) {
    const prefix = tel.substring(0, 3)
    return prefix === '070' || prefix === '080' || prefix === '090'
  }
  // Check if it starts with 70, 80, or 90 (without leading 0)
  if (tel.length >= 2) {
    const prefix = tel.substring(0, 2)
    return prefix === '70' || prefix === '80' || prefix === '90'
  }
  return false
}

/**
 * with/without +81 prefix
 */
export function is_jp_mobile_phone(tel: number | string): boolean {
  return to_full_jp_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +81xxxxxxxxxx if valid (10 digits after country code)
 *          empty string if not valid
 *
 * Handles all combinations (ordered by specificity - longest first):
 * WITH leading 0 (11 digits):
 * - Country code +81: +8109012345678 → +819012345678
 * - Country code 81 (no +): 8109012345678 → +819012345678
 * - No country code: 09012345678 → +819012345678
 *
 * WITHOUT leading 0 (10 digits):
 * - Country code +81: +819012345678 → +819012345678
 * - Country code 81 (no +): 819012345678 → +819012345678
 * - No country code: 9012345678 → +819012345678
 */
export function to_full_jp_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // 14 digits with country code +81 and leading 0 (most specific - longest pattern)
  // Format: +81 + 0 + 10 digits (11 digits with leading 0)
  // Result: 10 digits after +81 (removes leading 0)
  if (
    tel.length === 11 + 3 &&
    tel.startsWith('+81') &&
    tel.substring(3).startsWith('0') &&
    is_jp_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+81' + tel.substring(4) // Skip '+81' and '0'
  }

  // 13 digits with country code 81 (without +) and leading 0
  // Format: 81 + 0 + 10 digits (11 digits with leading 0)
  // Result: 10 digits after +81 (removes leading 0)
  if (
    tel.length === 11 + 2 &&
    tel.startsWith('81') &&
    tel.substring(2).startsWith('0') &&
    is_jp_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+81' + tel.substring(3) // Skip '81' and '0'
  }

  // 11 digits starting with 090, 080, or 070 (local format with leading 0)
  // Result: 10 digits after +81 (removes leading 0)
  if (
    tel.length === 11 &&
    tel.startsWith('0') &&
    is_jp_mobile_phone_prefix(tel)
  ) {
    return '+81' + tel.substring(1)
  }

  // 13 digits with country code +81 and without leading 0
  // Format: +81 + 10 digits
  // Result: 10 digits after +81
  if (
    tel.length === 10 + 3 &&
    tel.startsWith('+81') &&
    is_jp_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  // 12 digits with country code 81 (without +) and without leading 0
  // Format: 81 + 10 digits
  // Result: 10 digits after +81
  if (
    tel.length === 10 + 2 &&
    tel.startsWith('81') &&
    is_jp_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+' + tel
  }

  // 10 digits starting with 90, 80, or 70 (local format without leading 0)
  // Result: 10 digits after +81
  if (tel.length === 10 && is_jp_mobile_phone_prefix(tel)) {
    return '+81' + tel
  }

  return ''
}

/**
 * @returns +81 90 xxxx xxxx if valid
 */
export function format_jp_mobile_phone(tel: string | number): string {
  tel = to_full_jp_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+81 90 xxxx xxxx')
}
