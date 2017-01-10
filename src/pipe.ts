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

/**
 * pipeArg: [F<A,_>,...A[]]
 * */
import {curry} from "./curry";
import {copyToArray} from "./lang";
export type pipeArg<F extends Function,A>=[F] | (F|A)[];
/**
 * auto curried Elixir style pipe
 * @example pipe(
 *            [ x => x+2 ]
 *          , [ (x,y) => x*2+y , 5]
 *          )(2) ~> 13
 * */
export let pipe = curry((pipeArgs: pipeArg<Function,any>[], acc) => {
  for (let pipeArg of pipeArgs) {
    let n = pipeArg.length;
    let args = new Array(n);
    args[0] = acc;
    copyToArray(args, 1, pipeArg, n - 1);
    acc = pipeArg[0].apply(null, args);
  }
  return acc;
});
