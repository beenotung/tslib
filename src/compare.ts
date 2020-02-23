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

export function compare<A extends number | string>(a: A, b: A): CompareResult {
  return a < b
    ? CompareResult.Smaller
    : a > b
    ? CompareResult.Larger
    : CompareResult.Equal;
}

export function compare_by_keys<T extends object, K extends keyof T>(
  keys: K[],
) {
  return <T extends Record<K, number | string>>(a: T, b: T): CompareResult => {
    let cmp = 0;
    for (const key of keys) {
      cmp = compare(a[key], b[key]);
      if (cmp !== 0) {
        break;
      }
    }
    return cmp;
  };
}
