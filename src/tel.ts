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
 * - MO (Macau)
 * - AE (UAE/Dubai)
 * - TH (Thailand)
 * - IN (India)
 * - JP (Japan)
 * - VN (Vietnam)
 * - ID (Indonesia)
 *
 * @returns the full tel number with country code, or empty string if not valid
 */
export function to_full_mobile_phone(tel: string | number): string {
  return (
    to_full_hk_mobile_phone(tel) ||
    to_full_sg_mobile_phone(tel) ||
    to_full_au_mobile_phone(tel) ||
    to_full_cn_mobile_phone(tel) ||
    to_full_mo_mobile_phone(tel) ||
    to_full_ae_mobile_phone(tel) ||
    to_full_th_mobile_phone(tel) ||
    to_full_in_mobile_phone(tel) ||
    to_full_jp_mobile_phone(tel) ||
    to_full_vn_mobile_phone(tel) ||
    to_full_id_mobile_phone(tel) ||
    ''
  )
}

/**
 * format the mobile phone number with pattern if valid:
 * - HK: +852 xxxx yyyy
 * - SG: +65 xxxx yyyy
 * - AU: +61 4xx xxx xxx
 * - CN: +86 1nn xxxx xxxx
 * - MO: +853 xxxx yyyy
 * - AE: +971 5x xxx xxxx (accepts both local 05x xxx xxxx and international formats)
 * - TH: +66 8x xxx xxxx
 * - IN: +91 xxxxx xxxxx
 * - JP: +81 90 xxxx xxxx
 * - VN: +84 9xx xxx xxxx
 * - ID: +62 8xx xxx xxx (format varies by length: 9-11 digits)
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
  if (tel.startsWith('+853')) {
    return format_mo_mobile_phone(tel)
  }
  if (tel.startsWith('+971')) {
    return format_ae_mobile_phone(tel)
  }
  if (tel.startsWith('+66')) {
    return format_th_mobile_phone(tel)
  }
  if (tel.startsWith('+91')) {
    return format_in_mobile_phone(tel)
  }
  if (tel.startsWith('+81')) {
    return format_jp_mobile_phone(tel)
  }
  if (tel.startsWith('+84')) {
    return format_vn_mobile_phone(tel)
  }
  if (tel.startsWith('+62')) {
    return format_id_mobile_phone(tel)
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
 * */
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

/** ******************************
 * Thailand mobile phone number *
 *********************************/

/**
 * starts with 06, 08, or 09 (two-digit prefix)
 * Mobile prefixes: 06x (060-068), 08x (080-089), 09x (090-099)
 * reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Thailand
 */
export function is_th_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+66/, '').trim()
  // Remove leading 0 if present
  if (tel.startsWith('0')) {
    tel = tel.substring(1)
  }
  // After removing leading 0, should start with 06, 08, or 09 (two-digit prefix)
  if (tel.length < 2) return false
  const prefix = tel.substring(0, 2)
  return prefix === '06' || prefix === '08' || prefix === '09'
}

/**
 * with/without +66 prefix
 */
export function is_th_mobile_phone(tel: number | string): boolean {
  return to_full_th_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +66xxxxxxxxx if valid (9 digits after country code)
 *          empty string if not valid
 */
export function to_full_th_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Country code +66: 10 digits with leading 0, or 9 digits without leading 0
  // Examples: +66 081 234 5678 (with 0) or +66 81 234 5678 (without 0)
  // Result: +66 81 234 5678 (always 9 digits after +66, NO leading 0)
  if (
    tel.length === 10 + 3 &&
    tel.startsWith('+66') &&
    tel.substring(3).startsWith('0') &&
    is_th_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+66' + tel.substring(4)
  }
  if (
    tel.length === 9 + 3 &&
    tel.startsWith('+66') &&
    is_th_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  // Country code 66 (without +): 10 digits with leading 0, or 9 digits without leading 0
  // Examples: 66 081 234 5678 (with 0) or 66 81 234 5678 (without 0)
  // Result: +66 81 234 5678 (always 9 digits after +66, NO leading 0)
  if (
    tel.length === 10 + 2 &&
    tel.startsWith('66') &&
    tel.substring(2).startsWith('0') &&
    is_th_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+66' + tel.substring(3)
  }
  if (
    tel.length === 9 + 2 &&
    tel.startsWith('66') &&
    is_th_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+' + tel
  }

  // Local format: 10 digits with leading 0, or 9 digits without leading 0
  // Examples: 081 234 5678 (with 0) or 81 234 5678 (without 0)
  // Result: +66 81 234 5678 (always 9 digits after +66, NO leading 0)
  if (
    tel.length === 10 &&
    tel.startsWith('0') &&
    is_th_mobile_phone_prefix(tel)
  ) {
    return '+66' + tel.substring(1)
  }
  if (tel.length === 9 && is_th_mobile_phone_prefix(tel)) {
    return '+66' + tel
  }

  return ''
}

/**
 * @returns +66 AA BBB BBBB if valid
 */
export function format_th_mobile_phone(tel: string | number): string {
  tel = to_full_th_mobile_phone(tel)
  if (!tel) return tel

  // Remove leading zero if present (legacy support)
  const digits = to_tel_digits(tel).replace('+66', '')
  if (digits.length === 10 && digits.startsWith('0')) {
    tel = '+66' + digits.substring(1)
  }

  return format_tel_with_pattern(tel, '+66 AA BBB BBBB')
}

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

/** ******************************
 * Japan mobile phone number *
 *********************************/

/**
 * starts with 070, 080, or 090
 * Mobile telephony and data services (PDC, J-CDMA, UMTS)
 * reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Japan
 */
export function is_jp_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+81/, '').trim()
  // Check if it starts with 070, 080, or 090 (with leading 0)
  if (tel.startsWith('0') && tel.length >= 3) {
    const prefix = tel.substring(0, 3)
    return prefix === '070' || prefix === '080' || prefix === '090'
  }
  // Check if it starts with 70, 80, or 90 (without leading 0)
  if (tel.length >= 2) {
    const prefix = tel.substring(0, 2)
    return prefix === '70' || prefix === '80' || prefix === '90'
  }
  return false
}

/**
 * with/without +81 prefix
 */
export function is_jp_mobile_phone(tel: number | string): boolean {
  return to_full_jp_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +81xxxxxxxxxx if valid (10 digits after country code)
 *          empty string if not valid
 *
 * Handles all combinations (ordered by specificity - longest first):
 * WITH leading 0 (11 digits):
 * - Country code +81: +8109012345678 → +819012345678
 * - Country code 81 (no +): 8109012345678 → +819012345678
 * - No country code: 09012345678 → +819012345678
 *
 * WITHOUT leading 0 (10 digits):
 * - Country code +81: +819012345678 → +819012345678
 * - Country code 81 (no +): 819012345678 → +819012345678
 * - No country code: 9012345678 → +819012345678
 */
export function to_full_jp_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // 14 digits with country code +81 and leading 0 (most specific - longest pattern)
  // Format: +81 + 0 + 10 digits (11 digits with leading 0)
  // Result: 10 digits after +81 (removes leading 0)
  if (
    tel.length === 11 + 3 &&
    tel.startsWith('+81') &&
    tel.substring(3).startsWith('0') &&
    is_jp_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+81' + tel.substring(4) // Skip '+81' and '0'
  }

  // 13 digits with country code 81 (without +) and leading 0
  // Format: 81 + 0 + 10 digits (11 digits with leading 0)
  // Result: 10 digits after +81 (removes leading 0)
  if (
    tel.length === 11 + 2 &&
    tel.startsWith('81') &&
    tel.substring(2).startsWith('0') &&
    is_jp_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+81' + tel.substring(3) // Skip '81' and '0'
  }

  // 11 digits starting with 090, 080, or 070 (local format with leading 0)
  // Result: 10 digits after +81 (removes leading 0)
  if (
    tel.length === 11 &&
    tel.startsWith('0') &&
    is_jp_mobile_phone_prefix(tel)
  ) {
    return '+81' + tel.substring(1)
  }

  // 13 digits with country code +81 and without leading 0
  // Format: +81 + 10 digits
  // Result: 10 digits after +81
  if (
    tel.length === 10 + 3 &&
    tel.startsWith('+81') &&
    is_jp_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  // 12 digits with country code 81 (without +) and without leading 0
  // Format: 81 + 10 digits
  // Result: 10 digits after +81
  if (
    tel.length === 10 + 2 &&
    tel.startsWith('81') &&
    is_jp_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+' + tel
  }

  // 10 digits starting with 90, 80, or 70 (local format without leading 0)
  // Result: 10 digits after +81
  if (tel.length === 10 && is_jp_mobile_phone_prefix(tel)) {
    return '+81' + tel
  }

  return ''
}

/**
 * @returns +81 90 xxxx xxxx if valid
 */
export function format_jp_mobile_phone(tel: string | number): string {
  tel = to_full_jp_mobile_phone(tel)
  if (!tel) return tel
  return format_tel_with_pattern(tel, '+81 90 xxxx xxxx')
}

/** ******************************
 * Vietnam mobile phone number *
 *********************************/

/**
 * Checks if the number starts with a valid Vietnam mobile phone prefix
 *
 * Valid prefixes: 09x, 08x, 07x, 03x, or 05x (where x is any digit)
 * Format: 09/08/07/05/03xx xxx xxx (10 digits with leading 0 in local format)
 * Reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Vietnam
 */
export function is_vn_mobile_phone_prefix(tel: string): boolean {
  tel = tel.replace(/^\+84/, '').trim()
  // Check prefix with leading 0 (local format: 091 234 5678)
  if (tel.startsWith('0') && tel.length >= 3) {
    const firstTwo = tel.substring(0, 2)
    // Valid prefixes: 09, 08, 07, 03, 05
    return ['09', '08', '07', '03', '05'].includes(firstTwo)
  }
  // Check prefix without leading 0 (internal format: 91 234 5678)
  // Should start with 9, 8, 7, 3, or 5 (first digit of mobile prefixes)
  if (tel.length >= 1) {
    const firstDigit = tel[0]
    return ['9', '8', '7', '3', '5'].includes(firstDigit)
  }
  return false
}

/**
 * with/without +84 prefix
 */
export function is_vn_mobile_phone(tel: number | string): boolean {
  return to_full_vn_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +84xxxxxxxxx if valid (9 digits after country code, NO leading 0 in internal format)
 *          empty string if not valid
 *
 * Format notes:
 * - Local format: 091 234 5678 (10 digits WITH leading 0) - used in Vietnam
 * - Internal format: +84 98 765 4321 (9 digits after +84, NO leading 0) - always 9 digits
 * - Display format: +84 98 765 4321 (formatted by format_vn_mobile_phone)
 */
export function to_full_vn_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)

  // Local format: 10 digits with leading 0, or 9 digits without leading 0
  // Examples: 091 234 5678 (with 0) or 91 234 5678 (without 0)
  // Result: +84 98 765 4321 (always 9 digits after +84)
  if (
    tel.length === 10 &&
    tel.startsWith('0') &&
    is_vn_mobile_phone_prefix(tel)
  ) {
    return '+84' + tel.substring(1)
  }
  if (tel.length === 9 && is_vn_mobile_phone_prefix(tel)) {
    return '+84' + tel
  }

  // Country code 84 (without +): 10 digits with leading 0, or 9 digits without leading 0
  // Examples: 84 091 234 5678 (with 0) or 84 91 234 5678 (without 0)
  // Result: +84 98 765 4321 (always 9 digits after +84)
  if (
    tel.length === 10 + 2 &&
    tel.startsWith('84') &&
    tel.substring(2).startsWith('0') &&
    is_vn_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+84' + tel.substring(3)
  }
  if (
    tel.length === 9 + 2 &&
    tel.startsWith('84') &&
    is_vn_mobile_phone_prefix(tel.substring(2))
  ) {
    return '+' + tel
  }

  // Country code +84: 10 digits with leading 0, or 9 digits without leading 0
  // Examples: +84 091 234 5678 (with 0) or +84 91 234 5678 (without 0)
  // Result: +84 98 765 4321 (always 9 digits after +84)
  if (
    tel.length === 10 + 3 &&
    tel.startsWith('+84') &&
    tel.substring(3).startsWith('0') &&
    is_vn_mobile_phone_prefix(tel.substring(3))
  ) {
    return '+84' + tel.substring(4)
  }
  if (
    tel.length === 9 + 3 &&
    tel.startsWith('+84') &&
    is_vn_mobile_phone_prefix(tel.substring(3))
  ) {
    return tel
  }

  return ''
}

/**
 * @returns +84 AA BBB BBBB if valid
 */
export function format_vn_mobile_phone(tel: string | number): string {
  tel = to_full_vn_mobile_phone(tel)
  if (!tel) return tel

  // Remove leading zero if present (legacy support)
  const digits = to_tel_digits(tel).replace('+84', '')
  if (digits.length === 10 && digits.startsWith('0')) {
    tel = '+84' + digits.substring(1)
  }

  return format_tel_with_pattern(tel, '+84 AA BBB BBBB')
}

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

/** *****************
 * helper functions *
 ********************/

/**
 * helper function to format tel with pattern
 */
export function format_tel_with_pattern(tel: string, pattern: string): string {
  tel = to_tel_digits(tel)
  if (!tel) return tel
  const expectedLength = pattern.replaceAll(' ', '').length
  if (tel.length != expectedLength) {
    throw new Error(
      `invalid length, expect length ${expectedLength} but got length ${tel.length}`,
    )
  }
  let offset = 0
  return pattern
    .split(' ')
    .map(pattern => {
      const length = pattern.length
      const part = tel.slice(offset, offset + length)
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
export function to_tel_digits(tel: string | number): string {
  if (typeof tel === 'number') {
    tel = tel.toString()
  }
  return tel
    .split('')
    .filter(x => x == '+' || ('0' <= x && x <= '9'))
    .join('')
}
