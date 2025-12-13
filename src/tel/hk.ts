import { format_tel_with_pattern } from './utils'

/** ******************************
 * Hong Kong mobile phone number *
 *********************************/

/**
 * 4, 7, 8 heading are allowed since 2018
 * news: https://skypost.ulifestyle.com.hk/article/2006268/
 * */
export function is_hk_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+852/, '').trim()
  switch (tel[0]) {
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      return true
    default:
      return false
  }
}

/**
 * with/without +852 prefix
 * */
export function is_hk_mobile_phone(tel: number | string): boolean {
  return to_full_hk_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @return +852xxxxyyyy if valid
 *         empty string if not valid
 * */
export function to_full_hk_mobile_phone(tel: string | number): string {
  if (typeof tel === 'number') {
    tel = tel.toString()
  }
  tel = tel
    .split('')
    .filter(x => '0' <= x && x <= '9')
    .join('')

  if (tel.length === 8 && is_hk_mobile_phone_prefix(tel)) {
    return '+852' + tel
  }
  if (
    tel.length === 8 + 3 &&
    tel.startsWith('852') &&
    is_hk_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+' + tel
  }
  if (
    tel.length === 8 + 4 &&
    tel.startsWith('+852') &&
    is_hk_mobile_phone_prefix(tel.substring(4))
  ) {
    return tel
  }
  return ''
}

/**
 * @returns +852 xxxx yyyy if valid
 */
export function format_hk_mobile_phone(tel: string | number): string {
  tel = to_full_hk_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+852 xxxx yyyy')
}
