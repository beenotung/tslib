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
