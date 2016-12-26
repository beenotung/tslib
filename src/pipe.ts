import * as R from 'ramda';

/** Elixir style pipe
 * @example pipe(
 *            [ x => x+2 ]
 *          , [ (x,y) => x*2+y , 5]
 *          )(2) */
export function pipe(...funcArgs: Array<Array<any>>) {
  return function (...args: Array<any>) {
    if (R.head(funcArgs).length != 1) {
      throw Error('the first function cannot carry extra arguments');
    }
    let acc = R.head(funcArgs)[0].apply(this, args);
    R.tail(funcArgs).forEach(funcArg => {
      acc = R.head(funcArg).apply(this, R.concat([acc], R.tail(funcArg)));
    });
    return acc;
  }
}
