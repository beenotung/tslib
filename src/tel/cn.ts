import { format_tel_with_pattern, to_tel_digits } from './utils'

/** **************************
 * China mobile phone number *
 *****************************/

/**
 * starts with 1, second digit is 3, 4, 5, 6, 7, 8, or 9
 * reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_China
 */
export function is_cn_mobile_phone_prefix(tel: string) {
  tel = tel.replace(/^\+86/, '').trim()
  if (tel.length < 2) return false
  if (tel[0] !== '1') return false
  const secondDigit = tel[1]
  return ['3', '4', '5', '6', '7', '8', '9'].includes(secondDigit)
}

/**
 * with/without +86 prefix
 */
export function is_cn_mobile_phone(tel: number | string): boolean {
  return to_full_cn_mobile_phone(tel) !== ''
}

/**
 * @returns +86xxxxxxxxxx if valid
 *          empty string if not valid
 *
 * should be 1xx-XXXX-XXXX (except for 140–144, which are 13-digit IoT numbers)
 * in which the first three digits (13x to 19x) designate the mobile phone service provider.
 */
export function to_full_cn_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // 11 digits starting with 1 (local format)
  if (tel.length === 11 && is_cn_mobile_phone_prefix(tel)) {
    return '+86' + tel
  }

  // 11 digits with country code 86 (without +)
  if (
    tel.length === 11 + 2 &&
    tel.startsWith('86') &&
    is_cn_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+' + tel
  }

  // 11 digits with country code +86
  if (
    tel.length === 11 + 3 &&
    tel.startsWith('+86') &&
    is_cn_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  return ''
}

/**
 * @returns +86 1nn xxxx xxxx if valid
 */
export function format_cn_mobile_phone(tel: string | number): string {
  tel = to_full_cn_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+86 1nn xxxx xxxx')
}
