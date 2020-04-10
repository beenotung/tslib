export class PolyfillIterable<T> implements Iterable<T> {
  constructor(public iterable: Iterable<T>) {}

  [Symbol.iterator](): Iterator<T> {
    return this.iterable[Symbol.iterator]()
  }

  map<R>(map: (value: T) => R): PolyfillIterable<R> {
    const self = this
    return new PolyfillIterable<R>({
      *[Symbol.iterator](): Iterator<R> {
        for (const x of self) {
          yield map(x)
        }
      },
    })
  }

  filter(filter: (value: T) => boolean): PolyfillIterable<T> {
    const self = this
    return new PolyfillIterable<T>({
      *[Symbol.iterator](): Iterator<T> {
        for (const x of self) {
          if (filter(x)) {
            yield x
          }
        }
      },
    })
  }

  toArray(): T[] {
    return Array.from(this.iterable)
  }

  static from<T>(iterable: Iterable<T>): PolyfillIterable<T> {
    return new PolyfillIterable<T>(iterable)
  }
}

export function polyfillIterable<T>(
  iterable: Iterable<T>,
): PolyfillIterable<T> {
  return PolyfillIterable.from(iterable)
}
