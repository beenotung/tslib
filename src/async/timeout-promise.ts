export class TimeoutError extends Error {
  constructor() {
    super("timeout");
  }
}

export class TimeoutPromise<T> implements Promise<T> {
  [Symbol.toStringTag];
  worker: Promise<T>;
  timer: Promise<never>;
  promise: Promise<T>;

  constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void, timeout?: number) {
    this.worker = new Promise<T>(executor);
    this.timer = new Promise<never>((resolve, reject) => {
      if (typeof timeout === "number") {
        setTimeout(() => {
          reject(new TimeoutError());
        }, timeout);
      }
    });
    this.promise = Promise.race([this.worker, this.timer]);
  }

  then<R, E>(onfulfilled?: ((value: T) => (PromiseLike<R> | R)), onrejected?: ((reason: any) => (PromiseLike<E> | E))): Promise<R | E> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult))): Promise<T | TResult> {
    return this.promise.catch(onrejected);
  }
}

export function timeoutPromise<T>(p: Promise<T>, timeout: number) {
  return new TimeoutPromise((resolve, reject) => p.then(resolve).catch(reject), timeout);
}
