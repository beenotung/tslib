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
import * as ch from './tel/ch'
import * as fr from './tel/fr'
import * as de from './tel/de'
import * as it from './tel/it'
import * as es from './tel/es'
import * as nl from './tel/nl'
import * as be from './tel/be'
import * as at from './tel/at'

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
export * from './tel/ch'
export * from './tel/fr'
export * from './tel/de'
export * from './tel/it'
export * from './tel/es'
export * from './tel/nl'
export * from './tel/be'
export * from './tel/at'

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
 * - CH (Switzerland)
 * - FR (France)
 * - DE (Germany)
 * - IT (Italy)
 * - ES (Spain)
 * - NL (Netherlands)
 * - BE (Belgium)
 * - AT (Austria)
 *
 * Note: Some numbers without country codes are ambiguous and may match multiple countries.
 * Countries with more unique prefixes are checked first to minimize conflicts.
 * For accurate detection, include the country code (e.g., +33 for France).
 *
 * @returns the full tel number with country code, or empty string if not valid
 */
export function to_full_mobile_phone(tel: string | number): string {
  // Order: Check countries with unique patterns first, then those with overlapping patterns.
  // Countries with more unique prefixes are prioritized to minimize false matches.
  return (
    hk.to_full_hk_mobile_phone(tel) ||
    sg.to_full_sg_mobile_phone(tel) ||
    cn.to_full_cn_mobile_phone(tel) ||
    mo.to_full_mo_mobile_phone(tel) ||
    ae.to_full_ae_mobile_phone(tel) ||
    in_.to_full_in_mobile_phone(tel) ||
    jp.to_full_jp_mobile_phone(tel) ||
    my.to_full_my_mobile_phone(tel) ||
    us.to_full_us_mobile_phone(tel) ||
    es.to_full_es_mobile_phone(tel) || // 9 digits, no leading 0 - unique pattern
    vn.to_full_vn_mobile_phone(tel) || // 10 digits: 07x/08x/09x/03x/05x - has unique 03x/05x, check before Thailand for 08x/09x
    th.to_full_th_mobile_phone(tel) || // 10 digits: 06x/08x/09x - has unique 06x (conflicts with NL/FR)
    au.to_full_au_mobile_phone(tel) || // 10 digits: 04 - check before Belgium
    id.to_full_id_mobile_phone(tel) || // 9-11 digits: 08x - variable length, check after fixed-length countries
    ch.to_full_ch_mobile_phone(tel) || // 10 digits: 07x - check before France
    fr.to_full_fr_mobile_phone(tel) || // 10 digits: 06/07 - check before Netherlands
    de.to_full_de_mobile_phone(tel) ||
    it.to_full_it_mobile_phone(tel) ||
    at.to_full_at_mobile_phone(tel) ||
    nl.to_full_nl_mobile_phone(tel) || // 10 digits: 06 - most generic, check last
    be.to_full_be_mobile_phone(tel) || // 10 digits: 04 - check after Australia
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
 * - CH: +41 7x xxx xx xx
 * - FR: +33 x xx xx xx xx
 * - DE: +49 15x xxx xxxx (variable length)
 * - IT: +39 3xx xxx xxxx
 * - ES: +34 xxx xxx xxx
 * - NL: +31 6 xxxx xxxx
 * - BE: +32 4xx xx xx xx
 * - AT: +43 6xx xxx xxxx (variable length)
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
  if (tel.startsWith('+41')) {
    return ch.format_ch_mobile_phone(tel)
  }
  if (tel.startsWith('+33')) {
    return fr.format_fr_mobile_phone(tel)
  }
  if (tel.startsWith('+49')) {
    return de.format_de_mobile_phone(tel)
  }
  if (tel.startsWith('+39')) {
    return it.format_it_mobile_phone(tel)
  }
  if (tel.startsWith('+34')) {
    return es.format_es_mobile_phone(tel)
  }
  if (tel.startsWith('+31')) {
    return nl.format_nl_mobile_phone(tel)
  }
  if (tel.startsWith('+32')) {
    return be.format_be_mobile_phone(tel)
  }
  if (tel.startsWith('+43')) {
    return at.format_at_mobile_phone(tel)
  }
  throw new Error(`not supported mobile phone number: ${tel}`)
}
