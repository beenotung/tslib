import { tel_handlers } from './tel/registry'

// export utility functions
export * from './tel/utils'

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
  if (typeof tel == 'number') {
    tel = tel.toString()
  }

  // If country code is present, check that country first
  if (tel.startsWith('+')) {
    for (const handler of tel_handlers) {
      if (tel.startsWith(handler.country_code)) {
        const result = handler.to_full(tel)
        if (result) return result
      }
    }
  }

  // No country code or not found: Check all countries in priority order
  // Countries with unique patterns are checked first to minimize false matches
  for (const handler of tel_handlers) {
    const result = handler.to_full(tel)
    if (result) return result
  }

  return ''
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

  for (const handler of tel_handlers) {
    if (tel.startsWith(handler.country_code)) {
      return handler.format(tel)
    }
  }

  throw new Error(`not supported mobile phone number: ${tel}`)
}
