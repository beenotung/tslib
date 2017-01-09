/**
 * Created by beenotung on 12/26/16.
 */
import * as R from "ramda";
import {Supplier} from "./functional";
import {createDefer} from "./async";

export let getProp: ((name: string, o: any) => any)|((name: string) => (o: any) => any) = R.curry((name: string, o: any) => {
  if (o[name])
    return o[name];
  else {
    return name.split('.').reduce((acc, c) => acc[c], o);
  }
});

export function first_non_null<A>(...args: A[]) {
  for (let arg of args)
    if (arg) return arg;
}

/* return b if a is null or undefined (or false) */
export function ifNull<A>(a: A, b: A) {
  return a ? a : b;
}

export function ifNullF<A>(a: A, f: Supplier<A>) {
  return a ? a : f();
}

/**
 * @remark won't flatten a
 * */
export async function ifNullFAsync<A>(a: A, f: Supplier<Promise<A>>) {
  /* not using Promise.resolve(a) directly to avoid flattening a when a is a promise */
  let defer = createDefer<A,any>();
  if (a) {
    defer.resolve(a);
  } else {
    f().then(x => defer.resolve(x));
  }
  return defer.promise;
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

export function deepCall(f: Function) {
  while (typeof f === 'function')
    f = f();
  return f;
}

export interface Obj<A> {
  [k: string]: A;
  [k: number]: A;
}

export type ObjKey = string|number;

export function objForEach<A>(f: (a?: A, k?: ObjKey, o?: Obj<A>) => void): (o: Obj<A>) => void {
  return o => Object.keys(o).forEach(x => f(o[x], x, o));
}

export function objMap<A,B>(f: (a?: A, k?: ObjKey, o?: Obj<A>) => B): (o: Obj<A>) => B[] {
  return o => Object.keys(o).map(x => f(o[x], x, o));
}

export function objToArray<A>(o: Obj<A>): [A, ObjKey][] {
  let xs = Object.keys(o);
  let res = new Array<[A, ObjKey]>(xs.length);
  xs.forEach((x, i) => res[i] = [o[x], x]);
  return res;
}
