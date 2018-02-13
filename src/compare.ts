/**
 * inclusive
 * */
export function isBetween<A extends number | string>(a: A, b: A, c: A): boolean {
  return a <= b && b <= c;
}
