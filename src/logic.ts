export function xor(a: boolean | any, b: boolean | any): boolean {
  return !!((a ? 1 : 0) ^ (b ? 1 : 0))
}

/** inclusive */
export const between = <A extends string | number>(a: A, b: A, c: A) =>
  a <= b && b <= c
