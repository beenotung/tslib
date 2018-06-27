export function createLazy<A> (f: () => A): () => A {
  let a: A;
  let done = false;
  return () => {
    if (!done) {
      a = f();
      done = true;
    }
    return a;
  };
}

export function createAsyncLazy<A> (f: () => Promise<A>): () => Promise<A> {
  let promise: Promise<A>;
  let done = false;
  return () => {
    if (!done) {
      promise = f();
      done = true;
    }
    return promise;
  };
}
