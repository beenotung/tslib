import {Consumer} from './functional';

/**
 * Created by beenotung on 12/26/16.
 */
export class Defer<A, E> {
  promise: Promise<A>;
  resolve: Consumer<A>;
  reject: Consumer<E>;
}

export function createDefer<A, E>(): Defer<A, E> {
  let res = new Defer<A, E>();
  res.promise = new Promise<A>((resolve, reject) => {
    res.resolve = resolve;
    res.reject = reject;
  });
  return res;
}

export async function autoRetryAsync<A>(f: () => Promise<A>, retry_delay = 1000): Promise<A> {
  try {
    return await f();
  } catch (e) {
    if (retry_delay > 0) {
      let defer = createDefer<A, any>();
      setTimeout(() => {
        autoRetryAsync(f, retry_delay)
          .then(defer.resolve)
          .catch(defer.reject)
        ;
      }, retry_delay);
      return defer.promise;
    } else {
      return await autoRetryAsync(f, retry_delay);
    }
  }
}

export async function waitFor<A>(pred: () => boolean | any, f: () => A): Promise<A> {
  const defer = createDefer<A, any>();
  const check = () => {
    if (pred()) {
      defer.resolve(f());
    } else {
      setTimeout(check);
    }
  };
  setTimeout(check);
  return defer.promise;
}

export async function later(duration = 0) {
  const defer = createDefer();
  setTimeout(defer.resolve, duration);
  return defer.promise;
}

export async function parallel_map<A, B>(as: A[], f: (a: A) => Promise<B>): Promise<B[]> {
  const defer = createDefer<B[], any>();
  let acc = 0;
  let bs = [];
  as.forEach((a, i) => {
    f(a)
      .then(b => {
        bs[i] = b;
        acc++;
        if (acc == as.length) {
          defer.resolve(bs);
        }
      })
      .catch(defer.reject);
  });
  return defer.promise;
}
