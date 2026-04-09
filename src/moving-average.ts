import { RingBuffer } from './ring-buffer'

export function create_exponential_moving_average(
  options: {
    initial_value?: number
  } & ({ alpha: number } | { beta: number }),
) {
  let acc: number | undefined = options.initial_value

  let alpha: number
  let beta: number
  if ('alpha' in options) {
    alpha = options.alpha
    beta = 1 - alpha
  } else if ('beta' in options) {
    beta = options.beta
    alpha = 1 - beta
  } else {
    throw new Error('either alpha or beta must be provided')
  }

  function next(current_value: number): number {
    if (acc === undefined) {
      acc = current_value
      return acc
    }
    acc = acc * alpha + current_value * beta
    return acc
  }

  function get_value(): number {
    if (acc === undefined) {
      throw new Error('no value yet')
    }
    return acc
  }

  return {
    next,
    get_value,
    alpha,
    beta,
  }
}

export function create_sliding_window_average(options: {
  window_size: number
  initial_value?: number
}) {
  if (!('window_size' in options)) {
    throw new Error('missing window_size')
  }
  const window_size = options.window_size
  if (!(window_size > 0)) {
    throw new Error('window_size must be positive and non-zero')
  }

  const ring_buffer = new RingBuffer<number>(window_size)

  let acc: number | undefined

  if ('initial_value' in options) {
    acc = options.initial_value! * window_size
    for (let i = 0; i < window_size; i++) {
      ring_buffer.enqueue(options.initial_value!)
    }
  }

  function next(current_value: number): number {
    if (ring_buffer.length === window_size) {
      const x = ring_buffer.dequeue()
      ring_buffer.enqueue(current_value)
      acc = acc! - x + current_value
      return acc / window_size
    }
    if (acc === undefined) {
      acc = current_value
      ring_buffer.enqueue(current_value)
      return acc
    }
    acc += current_value
    ring_buffer.enqueue(current_value)
    return acc / ring_buffer.length
  }

  function get_value(): number {
    if (acc === undefined) {
      throw new Error('no value yet')
    }
    return acc / ring_buffer.length
  }

  return {
    next,
    get_value,
    window_size,
  }
}
