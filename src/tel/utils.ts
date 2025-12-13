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

// export type TelRegion = {
//   /** e.g. '+852' for Hong Kong */
//   region_code: string

//   /**
//    * check if the tel is mobile phone number in this region
//    * e.g. '+852xxxxyyyy' -> true
//    * */
//   is_mobile_phone_prefix: (tel: string) => boolean

//   /** helper function, calling `to_full_mobile_phone(tel) !== ''` */
//   is_mobile_phone: (tel: number | string) => boolean

//   /** return the full tel number with country code, or empty string if not valid */
//   to_full_mobile_phone: (tel: string | number) => string

//   /**
//    * return the formatted tel number with pattern if valid:
//    * e.g. '+852 xxxx yyyy' for Hong Kong
//    */
//   format_mobile_phone: (tel: string | number) => string
// }

// let tel_regions: TelRegion[] = []

// export function register_tel_region(args: Omit<TelRegion, 'is_mobile_phone'>) {
//   let region: TelRegion = {
//     ...args,
//     is_mobile_phone(tel: number | string): boolean {
//       return args.to_full_mobile_phone(tel) !== ''
//     },
//   }
//   tel_regions.push(region)
//   return region
// }
