import { format_tel_with_pattern, to_tel_digits } from './utils'

/** *****************************
 * UAE/Dubai mobile phone number *
 *********************************/

/**
 * starts with 5 (50, 52, 54, 55, 56, 58)
 * reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_the_United_Arab_Emirates
 * */
export function is_ae_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+971/, '').trim()
  if (tel.startsWith('0')) {
    tel = tel.substring(1)
  }
  switch (tel[0]) {
    case '5':
      return true
    default:
      return false
  }
}

/**
 * with/without +971 prefix
 * */
export function is_ae_mobile_phone(tel: number | string): boolean {
  return to_full_ae_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @return +971xxxxxxxxx if valid (9 digits after country code)
 *         empty string if not valid
 * */
export function to_full_ae_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // 9 digits starting with 5 (local format without leading 0)
  if (tel.length === 9 && is_ae_mobile_phone_prefix(tel)) {
    return '+971' + tel
  }

  // 10 digits starting with 05 (local format with leading 0)
  if (
    tel.length === 10 &&
    tel.startsWith('0') &&
    is_ae_mobile_phone_prefix(tel.substring(1))
  ) {
    return '+971' + tel.substring(1)
  }

  // 9 digits with country code 971 (without +)
  if (
    tel.length === 9 + 3 &&
    tel.startsWith('971') &&
    is_ae_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+' + tel
  }

  // 9 digits with country code +971
  if (
    tel.length === 9 + 4 &&
    tel.startsWith('+971') &&
    is_ae_mobile_phone_prefix(tel.substring(4))
  ) {
    return tel
  }

  return ''
}

/**
 * @returns +971 5x xxx xxxx if valid
 * if local format:05x xxx xxxx
 * international format: +971 5x xxx xxxx
 */
export function format_ae_mobile_phone(tel: string | number): string {
  tel = to_full_ae_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+971 5x xxx xxxx')
}
