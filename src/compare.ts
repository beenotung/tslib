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

export type SortKey<K> = {
  key: K;
  order: 'asc' | 'desc';
};

export function compare_by_keys<T extends object, K extends keyof T>(
  _keys: Array<K | SortKey<K>>,
) {
  const keys: Array<SortKey<K>> = _keys.map(key => {
    if (typeof key === 'object') {
      return key;
    }
    return { key, order: 'asc' };
  });
  return <T extends Record<K, number | string>>(a: T, b: T): CompareResult => {
    for (const { key, order } of keys) {
      const cmp = compare(a[key], b[key]);
      if (cmp !== 0) {
        return order === 'desc' ? -cmp : cmp;
      }
    }
    return 0;
  };
}
