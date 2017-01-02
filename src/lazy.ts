import {createDefer, Defer} from "./async";
/**
 * Created by beenotung on 1/2/17.
 */
export function createLazy<A>(f: () => A): () => Promise<A> {
  let defer: Defer<A,any>;
  return () => {
    if (defer == void 0) {
      defer = createDefer();
      try {
        defer.resolve(f());
      } catch (e) {
        defer.reject(e);
      }
    }
    return defer.promise;
  };
}

export function createAsyncLazy<A>(f: () => Promise<A>): () => Promise<A> {
  let promise: Promise<A>;
  return () => {
    if (promise == void 0) {
      promise = f();
    }
    return promise;
  };
}
