/** ********************************
 * Combined for multiple countries *
 ***********************************/

export function is_mobile_phone(tel: number | string): boolean {
  return to_full_mobile_phone(tel) !== ''
}

/**
 * check if the tel is mobile phone number in:
 * - HK (Hong Kong)
 * - SG (Singapore)
 * - AU (Australia)
 * - CN (China Mainland)
 *
 * @returns the full tel number with country code, or empty string if not valid
 */
export function to_full_mobile_phone(tel: string | number): string {
  return (
    to_full_hk_mobile_phone(tel) ||
    to_full_sg_mobile_phone(tel) ||
    to_full_au_mobile_phone(tel) ||
    to_full_cn_mobile_phone(tel) ||
    ''
  )
}

/**
 * format the mobile phone number with pattern if valid:
 * - HK: +852 xxxx yyyy
 * - SG: +65 xxxx yyyy
 * - AU: +61 4xx xxx xxx
 * - CN: +86 1nn xxxx xxxx
 */
export function format_mobile_phone(tel: string | number): string {
  tel = to_full_mobile_phone(tel)
  if (!tel) return tel
  if (tel.startsWith('+852')) {
    return format_hk_mobile_phone(tel)
  }
  if (tel.startsWith('+65')) {
    return format_sg_mobile_phone(tel)
  }
  if (tel.startsWith('+61')) {
    return format_au_mobile_phone(tel)
  }
  if (tel.startsWith('+86')) {
    return format_cn_mobile_phone(tel)
  }
  throw new Error(`not supported mobile phone number: ${tel}`)
}

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

/** **************************
 * China mobile phone number *
 *****************************/

/**
 * starts with 1, second digit is 3,4, 5, 6, 7, 8
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

/** *****************
 * helper functions *
 ********************/

/**
 * helper function to format tel with pattern
 */
export function format_tel_with_pattern(tel: string, pattern: string): string {
  tel = to_tel_digits(tel)
  if (!tel) return tel
  let expectedLength = pattern.replaceAll(' ', '').length
  if (tel.length != expectedLength) {
    throw new Error(
      `invalid length, expect length ${expectedLength} but got length ${tel.length}`,
    )
  }
  let offset = 0
  return pattern
    .split(' ')
    .map(pattern => {
      let length = pattern.length
      let part = tel.slice(offset, offset + length)
      offset += length
      return part
    })
    .join(' ')
}

/**
 * remove space, hyphen, bracket, etc.
 *
 * preserve only digits and +
 */
function to_tel_digits(tel: string | number): string {
  if (typeof tel === 'number') {
    tel = tel.toString()
  }
  return tel
    .split('')
    .filter(x => x == '+' || ('0' <= x && x <= '9'))
    .join('')
}
