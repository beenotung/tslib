import {forI, mapI, Obj, objValues} from './lang';
import {Maybe} from './maybe';
import {CompareResult} from './number';

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

/**
 * @return new array (not deep cloning elements)
 * */
export function sortBy<A>(
  xs: A[],
  comparator: (a: A, b: A) => CompareResult,
): A[] {
  const res: A[] = new Array(xs.length);
  xs.forEach(x => insert_sorted(res, comparator, x));
  return res;
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
  return xs.reduce((acc, x, i, xs) => acc + (f(x, i, xs) ? 1 : 0), 0);
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
