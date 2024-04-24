/** @description permutation: order matters */
export function n_permutation<T>(n: number, xs: T[]): T[][] {
  if (n == 0) return []
  if (n == 1) return xs.map(x => [x])
  return xs.flatMap(x => n_permutation(n - 1, xs).map(xs => [x, ...xs]))
}
