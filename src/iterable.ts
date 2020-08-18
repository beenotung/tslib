/**
 * like Array.from(xs).map(f)
 * but more performant by performing the lookup in one-pass
 * */
export function mapIterableToArray<T, R>(
  xs: Iterable<T>,
  f: (x: T, i: number) => R,
): R[] {
  const res: R[] = []
  let i = 0
  for (const x of xs) {
    res.push(f(x, i))
    i++
  }
  return res
}
