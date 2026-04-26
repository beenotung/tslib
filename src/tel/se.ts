import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Sweden mobile phone number *
 *********************************/

/**
 * Mobile (cellular) only, not landline. Main GSM: 070, 072, 073, 076, 079; also 252, 254, 376,
 * 673-676, 710, 719 (see is_se_mobile_nsn). Rejects 08, geographic codes, and other non-mobile.
 * Format: E.164 +46 with NSN without trunk 0; display pattern varies by NSN length.
 * Reference: https://en.wikipedia.org/wiki/Telephone_numbers_in_Sweden
 */

/** NDC start (after +46/46/0) from longest to shortest; must stay aligned with `is_se_mobile_nsn` */
const SE_MOBILE_NDC_PREFIXES = [
  '710',
  '719',
  '252',
  '254',
  '376',
  '673',
  '674',
  '675',
  '676',
  '70',
  '72',
  '73',
  '76',
  '79',
] as const

/**
 * National significant number (after +46/46/0), digits only, no leading trunk 0. Input must
 * be from to_tel_digits. Returns null if not a parseable fragment.
 */
function extract_se_nsn(tel: string): string | null {
  let d = tel
  if (d.startsWith('+46')) {
    d = d.substring(3)
  } else if (d.startsWith('46') && d.length > 2) {
    d = d.substring(2)
  } else if (d.startsWith('0')) {
    d = d.substring(1)
  } else {
    if (d.length < 6 || d.length > 12) return null
  }
  if (d.startsWith('0')) d = d.substring(1)
  if (d.length < 6 || d.length > 12) return null
  return d
}

/**
 * @returns true if nsn (digits, no trunk 0) is a whitelisted mobile range; false for landline
 * and other NDCs (e.g. 8… for 08, geographic 31…, 40…)
 */
export function is_se_mobile_nsn(nsn: string): boolean {
  if (!/^\d{6,12}$/.test(nsn)) return false
  if (nsn[0] === '8') return false
  if (nsn.startsWith('710')) return /^710\d{6,9}$/.test(nsn)
  if (nsn.startsWith('719')) return /^719\d{6,9}$/.test(nsn)
  if (nsn.startsWith('252')) return /^252\d{5,6}$/.test(nsn)
  if (nsn.startsWith('254')) return /^254\d{5,6}$/.test(nsn)
  if (nsn.startsWith('376')) return /^376\d{3,4}$/.test(nsn)
  if (/^67[3456]/.test(nsn)) return /^67[3456]\d{4,5}$/.test(nsn)
  // Consumer mobile: national 070, 072, 073, 076, 079 (not 071/074/075/077/078 here)
  if (nsn.startsWith('7')) return /^7[02369]\d{7}$/.test(nsn)
  return false
}

/**
 * Short prefix check only. True if the number can start a mobile NDC; false for 08/landline
 * (leading 8 after stripping 0). Use to_full_se_mobile_phone or is_se_mobile_nsn for full match.
 */
export function is_se_mobile_phone_prefix(tel: string): boolean {
  let t = to_tel_digits(tel)
  if (t.startsWith('+46')) t = t.substring(3)
  else if (t.startsWith('46') && t.length > 2) t = t.substring(2)
  if (t.startsWith('0')) t = t.substring(1)
  if (t.startsWith('0')) t = t.substring(1)
  if (!t || t[0] === '8') return false
  for (const p of SE_MOBILE_NDC_PREFIXES) {
    if (t.startsWith(p)) return true
  }
  return false
}

/**
 * with/without +46 prefix
 */
export function is_se_mobile_phone(tel: number | string): boolean {
  return to_full_se_mobile_phone(tel) !== ''
}

/**
 * very forgiving
 *
 * @returns +46 plus NSN if valid (variable length, NO leading 0 after country code in internal form)
 *          empty string if not valid
 *
 * Format notes:
 * - Local: 070 123 45 67 (or other mobile NDCs; may include trunk 0)
 * - Internal: +46 70 123 45 67 (see is_se_mobile_nsn; not landline)
 * - Display: format_se_mobile_phone
 */
export function to_full_se_mobile_phone(tel: string | number): string {
  tel = to_tel_digits(tel)
  const nsn = extract_se_nsn(tel)
  if (!nsn || !is_se_mobile_nsn(nsn)) return ''
  return '+46' + nsn
}

function format_se_ns_to_display(nsn: string, full: string): string {
  if (nsn.length === 9) {
    return format_tel_with_pattern(full, '+46 xx xxx xx xx')
  }
  if (nsn.length === 6) {
    return format_tel_with_pattern(full, '+46 xxx xxx')
  }
  if (nsn.length === 7) {
    return format_tel_with_pattern(full, '+46 xx xxxxx')
  }
  if (nsn.length === 8) {
    return format_tel_with_pattern(full, '+46 xx xx xxxx')
  }
  if (nsn.length === 10) {
    return format_tel_with_pattern(full, '+46 xxx xxx xxxx')
  }
  if (nsn.length === 11) {
    return format_tel_with_pattern(full, '+46 xxxx xxx xxxx')
  }
  if (nsn.length === 12) {
    return format_tel_with_pattern(full, '+46 xxxx xxxx xxxx')
  }
  return full
}

/**
 * @returns +46 xx xxx xx xx if valid (or other layout; variable length)
 */
export function format_se_mobile_phone(tel: string | number): string {
  const full = to_full_se_mobile_phone(tel)
  if (!full) return full
  const nsn = full.substring(3)
  return format_se_ns_to_display(nsn, full)
}
