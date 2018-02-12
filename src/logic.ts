export function xor(a: boolean | any, b: boolean | any): boolean {
  return !!((a ? 1 : 0) ^ (b ? 1 : 0));
}

/** inclusive */
export const between = (a, b, c) => a <= b && b <= c;
