import { curry } from './curry';

export type PipeArg<A, B> = [(a: A) => B, A[]] | [(a: A) => B];

/**
 * the function<A,B> :: A,...* -> B
 *   - first argument must be type A
 *   - other arguments can be any type
 *   - must return type B
 *
 * @example
 *   pipe([
 *     [ x=>x+2 ]
 *   , [ (x,y)=>x*2+y, [5] ]
 *   ]) (2) ~> 13
 * */
/**
 * auto curried Elixir style pipe
 *
 * pipe :: PipeArg p => [p] -> a -> *
 *   - don't have to be of same type (like chain)
 * */
export const pipe = curry(
  <A, B>(ps: Array<PipeArg<A, B>>, acc: A): B => {
    for (const p of ps) {
      if (p.length === 2) {
        // has extra args
        acc = (((p[0] as (...xs: A[]) => B)(acc, ...p[1]) as B) as any) as A;
      } else {
        // no extra args
        acc = ((p[0](acc) as B) as any) as A;
      }
    }
    return ((acc as A) as any) as B;
  },
);

/**
 * non-curried version of echoF in functional.ts
 *
 * echo :: (a->*) -> a -> a
 * */
export function peek<A>(f: (a: A) => any): (a: A) => A {
  return a => {
    f(a);
    return a;
  };
}

/** @deprecated */
export const echo = peek;

export interface Chain<A> {
  /**
   * a.k.a. peek
   * will not affect the value, can perform side effect
   * */
  use(f: (a: A) => any): Chain<A>;

  map<B>(f: (a: A) => B): Chain<B>;

  unwrap(): A;
}

export class Chain<A> {
  constructor(private value: A) {}

  use(f: (a: A) => any): this {
    f(this.value);
    return this;
  }

  map<B>(f: (a: A) => B): Chain<B> {
    return new Chain<B>(f(this.value));
  }

  unwrap(): A {
    return this.value;
  }
}

export function createChain<A>(a: A): Chain<A> {
  return new Chain<A>(a);
}
