export class TimeoutError extends Error {
  constructor(public context?: any) {
    super();
    this.name = 'TimeoutError';
  }
}

export class TimeoutPromise<T> implements Promise<T> {
  public [Symbol.toStringTag]: any;
  private promise: Promise<T>;

  constructor(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (e?: any) => void,
    ) => void,
    timeout: number,
    context?: any,
  ) {
    this.promise = timeoutPromise(new Promise<any>(executor), timeout, context);
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
    return this.promise.catch(onrejected);
  }

  public finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this.promise.finally(onfinally);
  }
}

export function timeoutPromise<T>(
  p: Promise<T>,
  timeout: number,
  context?: any,
): Promise<T> {
  let timer: any;
  const timerPromise = new Promise<never>((resolve, reject) => {
    if (typeof timeout === 'number') {
      timer = setTimeout(() => {
        reject(new TimeoutError(context));
      }, timeout);
    }
  });
  return Promise.race([p, timerPromise])
    .then(x => {
      clearTimeout(timer);
      return x;
    })
    .catch(e => {
      clearTimeout(timer);
      return Promise.reject(e);
    });
}
