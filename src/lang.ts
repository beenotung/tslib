/**
 * Created by beenotung on 12/26/16.
 */
import {Supplier} from "./functional";
import {createDefer} from "./async";
import {F1} from "./typestub-curry";
import {curry} from "./curry";

export const deepGetProp = curry(<A>(name: string, o: any): A => {
  if (o[name]) {
    return o[name];
  }
  const xs = name.split(".");
  if (xs.length == 1) {
    const message = `key '${name}' not found in object`;
    console.warn(message, {name: name, o: o});
    throw new TypeError(message);
  }
  const topLevelName = xs.shift();
  const nextLevelName = xs.join(".");
  return deepGetProp(nextLevelName, o[topLevelName]);
});

export function hasProp<A>(k: ObjKey, o: Obj<A>): boolean {
  if (typeof o[k] !== "undefined") {
    return true;
  }
  if (Array.isArray(o)) {
    return (<any[]>o).indexOf(k) != -1;
  }
  return Object.keys(o).filter(x => x == k).length != 0;
}

export function checkedGetProp<A>(k: ObjKey, o: Obj<A>): A {
  if (hasProp(k, o)) {
    return o[k];
  } else {
    throw new TypeError(`property '${k}' does not exist in the object.`);
  }
}

export function getPropWithDefault<A>(v: A, k: ObjKey, o: Obj<A>): A {
  if (hasProp(k, o)) {
    return o[k];
  } else {
    return v;
  }
}

export function first_non_null<A>(...args: A[]): A | null {
  for (const arg of args) {
    if (arg) {
      return arg;
    }
  }
  return null;
}

/* return b if a is null or undefined (or false) */
export function ifNull<A>(a: A, b: A): A {
  return a ? a : b;
}

export function ifNullF<A>(a: A, f: Supplier<A>): A {
  return a ? a : f();
}

/**
 * @remark won't flatten a
 * */
export async function ifNullFAsync<A>(a: A, f: Supplier<Promise<A>>): Promise<A> {
  /* not using Promise.resolve(a) directly to avoid flattening a when a is a promise */
  const defer = createDefer<A, any>();
  if (a) {
    defer.resolve(a);
  } else {
    f().then(x => defer.resolve(x));
  }
  return defer.promise;
}

export function bindFunction(f: Function): Function {
  const res = f.bind(f);
  res.prototype = f.prototype;
  return res;
}

export function caseLookup<A, B>(cases: Array<[A, B]>, target: A): B {
  const xss = cases.filter(xs => xs[0] == target);
  if (xss.length == 1) {
    return xss[0][1];
  } else {
    throw new Error("expect only 1 match, number of match:" + xss.length);
  }
}

export function caseFunctionLookup<A, B>(cases: Array<[A, () => B]>, target: A): B {
  return caseLookup(cases, target)();
}

export function compareString(a: string, b: string): -1 | 0 | 1 {
  if (a == b) {
    return 0;
  }
  return a < b ? -1 : 1;
}

export function deepCall(f: Function) {
  while (typeof f === "function") {
    f = f();
  }
  return f;
}

export interface Obj<A> {
  [k: string]: A;

  [k: number]: A;
}

export type ObjKey = string | number;

export function objForEach<A>(f: (a?: A, k?: ObjKey, o?: Obj<A>) => void): (o: Obj<A>) => void {
  return o => Object.keys(o).forEach(x => f(o[x], x, o));
}

export function objMap<A, B>(f: (a?: A, k?: ObjKey, o?: Obj<A>) => B): (o: Obj<A>) => B[] {
  return o => Object.keys(o).map(x => f(o[x], x, o));
}

export function objFilter<A>(f: (a?: A, k?: ObjKey, o?: Obj<A>) => boolean): (o: Obj<A>) => A[] {
  return o => Object.keys(o).filter(x => f(o[x], x, o)).map(x => o[x]);
}

export function objToArray<A>(o: Obj<A>): [A, ObjKey][] {
  const xs = Object.keys(o);
  const res = new Array<[A, ObjKey]>(xs.length);
  xs.forEach((x, i) => res[i] = [o[x], x]);
  return res;
}

export function objValues<A>(o: Obj<A>): A[] {
  return Object.keys(o).map(x => o[x]);
}

export function argsToArray<A>(args: IArguments): A[] {
  const len = args.length;
  const res = new Array<A>(len);
  for (let i = 0; i < len; i++) {
    res[i] = args[i];
  }
  return res;
}

/**
 * take all from as ++ take some from args
 * */
export function concatArgs<A>(as: ArrayLike<A>, args: ArrayLike<A>, offsetArgs = 0, nArgs = args.length): A[] {
  const na = as.length;
  const res = new Array<A>(na + nArgs);
  let offset = 0;
  for (; offset < na; offset++) {
    res[offset] = as[offset];
  }
  for (let i = 0; i < nArgs; i++) {
    res[offset + offsetArgs + i] = args[i];
  }
  return res;
}

export function copyArray<A>(xs: ArrayLike<A>, offset: number = 0, count: number = xs.length): A[] {
  const res = new Array(count);
  for (let i = 0; i < count; i++) {
    res[i] = xs[offset + i];
  }
  return res;
}

export function copyToArray<A>(dest: Array<A>, destOffset = 0, src: ArrayLike<A>, srcOffset = 0, count = src.length) {
  for (let i = 0; i < count; i++) {
    dest[destOffset + i] = src[srcOffset + i];
  }
  return dest;
}

const nFuncs = <F1<Function, Function>[]> [];

export function genFunction(n: number, f: Function): Function {
  if (n < 1) {
    return function fun0() {
      return f.apply(null, arguments);
    };
  }
  if (!nFuncs[n]) {
    let args = "a0";
    for (let i = 1; i < n; i++) {
      args += ", a" + i;
    }
    const code = `nFuncs[${n}] = function(f){
  return function fun${n}(${args}){
    return f.apply(null, arguments);
  };
}`;
    /* tslint:disable */
    eval(code);
    /* tslint:enable */
  }
  return nFuncs[n](f);
}

export function isDefined(a: any): boolean {
  return a !== null && a !== void 0;
}

export function notDefined(a: any): boolean {
  return !isDefined(a);
}

export function isNumber(i: any): boolean {
  return Number.isFinite(+i) && i !== "";
}

export function toNumber(i: any): number {
  if (!isNumber(i)) {
    throw new TypeError("i is not a number: " + i);
  }
  return +i;
}

/**
 * @param end: number (exclusive)
 * */
export function forI(f: (i: number) => void, end: number, start = 0) {
  for (let i = start; i < end; i++) {
    f(i);
  }
}

export function mapI<A>(f: (i: number) => A, size: number): A[] {
  const res = new Array<A>(size);
  forI(i => res[i] = f(i), size, 0);
  return res;
}

export function repeatI<A>(f: () => A, size: number): A[] {
  return mapI(f, size);
}

/** apply the function without throwing exception */
export function tryApply(f: Function, args: any[]) {
  try {
    return f(...args);
  } catch (e) {
    console.error(e);
  }
}

/** call the function without throwing exception */
export function tryCall(f: Function, ...args: any[]) {
  try {
    return f(...args);
  } catch (e) {
    console.error(e);
  }
}

export function tryWithDefault<A>(f: Function, defaultValue: A, args: any[] = []): A {
  try {
    return f(...args);
  } catch (e) {
    return defaultValue;
  }
}

export type ChainObject<A> = (f: (a: A) => void) => ChainObject<A>;

export function chainObject<A>(a: A): ChainObject<A> {
  const res = (f: (a: A) => void) => {
    f(a);
    return res;
  };
  return res;
}

export interface Type<A>extends Function {
  new(...args: any[]): A;
}

export function _if(f: Function): (b: boolean) => void {
  return b => {
    if (b) {
      f();
    }
  };
}

export function applyIf<A, B>(a: A | false | 0 | null | void, f: F1<A, B>): B | void {
  if (a) {
    return f(a);
  }
}

export function gen_noop<A>(): (a: A) => void {
  return () => {
  };
}

export const noop: Function = () => {
};

export function cast(o: any): any {
  return o;
}

export function equals<A>(a: A, b: A): boolean {
  return a === b;
}

export function not_equals<A>(a: A, b: A): boolean {
  return a !== b;
}

export function another<A>(a: A, b: A, compare: A): A {
  return compare == a ? b
    : compare == b ? a
      : compare
    ;
}
