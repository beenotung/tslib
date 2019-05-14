import { compare, CompareResult } from './compare';
import { forI, mapI, Obj, objValues } from './lang';
import { incMap } from './map';
import { Maybe } from './maybe';
import { Random } from './random';
import { compare_string } from './string';

/**
 * inplace delete all element from the array
 * @return old elements
 * */
export function clearArray<A>(xs: A[]): A[] {
  return xs.splice(0, xs.length);
}

/** @deprecated renamed to clearArray */
export const clear = clearArray;

/**
 * inplace replace all element in the array
 * @return the old elements
 * */
export function replaceArray<A>(dest: A[], src: A[]): A[] {
  clearArray(dest);
  dest.push(...src);
  return dest;
}

/**@remark side effect
 * inplace operation
 * @deprecated same as clear
 * */
export function takeAll<A>(xs: A[]): A[] {
  const res = [].concat(xs);
  clear(xs);
  return res;
}

export function includes<A>(x: A, xs: A[]): boolean {
  return xs.indexOf(x) !== -1;
}

/**
 * only use `===` to compare
 * @warning slow
 * @return new array
 * */
export function unique<A>(xs: A[]): A[] {
  return Array.from(new Set(xs));
}

export function rightMost<A>(n: number, xs: A[]): A[] {
  return xs.slice(xs.length - n, xs.length);
}

export function leftMost<A>(n: number, xs: A[]): A[] {
  return xs.slice(0, n);
}

/** inplace update */
export function popN(n: number, xs: any[]): void {
  forI(_ => xs.pop(), n);
}

/** inplace update */
export function popUntilN(n: number, xs: any[]): void {
  forI(_ => xs.pop(), xs.length - n);
}

/** inplace update */
export function shiftN(n: number, xs: any[]): void {
  forI(_ => xs.shift(), n);
}

/** inplace update */
export function shiftUntilN(n: number, xs: any[]): void {
  forI(_ => xs.shift(), xs.length - n);
}

export function last<A>(xs: ArrayLike<A>, skipCheck = false): A {
  if (skipCheck || xs.length === 0) {
    throw new TypeError('xs is not non-empty array');
  }
  return xs[xs.length - 1];
}

export function maybeLast<A>(xs: A[]): Maybe<A> {
  return Maybe.fromNullable(xs[xs.length - 1]);
}

export function fromFileList(files: FileList): File[] {
  return mapI(i => files.item(i), files.length);
}

export function array_contains<A>(xs: A[], x: A) {
  return xs.indexOf(x) !== -1;
}

export function insert<A>(xs: A[], index: number, x: A): void {
  xs.splice(index, 0, x);
}

export type OrderType = 'ascending' | 'descending';

/**
 * insert into Ascending sorted array
 * */
export function insert_sorted<A>(
  xs: A[],
  comparator: (a: A, b: A) => CompareResult,
  x: A,
  order: OrderType = 'ascending',
): void {
  const target =
    order === 'ascending' ? CompareResult.Larger : CompareResult.Smaller;
  for (let i = 0; i < xs.length; i++) {
    if (comparator(xs[i], x) === target) {
      insert(xs, i, x);
      return;
    }
  }
  xs.push(x);
}

export let defaultComparator = (a, b): CompareResult => {
  if (typeof a === 'string' && typeof b === 'string') {
    return compare_string(a, b);
  }
  return compare(a, b);
};

/**
 *
 * wrapper of slice, because it's confusing between slice and splice
 *
 * performance reference: https://jsperf.com/array-clone
 * */
export function cloneArray<T>(xs: T[]): T[] {
  return xs.slice();
}

/**
 * @return new array (not deep cloning elements)
 * @deprecated use clone() and array.sort() explicitly is better
 * */
export function insertSortBy<A>(
  xs: A[],
  comparator: (a: A, b: A) => CompareResult,
): A[] {
  const res: A[] = new Array(xs.length);
  xs.forEach(x => insert_sorted(res, comparator, x));
  return res;
}

/**@deprecated*/
export let sortBy = insertSortBy;

/**
 * @return in-place sorted, original array
 * */
export function sort<T>(xs: T[], comparator = defaultComparator): T[] {
  return xs.sort(comparator);
}

/**
 * @remark inplace update
 * @return original array
 * */
export function removeByIdx<A>(xs: A[], i: number) {
  xs.splice(i, 1);
  return xs;
}

/**
 * @remark inplace update
 * @return original array
 * */
export function remove<A>(xs: A[], x: A): void {
  const idx = xs.indexOf(x);
  if (idx !== -1) {
    xs.splice(idx, 1);
  }
}

/**
 * @remark inplace update
 * @return original array
 * */
export function removeBy<A>(xs: A[], f: (a: A) => boolean): A[] {
  for (let i = 0; i < xs.length; i++) {
    if (f(xs[i])) {
      xs.splice(i, 1);
      return xs;
    }
  }
  return xs;
}

export function nodup<A>(xs: A[]): A[] {
  const s = new Set<A>();
  xs.forEach(x => s.add(x));
  return Array.from(s.values());
}

/**
 * inplace delete all duplicated element from the array (only one copy is kept)
 * @return old array
 * */
export function removeDup<A>(xs: A[]): A[] {
  const ys = nodup(xs);
  clearArray(xs);
  xs.push(...ys);
  return xs;
}

/**
 * inplace insert elements into the array
 * @return old array
 * */
export function insertNoDup<A>(acc: A[], newXs: A[]): A[] {
  acc.push(...newXs);
  return removeDup(acc);
}

/**
 * inplace insert elements into the array
 * @return old array
 * */
export function insertNoDupWithKey<A>(acc: A[], newXs: A[], key: string): A[] {
  newXs.forEach(newX => {
    if (!acc.find(x => x[key] === newX[key])) {
      acc.push(newX);
    }
  });
  return acc;
}

/**
 * inplace operation
 * @return old array
 * */
export function removeDupByKey<A>(xs: A[], key: string | number): A[] {
  const t: Obj<A> = {};
  xs.map(x => (t[x[key]] = x));
  replaceArray(xs, objValues(t));
  return xs;
}

/**
 * inplace update
 * @return old array
 * */
export function removeByKey<A>(
  xs: A[],
  key: string | number,
  keys: Array<string | number>,
): A[] {
  return replaceArray(xs, xs.filter(x => !array_contains(keys, x[key])));
}

/**
 * including end
 * */
export function range(start: number, end: number, step = 1): number[] {
  const res = [];
  for (let i = start; i <= end; i += step) {
    res.push(i);
  }
  return res;
}

export function filterByKey<A>(src: A[], key: string, keys: string[]): A[] {
  return src.filter(x => keys.indexOf(x[key]) !== -1);
}

export function toArray<A>(xs: ArrayLike<A>): A[] {
  // return mapI(i => xs[i], xs.length);
  return Array.prototype.concat.apply([], arguments);
}

export function flatten<A>(xss: A[][]): A[] {
  return [].concat(...xss);
}

/**
 * array.push is not monadic, this is a wrapper to make it monadic
 * */
export function push<A>(res: A[], ...xs: A[]): A[] {
  res.push(...xs);
  return res;
}

export function binArray<A>(xs: A[], binSize: number): A[][] {
  const res: A[][] = [];
  let acc: A[] = [];
  for (const x of xs) {
    if (acc.length >= binSize) {
      res.push(acc);
      acc = [];
    }
    acc.push(x);
  }
  if (acc.length !== 0) {
    res.push(acc);
  }
  return res;
}

/**
 * non-curry version of `groupBy` in functional.ts
 * */
export function binArrayBy<A, K>(xs: A[], mapper: (a: A) => K): Map<K, A[]> {
  const res = new Map<K, A[]>();
  for (const x of xs) {
    const k = mapper(x);
    const xs = res.get(k);
    if (xs) {
      xs.push(x);
    } else {
      res.set(k, [x]);
    }
  }
  return res;
}

export function partitionArrayBy<A>(xs: A[], f: (a: A) => boolean): [A[], A[]] {
  const true_xs: A[] = [];
  const false_xs: A[] = [];
  for (const x of xs) {
    if (f(x)) {
      true_xs.push(x);
    } else {
      false_xs.push(x);
    }
  }
  return [true_xs, false_xs];
}

/**
 * @description not same as Array.prototype.map!
 * this will not skip uninitialized items
 *
 * Compare:
 *   new Array(3).map(x=>1) ~~> [<3 empty items>]
 *   map(new Array(3),x=>1) ~~> [ 1, 1, 1 ]
 * */
export function mapArray<A, B>(
  xs: A[],
  f: (a: A, i: number, xs: A[]) => B,
): B[] {
  const res = new Array<B>(xs.length);
  for (let i = xs.length - 1; i >= 0; i--) {
    res[i] = f(xs[i], i, xs);
  }
  return res;
}

export function countArray<A>(
  xs: A[],
  f: (a: A, i: number, xs: A[]) => boolean,
): number {
  let acc = 0;
  const n = xs.length;
  for (let i = 0; i < n; i++) {
    if (f(xs[i], i, xs)) {
      acc++;
    }
  }
  return acc;
}

export function asyncCountArray<A>(
  xs: A[],
  f: (x: A, i: number, xs: A[]) => Promise<boolean>,
): Promise<number> {
  let acc = 0;
  return Promise.all(
    xs.map((x, i, xs) => f(x, i, xs).then(b => (acc += b ? 1 : 0))),
  ).then(() => acc);
}

export function max<T>(xs: T[]): T {
  const n = xs.length;
  let acc = xs[0];
  for (let i = 1; i < n; i++) {
    const c = xs[i];
    if (acc < c) {
      acc = c;
    }
  }
  return acc;
}

export function min<T>(xs: T[]): T {
  const n = xs.length;
  let acc = xs[0];
  for (let i = 1; i < n; i++) {
    const c = xs[i];
    if (acc > c) {
      acc = c;
    }
  }
  return acc;
}

export function sum(xs: number[]): number {
  let acc = 0;
  const n = xs.length;
  for (let i = 0; i < n; i++) {
    acc += xs[i];
  }
  return acc;
}

export function maxByFunc<T>(
  xs: T[],
  comparator: (a: T, b: T) => CompareResult,
): T {
  let acc = xs[0];
  const n = xs.length;
  for (let i = 1; i < n; i++) {
    const c = xs[i];
    if (comparator(acc, c) < 0) {
      acc = c;
    }
  }
  return acc;
}

export function minByFunc<T>(
  xs: T[],
  comparator: (a: T, b: T) => CompareResult,
): T {
  let acc = xs[0];
  const n = xs.length;
  for (let i = 1; i < n; i++) {
    const c = xs[i];
    if (comparator(acc, c) > 0) {
      acc = c;
    }
  }
  return acc;
}

export function maxByField<T, K extends keyof T>(xs: T[], key: K): T {
  let acc = xs[0];
  const n = xs.length;
  for (let i = 1; i < n; i++) {
    const c = xs[i];
    if (defaultComparator(acc[key], c[key]) < 0) {
      acc = c;
    }
  }
  return acc;
}

export function minByField<T, K extends keyof T>(xs: T[], key: K): T {
  let acc = xs[0];
  const n = xs.length;
  for (let i = 1; i < n; i++) {
    const c = xs[i];
    if (defaultComparator(acc[key], c[key]) > 0) {
      acc = c;
    }
  }
  return acc;
}

export function sumByField<T extends Record<K, number>, K extends keyof T>(
  xs: T[],
  key: K,
): number {
  let acc = 0;
  const n = xs.length;
  for (let i = 0; i < n; i++) {
    acc += xs[i][key];
  }
  return acc;
}

/**
 * side-effect: the array will be sorted in-place if instructed
 *
 * default will sort the array
 * */
export function median<T>(
  xs: T[],
  options?: {
    sort?: boolean | typeof defaultComparator;
    merger?: (a: T, b: T) => T;
  },
): T {
  if (xs.length === 0) {
    return undefined;
  }
  if (xs.length === 1) {
    return xs[0];
  }
  if (!options || options.sort !== false) {
    xs.sort(
      options && typeof options.sort === 'function'
        ? options.sort
        : defaultComparator,
    );
  }
  const n = xs.length;
  if (n % 2) {
    /* odd number */
    return xs[(n - 1) / 2];
  }
  /* even number */
  const m = n / 2;
  const a = xs[m - 1];
  const b = xs[m];
  if (typeof a === 'number' && typeof b === 'number') {
    return ((a + b) / 2.0) as any;
  }
  if (options && options.merger) {
    return options.merger(a, b);
  }
  throw new Error('cannot find median of even array');
}

export function countElement<T>(xs: T[], x: T): number {
  let acc = 0;
  const n = xs.length;
  for (let i = 1; i < n; i++) {
    if (xs[i] === x) {
      acc++;
    }
  }
  return acc;
}

export function countAll<T>(xs: T[]): Map<T, number> {
  const counts = new Map<T, number>();
  xs.forEach(x => incMap(counts, x));
  return counts;
}

export function mode<T>(xs: T[]): T | undefined {
  const counts = Array.from(countAll(xs).entries());
  const maxCount = maxByField(counts, 1);
  return maxCount ? maxCount[0] : undefined;
}

export function shuffle<T>(xs: T[], n = xs.length): T[] {
  xs = xs.slice();
  for (let i = 0; i < n; i++) {
    const a = i;
    const b = Random.nextInt(n);
    const t = xs[a];
    xs[a] = xs[b];
    xs[b] = t;
  }
  return xs;
}

export function shuffledBinArray<T>(
  xs: T[],
  binSize: number,
  nSwap?: number,
): T[][] {
  return binArray(shuffle(xs, nSwap), binSize);
}

export function shuffledIndecies(n: number): number[] {
  return shuffle(range(0, n - 1));
}

/**
 * TODO assign a better name
 * e.g. f [a,b,c] 1 ~~> [[a],[b],[c]]
 * e.g. f [a,b,c] 2 ~~> [ [a,a],[a,b],[a,c],
 *                        [b,a],[b,b],[b,c],
 *                        [c,a],[c,b],[c,c] ]
 * */
export function genCombination<T>(cs: T[], size: number): T[][] {
  if (size < 1) {
    return [];
  }
  let xss = cs.map(c => [c]);
  let i = 1;
  for (;;) {
    if (i === size) {
      return xss;
    }
    i++;
    const acc: T[][] = [];
    const n = xss.length;
    for (let x = 0; x < n; x++) {
      const n = cs.length;
      for (let c = 0; c < n; c++) {
        const xs = xss[x].slice();
        xs.push(cs[c]);
        acc.push(xs);
      }
    }
    xss = acc;
  }
}

export type IoList<T> =
  | T[]
  | T[][]
  | T[][][]
  | T[][][][]
  | T[][][][][]
  | T[][][][][][]
  | T[][][][][][][]
  | any[];

export function flattenAll<T>(xs: IoList<T>): T[] {
  const ys: T[] = [];
  flattenIoList(xs, ys);
  return ys;
}

function flattenIoList<T>(xs: IoList<T>, ys: T[]): void {
  const n = xs.length;
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    if (Array.isArray(x)) {
      flattenIoList(x, ys);
    } else {
      ys.push(x);
    }
  }
}

function _getMaxArraySize() {
  let i = 1;
  try {
    for (;;) {
      /* tslint:disable:no-unused-expression */
      new Array(i);
      /* tslint:enable:no-unused-expression */
      i += i;
    }
  } catch (e) {
    let min = i / 2;
    let max = i;
    for (; min + 1 < max; ) {
      const m = Math.round((min + max) / 2);
      try {
        /* tslint:disable:no-unused-expression */
        new Array(m);
        /* tslint:enable:no-unused-expression */
        min = m;
      } catch (e) {
        max = m;
      }
    }
    return min;
  }
}

let MaxArraySize: number;

export function getMaxArraySize() {
  if (!MaxArraySize) {
    MaxArraySize = _getMaxArraySize();
  }
  return MaxArraySize;
}
