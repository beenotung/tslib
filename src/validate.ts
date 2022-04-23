/**
 * 4, 7, 8 heading are allowed since 2018
 * news: https://skypost.ulifestyle.com.hk/article/2006268/
 * */
export function is_hk_mobile_phone_prefix(s: string): boolean {
  s = s.replace(/^\+852/, '').trim()
  switch (s[0]) {
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
export function is_hk_mobile_phone(x: number | string): boolean {
  return to_full_hk_mobile_phone(x) !== ''
}

/**
 * very forgiving
 *
 * @return +852xxxxyyyy if valid
 *         empty string if not valid
 * */
export function to_full_hk_mobile_phone(s: string | number): string {
  if (typeof s === 'number') {
    s = s.toString()
  }
  s = s
    .split('')
    .filter(x => '0' <= x && x <= '9')
    .join('')

  if (s.length === 8 && is_hk_mobile_phone_prefix(s)) {
    return '+852' + s
  }
  if (
    s.length === 8 + 3 &&
    s.startsWith('852') &&
    is_hk_mobile_phone_prefix(s.substring(3))
  ) {
    return '+' + s
  }
  if (
    s.length === 8 + 4 &&
    s.startsWith('+852') &&
    is_hk_mobile_phone_prefix(s.substring(4))
  ) {
    return s
  }
  return ''
}

export function is_email(s: string): boolean {
  if (!s) {
    return false
  }
  const ss = s.split('@')
  if (ss.length !== 2) {
    return false
  }
  const domain = ss[1]
  if (domain !== domain.trim()) {
    return false
  }
  const names = domain.split('.')
  if (names.some(s => !s) || names.length < 2) {
    return false
  }
  const username = ss[0]
  if (username !== username.trim()) {
    return false
  }
  return username.length > 0
}
