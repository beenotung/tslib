// to batch process async operation in parallel, e.g. downloading files
export async function parallel_run<T>(
  xs: T[],
  f: (data: T) => Promise<void>,
  n_partition: number,
) {
  async function run_partition(offset: number) {
    for (let i = offset; i < xs.length; i += n_partition) {
      await f(xs[i])
    }
  }

  const ps: Array<Promise<void>> = []
  for (let i = 0; i < n_partition; i++) {
    ps.push(run_partition(i))
  }
  await Promise.all(ps)
}
