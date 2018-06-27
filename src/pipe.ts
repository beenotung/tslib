import {curry} from "./curry";

export type PipeArg <A, B> = [(a: A) => B, A[]] | [(a: A) => B];

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
export const pipe = curry(<A, B>(ps: Array<PipeArg<A, B>>, acc: A): B => {
  for (const p of ps) {
    if (p[1]) {
      /* no extra args */
      acc = p[0](acc) as B as any as A;
    } else {
      /* has extra args */
      acc = p[0].call(null, acc, ...(p[1] as A[]));
    }
  }
  return acc as A as any as B;
});

/**
 * non-curried version of echoF in functional.ts
 *
 * echo :: (a->*) -> a -> a
 * */
export function peek<A> (f: (a: A) => any): (a: A) => A {
  return (a) => {
    f(a);
    return a;
  };
}

/** @deprecated */
export const echo = peek;

export interface Chain<A> {
  use (f: (a: A) => any): Chain<A>;

  map<B> (f: (a: A) => B): Chain<B>;

  unwrap (): A;
}

export function createChain<A> (a: A): Chain<A> {
  const res = {
    use: (f) => {
      f(a);
      return res;
    }
    , map: (f) => createChain(f(a))
    , unwrap: () => a,
  };
  return res;
}
