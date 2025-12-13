import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * India mobile phone number *
 *********************************/

/**
 * starts with 9, 8, 7, or 6
 * Mobile numbers (including pagers) on GSM, WCDMA, LTE and NR networks start with either 9, 8, 7 or 6
 * reference: https://en.wikipedia.org/wiki/Mobile_telephone_numbering_in_India
 */
export function is_in_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+91/, '').trim()
  if (tel.length < 1) return false
  const firstDigit = tel[0]
  return ['9', '8', '7', '6'].includes(firstDigit)
}

/**
 * with/without +91 prefix
 */
export function is_in_mobile_phone(tel: number | string): boolean {
  return to_full_in_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +91xxxxxxxxxx if valid (10 digits after country code)
 *          empty string if not valid
 */
export function to_full_in_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // 10 digits (local format)
  if (tel.length === 10 && is_in_mobile_phone_prefix(tel)) {
    return '+91' + tel
  }

  // 10 digits with country code 91 (without +)
  if (
    tel.length === 10 + 2 &&
    tel.startsWith('91') &&
    is_in_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+' + tel
  }

  // 10 digits with country code +91
  if (
    tel.length === 10 + 3 &&
    tel.startsWith('+91') &&
    is_in_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  return ''
}

/**
 * @returns +91 xxxxx xxxxx if valid
 */
export function format_in_mobile_phone(tel: string | number): string {
  tel = to_full_in_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+91 xxxxx xxxxx')
}
