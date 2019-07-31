/**
 * Created by beenotung on 12/26/16.
 */

/* tslint:disable:ban-types */

import { concatArgs, copyArray } from './lang';

/* reference : http://stackoverflow.com/questions/27996544/how-to-correctly-curry-a-function-in-javascript */

export function curry<A extends Function>(f: Function): A {
  const arity = f.length;
  const res = arity === 0 ? f : partial(f, arity, []);
  return res as A;
  // return typeof f === 'function' && f.length > 0
  //   ? partial(f, f.length, [])
  //   : f;
}

export const id = curry(<A>(x: A) => x);

/** internal func, use id() instead */
export function autoCurry<A extends Function>(f: Function): A {
  const res =
    typeof f === 'function' && f.length > 0 ? partial(f, f.length, []) : f;
  return res as A;
}

/**
 * if enough N param,
 *   then take LAST N param, apply to f
 *     -- also carry acc to f (as bottom of args stack), but should be ignored by f)
 *     -- the functions wrapped by f might use the stacked (extra) args
 *     if this args has extra params,
 *       then apply them to the result of f
 *   else take all param, wait for extra param
 * */
function partial<A extends Function, R>(
  f: Function,
  arity: number,
  acc: A[] | IArguments,
): A | R {
  const next = function partialNext() {
    const args = arguments;
    const m = args.length;
    if (m < arity) {
      return partial(f, arity - m, concatArgs(acc, args, 0, m));
    }
    const result = autoCurry(f.apply(null, concatArgs(acc, args, 0, arity)));
    if (arity < m) {
      return autoCurry(result.apply(null, copyArray(args, arity, m - arity)));
    }
    return result;
  };
  return (next as any) as A | R;
}

/* tslint:enable:ban-types */
