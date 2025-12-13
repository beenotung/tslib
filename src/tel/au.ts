import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Australia mobile phone number *
 *********************************/

export function is_au_mobile_phone_prefix(tel: string) {
  tel = tel.replace(/^\+61/, '').trim()
  return tel.startsWith('4') || tel.startsWith('04')
}

/**
 * with/without +61 prefix
 */
export function is_au_mobile_phone(tel: number | string): boolean {
  return to_full_au_mobile_phone(tel) !== ''
}

/**
 * landline number example:
 * excluding area code: xxxx xxxx
 * including area code: (07) xxxx xxxx
 * including country and area code: +61 7 xxxx xxxx
 * the area code can be 2-digit, being "0x", or 1 digit, being "1"
 *
 * mobile number example:
 * country code: +61
 * mobile prefix: e.g. starting with 4 (area and operator code)
 * local number: 8 digits
 *
 * Within Australia, mobile phone numbers begin with 04– the Australian national trunk code 0,
 * plus the mobile indicator 4 – followed by eight digits.
 *
 * This is generally written as 04XX XXX XXX within Australia,
 * or as +61 4XX XXX XXX for an international audience.
 *
 * reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Australia
 */
export function to_full_au_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)
  if (tel.length == 8 + 4 && tel.startsWith('+614')) {
    return tel
  }
  if (tel.length == 8 + 3 && tel.startsWith('614')) {
    return '+' + tel
  }
  if (tel.length == 8 + 2 && tel.startsWith('04')) {
    return '+614' + tel.substring(2)
  }
  return ''
}

export function format_au_mobile_phone(tel: string | number): string {
  tel = to_full_au_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+61 4xx xxx xxx')
}
