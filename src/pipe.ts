// import * as R from 'ramda';

// /**
//  * Elixir style pipe
//  * @example pipe(
//  *            [ x => x+2 ]
//  *          , [ (x,y) => x*2+y , 5]
//  *          )(2) ~> 13
//  * */
// export function pipe(...funcArgs: Array<Array<any>>) {
//   return function (...args: Array<any>) {
//     if (R.head(funcArgs).length != 1) {
//       throw Error('the first function cannot carry extra arguments');
//     }
//     let acc = R.head(funcArgs)[0].apply(this, args);
//     R.tail(funcArgs).forEach(funcArg => {
//       acc = R.head(funcArg).apply(this, R.concat([acc], R.tail(funcArg)));
//     });
//     return acc;
//   }
// }

// /**
//  * pipeArg: [F<A,_>,...A[]]
//  * */
// import {curry} from "./curry";
// import {copyToArray} from "./lang";
// export type pipeArg<F extends Function,A>=[F] | (F|A)[];
// /**
//  * auto curried Elixir style pipe
//  * @example pipe(
//  *            [ x => x+2 ]
//  *          , [ (x,y) => x*2+y , 5]
//  *          )(2) ~> 13
//  * */
// export let pipe = curry((pipeArgs: pipeArg<Function,any>[], acc) => {
//   for (let pipeArg of pipeArgs) {
//     let n = pipeArg.length;
//     let args = new Array(n);
//     args[0] = acc;
//     copyToArray(args, 1, pipeArg, n - 1);
//     acc = pipeArg[0].apply(null, args);
//   }
//   return acc;
// });

/**
 * the function<A,B> :: A,...* -> B
 *   - first argument must be type A
 *   - other arguments can be any type
 *   - must return type B
 *
 * @example
 *   pipe(
 *     [ x=>x+2 ]
 *   , [ (x,y)=>x*2+y, [5] ]
 *   ) (2) ~> 13
 * */
import {curry} from "./curry";
export type PipeArg <A> = [Function, A[]] | [Function]
/**
 * auto curried Elixir style pipe
 *
 * pipe :: PipeArg p => [p] -> a -> *
 *   - don't have to be of same type (like chain)
 * */
export let pipe = curry(<A,B>(ps: PipeArg<A>[], acc: A): B => {
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
