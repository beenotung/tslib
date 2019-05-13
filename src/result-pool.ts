import { Result, then } from './result';

export class VoidResultPool {
  private fs: Array<() => Result<void>> = [];
  private running = 0;

  constructor(public poolSize: number) {
  }

  run(f: () => Result<void>): void {
    this.fs.push(f);
    this.next();
  }

  private next(): void {
    if (this.fs.length > 0 && this.running < this.poolSize) {
      const f = this.fs.pop();
      this.running++;
      let x: Result<void>;
      try {
        x = f();
      } catch (e) {
        // x = then(e, e => Promise.reject(e));
        x = Promise.reject(e);
        this.running--;
        this.next();
      }
      then(x, () => {
        this.running--;
        this.next();
      });
    }
  }
}

export class NonVoidResultPool {
  private fs: Array<() => Result<any>> = [];
  private running = 0;

  constructor(public poolSize: number, public logError = true) {
  }

  /**
   * @description error will be ignored
   * */
  run<T>(f: () => Result<T>): Result<T> {
    if (this.running < this.poolSize) {
      this.running++;
      try {
        const x=f();
        then(x,)
        return f();
      } catch (e) {
        throw e;
      } finally {
        this.running--;
        this.check();
      }
    }
    return this.queue(f);
  }

  private queue<T>(f: () => Result<T>): Result<T> {
    return new Promise<T>((resolve, reject) => {
      const f1: () => Result<T> = (): Result<T> => {
        try {
          this.running++;
          const x = f();
          resolve(x);
          return x;
        } catch (e) {
          reject(e);
          throw e;
        } finally {
          this.running--;
        }
      };
      this.fs.push(f1);
    });
  }

  private check() {
  }


}
