import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * United States mobile phone number *
 *********************************/

/**
 * Validates NANP (North American Numbering Plan) format
 * - Area code (NPA): 3 digits, first digit 2-9
 * - Exchange code (NXX): 3 digits, first digit 2-9
 * - Subscriber number: 4 digits
 *
 * reference: https://en.wikipedia.org/wiki/North_American_Numbering_Plan
 */
export function is_us_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+1/, '').trim()
  if (tel.length < 6) return false

  // Area code (first 3 digits): first digit must be 2-9
  const areaCodeFirst = tel[0]
  if (areaCodeFirst < '2' || areaCodeFirst > '9') return false

  // Exchange code (next 3 digits): first digit must be 2-9
  const exchangeCodeFirst = tel[3]
  if (exchangeCodeFirst < '2' || exchangeCodeFirst > '9') return false

  return true
}

/**
 * with/without +1 prefix
 */
export function is_us_mobile_phone(tel: number | string): boolean {
  return to_full_us_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +1xxxxxxxxxx if valid
 *          empty string if not valid
 *
 * US phone numbers follow NANP format:
 * - 10 digits total (after country code)
 * - Area code (NPA): 3 digits, first digit 2-9
 * - Exchange code (NXX): 3 digits, first digit 2-9
 * - Subscriber number: 4 digits
 *
 * reference: https://en.wikipedia.org/wiki/North_American_Numbering_Plan
 */
export function to_full_us_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // 10 digits (local format)
  if (tel.length === 10 && is_us_mobile_phone_prefix(tel)) {
    return '+1' + tel
  }

  // 10 digits with country code 1 (without +)
  if (
    tel.length === 10 + 1 &&
    tel.startsWith('1') &&
    is_us_mobile_phone_prefix(tel.substring(1))
  ) {
    return '+' + tel
  }

  // 10 digits with country code +1
  if (
    tel.length === 10 + 2 &&
    tel.startsWith('+1') &&
    is_us_mobile_phone_prefix(tel.substring(2))
  ) {
    return tel
  }

  return ''
}

/**
 * @returns +1 xxx xxx xxxx if valid
 */
export function format_us_mobile_phone(tel: string | number): string {
  tel = to_full_us_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+1 xxx xxx xxxx')
}
