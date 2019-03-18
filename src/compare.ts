/**
 * inclusive
 * */
export function isBetween<A extends number | string>(
  a: A,
  b: A,
  c: A,
): boolean {
  return a <= b && b <= c;
}

export enum CompareResult {
  Smaller = -1,
  Equal = 0,
  Larger = 1,
}

export function compare(a, b): CompareResult {
  return a < b
    ? CompareResult.Smaller
    : a > b
    ? CompareResult.Larger
    : CompareResult.Equal;
}
