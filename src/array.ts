import {forI, mapI} from "./lang";
import {Maybe} from "./maybe";
import {CompareResult} from "./number";
/**
 * inplace delete all element from the array
 * @return old elements
 * */
export function clear<A>(xs: A[]): A[] {
  return xs.splice(0, xs.length);
}

/**
 * inplace replace all element in the array
 * @return the old elements
 * */
export function replace<A>(dest: A[], src: A[]): A[] {
  let old = clear(dest);
  dest.push(...src);
  return old;
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
  let res: A[] = [];
  xs.forEach(x => {
    if (!includes(x, res))
      res.push(x);
  });
  return res;
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

export function last<A>(xs: A[], skipCheck = false): A {
  if (skipCheck || xs.length == 0)
    throw new TypeError("xs is not non-empty array");
  return xs[xs.length - 1];
}

export function maybeLast<A>(xs: A[]): Maybe<A> {
  return Maybe.fromNullable(xs[xs.length - 1]);
}

export function fromFileList(files: FileList): File[] {
  return mapI(i => files.item(i), files.length);
}

export function array_contains<A>(xs: A[], x: A) {
  return xs.indexOf(x) != -1;
}

export function insert<A>(xs: A[], index: number, x: A): void {
  xs.splice(index, 0, x);
}
type OrderType = 'ascending' | 'descending';
/**
 * insert into Ascending sorted array
 * */
export function insert_sorted<A>(xs: A[], comparator: (a: A, b: A) => CompareResult, x: A, order: OrderType = 'ascending'): void {
  const target = (order === 'ascending')
    ? CompareResult.Larger
    : CompareResult.Smaller
  ;
  for (let i = 0; i < xs.length; i++) {
    if (comparator(xs[i], x) === target) {
      insert(xs, i, x);
      return;
    }
  }
  xs.push(x);
}
