import * as fetch from "isomorphic-fetch";
import {isDefined, noop} from "./lang";

/**
 * Created by beenotung on 12/26/16.
 */
export class Defer<A, E> {
  promise: Promise<A>;
  resolve: (a: A) => Promise<A>;
  reject: (e: E) => Promise<A>;
}

export function createDefer<A, E>(): Defer<A, E> {
  const res = new Defer<A, E>();
  res.promise = new Promise<A>((resolve, reject) => {
    res.resolve = a => {
      resolve(a);
      return res.promise;
    };
    res.reject = e => {
      reject(e);
      return res.promise;
    };
  });
  return res;
}

export async function resolveDefer<A, E>(defer: Defer<A, E>, a: A, f: () => E | Promise<E> = () => undefined) {
  if (isDefined(a)) {
    defer.resolve(a);
  } else {
    defer.reject(await f());
  }
  return defer.promise;
}

export async function tryFAsync<A>(f: () => A): Promise<A> {
  try {
    return f();
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function autoRetryAsync<A>(f: () => Promise<A>, retry_delay = 1000): Promise<A> {
  try {
    return await f();
  } catch (e) {
    if (retry_delay > 0) {
      const defer = createDefer<A, any>();
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

export async function parallel_map<A, B>(xs: A[], f: (a: A) => Promise<B>): Promise<B[]> {
  return Promise.all(xs.map(f));
}

export interface ParallelArray<A> {
  map<B>(f: (a: A) => Promise<B>): ParallelArray<B>;

  unwrap(): Promise<A[]>;
}

export namespace ParallelArray {
  export function wrap<A>(xs: A[]): ParallelArray<A> {
    const res: ParallelArray<A> = {} as any;
    res.map = f => wrapPromise(parallel_map(xs, f));
    res.unwrap = () => Promise.resolve(xs);
    return res;
  }

  export function wrapPromise<A>(xs: Promise<A[]>): ParallelArray<A> {
    const res: ParallelArray<A> = {} as any;
    res.map = f => wrapPromise(xs.then(xs => parallel_map(xs, f)));
    res.unwrap = () => xs;
    return res;
  }
}

export function clearAllTimer() {
  let i = setInterval(noop);
  for (; i > 0; i--) {
    clearTimeout(i);
    clearInterval(i);
  }
}

export function fetch_no_cache(url: string, method = "GET"): Promise<Response> {
  const req: Request | string = typeof Request === "function" ? new Request(url) : url;
  const headers = new Headers();
  headers.append("pragma", "no-cache");
  headers.append("cache-control", "no-cache");
  const init = {
    method
    , cache: "no-cache" as RequestCache
    , headers
  };
  return fetch(req, init);
}
