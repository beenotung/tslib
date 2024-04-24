/**
 *  @description combination: order doesn't matter
 *  @description known bug: will have integer overflow when the list is too long
 */
export function any_combinations<T>(xs: T[]): T[][] {
  const xss: T[][] = []
  const listLen = xs.length
  const combinationCount = 1 << listLen
  for (let i = 1; i < combinationCount; i++) {
    const ys: T[] = []
    for (let j = 0; j < listLen; j++) {
      if (i & (1 << j)) {
        ys.push(xs[j])
      }
    }
    xss.push(ys)
  }
  return xss
}

/** @description combination: order doesn't matter */
export function n_combinations<T>(n: number, xs: T[]): T[][] {
  if (n == 0) return []
  if (n == 1) return xs.map(x => [x])
  return xs.flatMap((x, i) =>
    n_combinations(n - 1, xs.slice(i + 1)).map(xs => [x, ...xs]),
  )
}

/** @deprecated renamed to `any_combinations` */
export const combinations = any_combinations
