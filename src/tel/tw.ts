import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Taiwan mobile phone number *
 *********************************/

/** Local form: 09X. */
function is_tw_local_mobile(tel: string): boolean {
  if (!tel.startsWith('09')) return false
  const digit = tel[2]
  return '0' <= digit && digit <= '8'
}

/** National form (after +886): 9X. */
function is_tw_national_mobile(tel: string): boolean {
  if (!tel.startsWith('9')) return false
  const digit = tel[1]
  return '0' <= digit && digit <= '8'
}

/**
 * Accepts local (09XX...), national (9XX...), and +886/886 forms.
 * Range: 090~098 (09X, X = 0-8); 099 is a personal-number service, not mobile.
 * reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Taiwan
 */
export function is_tw_mobile_phone_prefix(tel: string): boolean {
  tel = tel
    .replace(/^\+886/, '')
    .replace(/^886/, '')
    .trim()
  return is_tw_local_mobile(tel) || is_tw_national_mobile(tel)
}

/**
 * with/without +886 prefix
 */
export function is_tw_mobile_phone(tel: number | string): boolean {
  return to_full_tw_mobile_phone(tel) !== ''
}

/**
 * very forgiving: accepts local, bare national, and +886/886 forms, with or
 * without the leading 0.
 *
 * @returns +8869xxxxxxxx (9 digits after the country code) if valid, else ''
 */
export function to_full_tw_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // 10-digit local: 0919 929 803
  if (tel.length === 10 && is_tw_local_mobile(tel)) {
    return '+886' + tel.substring(1)
  }

  // 886 + 9-digit national: 886 919 929 803
  if (
    tel.length === 9 + 3 &&
    tel.startsWith('886') &&
    is_tw_national_mobile(tel.substring(3))
  ) {
    return '+' + tel
  }
  // 886 + 10-digit local (leading 0 kept): 886 0919 929 803
  if (
    tel.length === 10 + 3 &&
    tel.startsWith('886') &&
    is_tw_local_mobile(tel.substring(3))
  ) {
    return '+886' + tel.substring(4)
  }

  // +886 + 9-digit national: +886 919 929 803
  if (
    tel.length === 9 + 4 &&
    tel.startsWith('+886') &&
    is_tw_national_mobile(tel.substring(4))
  ) {
    return tel
  }
  // +886 + 10-digit local (leading 0 kept): +886 0919 929 803
  if (
    tel.length === 10 + 4 &&
    tel.startsWith('+886') &&
    is_tw_local_mobile(tel.substring(4))
  ) {
    return '+886' + tel.substring(5)
  }

  // bare 9-digit national: 919 929 803
  if (tel.length === 9 && is_tw_national_mobile(tel)) {
    return '+886' + tel
  }

  return ''
}

/**
 * @returns +886 9xx xxx xxx if valid
 * e.g. 0919-929-803 -> +886 919 929 803
 */
export function format_tw_mobile_phone(tel: string | number): string {
  tel = to_full_tw_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+886 9xx xxx xxx')
}
