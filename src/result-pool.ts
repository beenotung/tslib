import { getMaxArraySize } from './array'
import { Result, then, thenF } from './result'
import { RingBuffer } from './ring-buffer'

export class VoidResultPool {
  private fs: RingBuffer<() => Result<void>> = new RingBuffer(getMaxArraySize())
  private running = 0

  constructor(public poolSize: number) {}

  run(f: () => Result<void>): void {
    this.fs.push(f)
    this.next()
  }

  private next(): void {
    if (this.fs.length > 0 && this.running < this.poolSize) {
      const f = this.fs.dequeue()
      this.running++
      let x: Result<void>
      try {
        x = f()
      } catch (e) {
        // x = then(e, e => Promise.reject(e));
        x = Promise.reject(e)
        this.running--
        this.next()
      }
      then(x, () => {
        this.running--
        this.next()
      })
    }
  }
}

export class NonVoidResultPool {
  private fs: RingBuffer<() => void> = new RingBuffer(getMaxArraySize())
  private running = 0

  constructor(
    public poolSize: number,
    public logError = true,
  ) {}

  /**
   * @description error will be ignored
   * */
  run<T>(f: () => Result<T>): Result<T> {
    if (this.running < this.poolSize) {
      this.running++
      return thenF(
        f,
        x => {
          this.running--
          this.check()
          return x
        },
        _e => {
          this.running--
          this.check()
        },
      )
    }
    return this.queue(f)
  }

  private queue<T>(f: () => Result<T>): Result<T> {
    return new Promise<T>((resolve, reject) => {
      this.fs.push(() => {
        this.running++
        return thenF(
          f,
          x => {
            this.running--
            resolve(x)
            this.check()
            return x
          },
          e => {
            this.running--
            reject(e)
            this.check()
          },
        )
      })
    })
  }

  private check() {
    if (this.fs.length > 0 && this.running < this.poolSize) {
      const f = this.fs.dequeue()
      try {
        f()
      } catch (e) {
        if (this.logError) {
          console.error(e)
        }
      }
    }
  }
}
