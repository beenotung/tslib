export async function parallel_map<A, B>(
  xs: A[],
  f: (a: A) => Promise<B>,
): Promise<B[]> {
  return Promise.all(xs.map(f));
}

export interface ParallelArray<A> {
  map<B>(f: (a: A) => Promise<B>): ParallelArray<B>;

  unwrap(): Promise<A[]>;
}

export namespace ParallelArray {
  export function wrap<A>(xs: A[]): ParallelArray<A> {
    return {
      map<B>(f: (a: A) => Promise<B>): ParallelArray<B> {
        return wrapPromise(parallel_map(xs, f));
      },
      unwrap(): Promise<A[]> {
        return Promise.resolve(xs);
      },
    };
  }

  export function wrapPromise<A>(xs: Promise<A[]>): ParallelArray<A> {
    return {
      map<B>(f: (a: A) => Promise<B>): ParallelArray<B> {
        return wrapPromise(xs.then(xs => parallel_map(xs, f)));
      },
      unwrap(): Promise<A[]> {
        return xs;
      },
    };
  }
}
