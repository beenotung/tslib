export {
  is_hk_mobile_phone_prefix,
  is_hk_mobile_phone,
  to_full_hk_mobile_phone,
} from './tel'

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
