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
  const sum = options.initial?.sum ?? 0
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

export function create_sequence_standard_deviation(
  options: {
    initial?: {
      sum_of_squares: number
      mean: number
      count: number
    }
  } = {},
) {
  let count = options.initial?.count ?? 0
  let mean = options.initial?.mean ?? 0
  let sum_of_squares = options.initial?.sum_of_squares ?? 0

  function next(currentValue: number): void {
    count++
    const delta_old = currentValue - mean
    mean += delta_old / count
    const delta_new = currentValue - mean
    sum_of_squares += delta_old * delta_new
  }

  return {
    next,
    get count() {
      return count
    },
    get mean() {
      return mean
    },
    get sum_of_squares() {
      return sum_of_squares
    },
    get_variance(mode: 'sample' | 'population' = 'sample') {
      if (mode === 'sample') {
        return sum_of_squares / (count - 1)
      } else {
        return sum_of_squares / count
      }
    },
    get_standard_deviation(mode: 'sample' | 'population' = 'sample') {
      return Math.sqrt(this.get_variance(mode))
    },
  }
}
