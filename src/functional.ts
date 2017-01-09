/**
 * Created by beenotung on 12/26/16.
 */

export type Consumer<A>=(a: A) => void;
export type Supplier<A>=() => A;

/* reference : http://stackoverflow.com/questions/27996544/how-to-correctly-curry-a-function-in-javascript */
export let prop = name => o => o[name];

/*/!* slow *!/ export let length: (xs: Array<any>) => number = prop('length');*/
export let length: (xs: any[]) => number = xs => xs.length;

/**@deprecated this may break the `this` scope */
export let apply = f => xs => f.apply(null, xs);

/** @return [...xs, x] */
export let append = x => xs => xs.concat([x]);

/** @return [...ys, ...xs] */
export let concat = xs => ys => ys.concat(xs);

export let eq = x => y => x === y;

/** @return [x, ...xs] */
export let colon = x => xs => [x].concat(xs);

export let curryN = n => f => {
  let next = acc => n == acc.length
    ? x => next(acc.concat([x]))
    : f(...acc);
  return next([]);
};
export function partialApply(f: Function, totalNArgs: number, partialArgs: Array<any>|IArguments) {
  const pendingNArgs = totalNArgs - partialArgs.length;
  return function () {
    const newPendingNArgs = pendingNArgs - arguments.length;
    if (newPendingNArgs > 1) {
      return partialApply(function () {
        return f(...partialArgs, ...arguments);
      }, newPendingNArgs, []);
    } else {
      return f(...partialArgs, ...arguments);
    }
  };
}
/**
 * recursive apply to intermediate functions
 * @return [n x unary function] of [? x variadic functions]
 * */
export let autoCurry = f => {
  const arity = f.length;
  return function () {
    const res = partialApply(f, arity, arguments);
    if (typeof res == 'function') {
      return autoCurry(res);
    } else {
      return res;
    }
  }
};
/* reference end */

export function test(){
  console.debug('test start');

  console.debug('test end');
}
