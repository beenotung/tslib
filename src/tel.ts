// export utility functions
export * from './tel/utils'

// import all region-specific functions
import * as hk from './tel/hk'
import * as sg from './tel/sg'
import * as au from './tel/au'
import * as cn from './tel/cn'
import * as mo from './tel/mo'
import * as ae from './tel/ae'
import * as th from './tel/th'
import * as in_ from './tel/in'
import * as jp from './tel/jp'
import * as vn from './tel/vn'
import * as id from './tel/id'
import * as my from './tel/my'
import * as us from './tel/us'

// export all region-specific functions
export * from './tel/hk'
export * from './tel/sg'
export * from './tel/au'
export * from './tel/cn'
export * from './tel/mo'
export * from './tel/ae'
export * from './tel/th'
export * from './tel/in'
export * from './tel/jp'
export * from './tel/vn'
export * from './tel/id'
export * from './tel/my'
export * from './tel/us'

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
 * - MY (Malaysia)
 * - US (United States)
 *
 * @returns the full tel number with country code, or empty string if not valid
 */
export function to_full_mobile_phone(tel: string | number): string {
  return (
    hk.to_full_hk_mobile_phone(tel) ||
    sg.to_full_sg_mobile_phone(tel) ||
    au.to_full_au_mobile_phone(tel) ||
    cn.to_full_cn_mobile_phone(tel) ||
    mo.to_full_mo_mobile_phone(tel) ||
    ae.to_full_ae_mobile_phone(tel) ||
    vn.to_full_vn_mobile_phone(tel) ||
    th.to_full_th_mobile_phone(tel) ||
    in_.to_full_in_mobile_phone(tel) ||
    jp.to_full_jp_mobile_phone(tel) ||
    id.to_full_id_mobile_phone(tel) ||
    my.to_full_my_mobile_phone(tel) ||
    us.to_full_us_mobile_phone(tel) ||
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
 * - MY: +60 XX XXX XXXX (format varies by length: 9 or 10 digits)
 * - US: +1 xxx xxx xxxx
 */
export function format_mobile_phone(tel: string | number): string {
  tel = to_full_mobile_phone(tel)
  if (!tel) return tel

  if (tel.startsWith('+852')) {
    return hk.format_hk_mobile_phone(tel)
  }
  if (tel.startsWith('+65')) {
    return sg.format_sg_mobile_phone(tel)
  }
  if (tel.startsWith('+61')) {
    return au.format_au_mobile_phone(tel)
  }
  if (tel.startsWith('+86')) {
    return cn.format_cn_mobile_phone(tel)
  }
  if (tel.startsWith('+853')) {
    return mo.format_mo_mobile_phone(tel)
  }
  if (tel.startsWith('+971')) {
    return ae.format_ae_mobile_phone(tel)
  }
  if (tel.startsWith('+66')) {
    return th.format_th_mobile_phone(tel)
  }
  if (tel.startsWith('+91')) {
    return in_.format_in_mobile_phone(tel)
  }
  if (tel.startsWith('+81')) {
    return jp.format_jp_mobile_phone(tel)
  }
  if (tel.startsWith('+84')) {
    return vn.format_vn_mobile_phone(tel)
  }
  if (tel.startsWith('+62')) {
    return id.format_id_mobile_phone(tel)
  }
  if (tel.startsWith('+60')) {
    return my.format_my_mobile_phone(tel)
  }
  if (tel.startsWith('+1')) {
    return us.format_us_mobile_phone(tel)
  }
  throw new Error(`not supported mobile phone number: ${tel}`)
}
