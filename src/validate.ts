/**
 * without +852 prefix
 * */
export function is_hk_mobile_phone(x: number | string): boolean {
  if (!x) {
    return false;
  }
  const s = x.toString();
  return s.length === 8
    && ( s[0] === '6'
      || s[0] === '9'
      || s[0] === '5'
    )
    ;
}
