import {curry} from './curry';

export type PipeArg <A> = [Function, A[]] | [Function]
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
export let pipe = curry(<A, B>(ps: PipeArg<A>[], acc: A): B => {
  for (let p of ps) {
    if (p[1]) {
      /* no extra args */
      acc = p[0](acc);
    } else {
      /* has extra args */
      acc = p[0].call(null, acc, ...(<A[]>p[1]));
    }
  }
  return <B><any><A> acc;
});
