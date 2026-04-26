import { format_tel_with_pattern, to_tel_digits } from './utils'

/** ******************************
 * Sweden mobile phone number *
 *********************************/

/**
 * **Mobile (cellular) only** — this module does **not** treat Swedish **fixed/landline**
 * numbers (geographic 02/03/04/05/06…, national 08/010…, etc.) as valid.
 * Validation is a **mobile whitelist** in `is_se_mobile_nsn`, not a “Swedish number” detector.
 *
 * Whitelisted (examples):
 * - **Main mobile (GSM) — national 070, 072, 073, 076, 079** (9-digit NSN after +46: `7[02369]`
 *   plus 7 subscriber digits, i.e. not 071, 074, 075, 077, 078 in this branch).
 * - 0252, 0254, 0376, 0673-0676 (certain mobile or mobile-like NDCs)
 * - 0710, 0719 (M2M / longer NSN, etc. — heuristics, see PTS for authoritative data)
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
 * E.164 NSN after +46, no leading trunk 0, digits only. Returns null if not parseable
 * as a Swedish number fragment.
 */
function extract_se_nsn(tel: string): string | null {
  let d = to_tel_digits(tel)
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
 * @returns true only if `nsn` (digits, no trunk 0) is a **whitelisted mobile** NSN.
 * All fixed/landline and non-mobile NDCs are **rejected** (e.g. NSN `8…` for 08 Stockholm;
 * geographic 31…, 40…, 18…, etc. never match the whitelist).
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
 * With/without +46: true if the string **can** start a whitelisted **mobile** NDC (not fixed line).
 * For definitive validation (full number, not landline), use `is_se_mobile_nsn` after
 * `extract` via `to_full_se_mobile_phone` or parse NSN the same way as `to_full_se_mobile_phone`.
 * Rejects leading national `8…` (08 fixed line when 0 is stripped).
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

export function is_se_mobile_phone(tel: number | string): boolean {
  return to_full_se_mobile_phone(tel) !== ''
}

/**
 * @returns +46 + NSN if valid Swedish **mobile** only (excludes 08, geographic, etc.)
 */
export function to_full_se_mobile_phone(tel: string | number): string {
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
 * @returns display string for a valid Swedish mobile (variable length)
 */
export function format_se_mobile_phone(tel: string | number): string {
  const full = to_full_se_mobile_phone(tel)
  if (!full) return full
  const nsn = full.substring(3)
  return format_se_ns_to_display(nsn, full)
}
