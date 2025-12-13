import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Singapore mobile phone number *
 *********************************/

/**
 * starts with 8, 9
 * reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Singapore
 */
export function is_sg_mobile_phone_prefix(tel: string) {
  tel = tel.replace(/^\+65/, '').trim()
  switch (tel[0]) {
    case '8':
    case '9':
      return true
    default:
      return false
  }
}

/**
 * with/without +65 prefix
 */
export function is_sg_mobile_phone(tel: number | string): boolean {
  return to_full_sg_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +65xxxxyyyy if valid
 *          empty string if not valid
 */
export function to_full_sg_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)
  if (tel.length === 8 && is_sg_mobile_phone_prefix(tel)) {
    return '+65' + tel
  }
  if (
    tel.length === 8 + 2 &&
    tel.startsWith('65') &&
    is_sg_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+' + tel
  }
  if (
    tel.length === 8 + 3 &&
    tel.startsWith('+65') &&
    is_sg_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }
  return ''
}

/**
 * @returns +65 xxxx yyyy if valid
 */
export function format_sg_mobile_phone(tel: string | number): string {
  tel = to_full_sg_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+65 xxxx yyyy')
}
