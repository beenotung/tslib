export class CheckedPromise<T> implements Promise<T> {
  public [Symbol.toStringTag]: any;
  private hasCatch = false;
  private promise: Promise<T>;

  constructor(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    this.promise = new Promise<T>(executor).catch(reason => {
      if (!this.hasCatch) {
        console.error('Uncaught Rejection:', reason);
        throw new Error(reason);
      }
      return Promise.reject(reason);
    });
  }

  public then<R, E>(
    onfulfilled?: (value: T) => PromiseLike<R> | R,
    onrejected?: (reason: any) => PromiseLike<E> | E,
  ): Promise<R | E> {
    return this.promise.then(onfulfilled, onrejected);
  }

  public catch<TResult>(
    onrejected?: (reason: any) => PromiseLike<TResult> | TResult,
  ): Promise<T | TResult> {
    this.hasCatch = true;
    return this.promise.catch(onrejected);
  }

  public finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this.promise.finally(onfinally);
  }
}

export function checkPromise<T>(p: Promise<T>) {
  return new CheckedPromise((resolve, reject) => p.then(resolve).catch(reject));
}
