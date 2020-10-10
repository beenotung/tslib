/** @deprecated moved to file-stream */
export { stream_lines } from './file-stream'

export function* batchGenerator<T>(
  batchSize: number,
  generator: Generator<T>,
): Generator<T[]> {
  let buffer: T[] = []
  for (const item of generator) {
    buffer.push(item)
    if (buffer.length >= batchSize) {
      yield buffer
      buffer = []
    }
  }
  if (buffer.length > 0) {
    yield buffer
  }
}

export function* iterableToGenerator<T>(iterator: Iterable<T>): Generator<T> {
  for (const item of iterator) {
    yield item
  }
}
