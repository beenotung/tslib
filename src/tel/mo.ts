import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Macau mobile phone number *
 *********************************/

/**
 * starts with 6
 * news: https://en.wikipedia.org/wiki/Telephone_numbers_in_Macau
 * */
export function is_mo_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+853/, '').trim()
  switch (tel[0]) {
    case '6':
      return true
    default:
      return false
  }
}

/**
 * with/without +853 prefix
 */
export function is_mo_mobile_phone(tel: number | string): boolean {
  return to_full_mo_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @return +853xxxxyyyy if valid
 *         empty string if not valid
 * */
export function to_full_mo_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)
  if (tel.length === 8 && is_mo_mobile_phone_prefix(tel)) {
    return '+853' + tel
  }
  if (
    tel.length === 8 + 3 &&
    tel.startsWith('853') &&
    is_mo_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+' + tel
  }
  if (
    tel.length === 8 + 4 &&
    tel.startsWith('+853') &&
    is_mo_mobile_phone_prefix(tel.substring(4))
  ) {
    return tel
  }
  return ''
}

/**
 * @returns +853 xxxx yyyy if valid
 */
export function format_mo_mobile_phone(tel: string | number): string {
  tel = to_full_mo_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+853 xxxx yyyy')
}
