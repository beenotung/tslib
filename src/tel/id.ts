import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Indonesia mobile phone number *
 *********************************/

/**
 * starts with 08
 * reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Indonesia
 */
export function is_id_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+62/, '').trim()
  if (tel.startsWith('0')) {
    tel = tel.substring(1)
  }
  return tel.startsWith('8')
}

/**
 * with/without +62 prefix
 */
export function is_id_mobile_phone(tel: number | string): boolean {
  return to_full_id_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +62xxxxxxxxxx if valid (9-11 digits after country code, typically 10-11)
 *          empty string if not valid
 *
 * Format notes:
 * - Local format: 0812 3456 789 (10-12 digits WITH leading 0) - used in Indonesia
 * - Internal format: +62 812 3456 789 (9-11 digits after +62, NO leading 0)
 * - Display format: +62 812 3456 789 (formatted by format_id_mobile_phone)
 */
export function to_full_id_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Local format: 10-12 digits with leading 0, or 9-11 digits without leading 0
  // Examples: 0812 3456 789 (with 0) or 812 3456 789 (without 0)
  // Result: +62 812 3456 789 (always 9-11 digits after +62, NO leading 0)
  if (
    (tel.length === 10 || tel.length === 11 || tel.length === 12) &&
    tel.startsWith('0') &&
    is_id_mobile_phone_prefix(tel)
  ) {
    return '+62' + tel.substring(1)
  }
  if (
    (tel.length === 9 || tel.length === 10 || tel.length === 11) &&
    is_id_mobile_phone_prefix(tel)
  ) {
    return '+62' + tel
  }

  // Country code 62 (without +): 10-12 digits with leading 0, or 9-11 digits without leading 0
  // Examples: 62 0812 3456 789 (with 0) or 62 812 3456 789 (without 0)
  // Result: +62 812 3456 789 (always 9-11 digits after +62, NO leading 0)
  if (
    tel.startsWith('62') &&
    (tel.length === 10 + 2 || tel.length === 11 + 2 || tel.length === 12 + 2) &&
    tel.substring(2).startsWith('0') &&
    is_id_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+62' + tel.substring(3)
  }
  if (
    tel.startsWith('62') &&
    (tel.length === 9 + 2 || tel.length === 10 + 2 || tel.length === 11 + 2) &&
    is_id_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+' + tel
  }

  // Country code +62: 10-12 digits with leading 0, or 9-11 digits without leading 0
  // Examples: +62 0812 3456 789 (with 0) or +62 812 3456 789 (without 0)
  // Result: +62 812 3456 789 (always 9-11 digits after +62, NO leading 0)
  if (
    tel.startsWith('+62') &&
    (tel.length === 10 + 3 || tel.length === 11 + 3 || tel.length === 12 + 3) &&
    tel.substring(3).startsWith('0') &&
    is_id_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+62' + tel.substring(4)
  }
  if (
    tel.startsWith('+62') &&
    (tel.length === 9 + 3 || tel.length === 10 + 3 || tel.length === 11 + 3) &&
    is_id_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  return ''
}

/**
 * @returns +62 8xx xxx xxx if valid (format varies by length: 9-11 digits)
 *          - 9 digits: +62 8xx xxx xxx
 *          - 10 digits: +62 8xx xxxx xxx
 *          - 11 digits: +62 8xx xxxx xxxx
 */
export function format_id_mobile_phone(tel: string | number): string {
  tel = to_full_id_mobile_phone(tel)
  if (!tel) return tel
  // Indonesia numbers can be 9-11 digits, use flexible pattern
  const digits = tel.replace('+62', '')
  if (digits.length === 9) {
    return format_tel_with_pattern(tel, '+62 8xx xxx xxx')
  } else if (digits.length === 10) {
    return format_tel_with_pattern(tel, '+62 8xx xxxx xxx')
  } else if (digits.length === 11) {
    return format_tel_with_pattern(tel, '+62 8xx xxxx xxxx')
  }
  return tel
}
