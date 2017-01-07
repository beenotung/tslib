/**
 * Created by beenotung on 12/26/16.
 */
import * as R from "ramda";

export let getProp: ((name: string, o: any) => any)|((name: string) => (o: any) => any) = R.curry((name: string, o: any) => {
  if (o[name])
    return o[name];
  else {
    return name.split('.').reduce((acc, c) => acc[c], o);
  }
});

export function first_non_null(...args: any[]) {
  for (let arg of args)
    if (arg) return arg;
}

export function bindFunction(f: Function): Function {
  return f.bind(f);
}

export function caseLookup<A,B>(cases: Array<[A, B]>, target: A): B {
  let xss = cases.filter(xs => xs[0] == target);
  if (xss.length == 1) {
    return xss[0][1];
  } else throw new Error('expect only 1 match, number of match:' + xss.length);
}

export function caseFunctionLookup<A,B>(cases: Array<[A, () => B]>, target: A): B {
  return caseLookup(cases, target)();
}

export function compareString(a: string, b: string): -1|0|1 {
  if (a == b)
    return 0;
  return a < b ? -1 : 1;
}
