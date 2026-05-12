/**
 * Sequence: streaming version of array
 */

/** using Welford's algorithm */
export function create_sequence_mean(
  options: {
    initial?: {
      sum: number
      count: number
    }
  } = {},
) {
  let sum = options.initial?.sum ?? 0
  let count = options.initial?.count ?? 0
  let mean = count === 0 ? 0 : sum / count

  function next(currentValue: number): void {
    mean += (currentValue - mean) / ++count
  }

  return {
    next,
    get mean() {
      return mean
    },
    get count() {
      return count
    },
  }
}
