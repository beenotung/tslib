/**
 * Created by beenotung on 12/26/16.
 */

import {ObjKey, Obj} from "./lang";
import {id} from "./curry";
import {CurryF1, CurryF2, F2, F1} from "./typeStub-curry";
import {curry} from "./curry";

export type Consumer<A> = (a: A) => void;
export type Supplier<A> = () => A;

/** take all args (ignore arity) */
export let apply = curry((f: Function) => function () {
  return id(f.apply(null, arguments));
});

export let prop = curry(<A>(name: ObjKey, o: Obj<A>): A => o[name]);

/** cannot represent recursive type, o must eventually contains type A */
export let deepProp = curry(<A>(name: ObjKey, o: Obj<A> | any): A => {
  if (o[name] !== void 0) {
    return o[name];
  } else {
    return (<string>name).split('.')
      .reduce((acc, c) => acc[c], <any>o);
  }
});

/**
 * @remark side effect
 * @return original object
 *
 * setProp :: a -> k -> {k:a} -> {k:a}
 * */
export let setProp = curry(<A>(a: A, k: ObjKey, o: Obj<A>): Obj<A> => {
  o[k] = a;
  return o;
});
export let length = curry(<A>(x: ArrayLike<A>): number => x.length);
export let filter = curry(<A>(f: CurryF1<A,boolean>, xs: A[]): A[] => xs.filter(f));
export let compose = curry(<A,B,C>(f: CurryF1<B,C>, g: CurryF1<A,B>, a: A): C => f(g(a)));
export let flip = curry(<A,B,C>(f: CurryF2<A,B,C>) => (b: B) => (a: A): C => f(a, b));
export let lift = curry(<A>(a: A) => (b: any) => a);
export let compose2 = compose(compose, compose);
export let odd = curry((x: number) => x % 2 == 1);
export let even = curry((x: number) => x % 2 == 0);
export let countWhere = curry(compose2(length, filter));
/**
 * @remark side effect
 * apply2 :: (*->a) -> (a->b) -> a -> b
 * */
export let apply2 = curry(<A,B>(f: Function, g: CurryF1<A,B>, x: A): B => {
  f(x);
  return g(x)
});
/**
 * @example echoF (console.log) (1) ~> console.log(1) +> return 1
 * */
export let echoF = flip(apply2)(id);
export let symbolFs = new Map<string,CurryF2<any,any,any>>();
export let isFunction = (x: any) => typeof x === 'function';
export let isNumber = (x: any) => typeof x === 'number';
export let isString = (x: any) => typeof x === 'string';
/*
 * main :: RealWorld -> ((), RealWorld)
 * */
/**@remark side effect */
export let forEach = curry(<A>(f: Function, xs: ArrayLike<A>) => {
  /* xs is ArrayLike, might not has forEach */
  let n = xs.length;
  for (let i = 0; i < n; i++) {
    f(xs[i]);
  }
});
export type EmptyArray<A> = ArrayLike<A>;
export type Maybe<A> = [A] | EmptyArray<A>;
/**
 * just :: a -> [a]
 * */
export let just = curry(<A>(x: A) => [x]);
/**
 * none :: * -> []
 * */
export let none = lift(<A>(x: A): any[] => []);
export let eq = curry(<A>(a: A, b: A): boolean => b === a);
export let neq = curry(<A>(a: A, b: A): boolean => b !== a);
export let gt = curry((a: number | string, b: number | string): boolean => b > a);
export let lt = curry((a: number | string, b: number | string): boolean => b < a);
/**
 * first :: (a->Bool) -> [a] -> Maybe a
 * */
export let first = curry(<A>(f: CurryF1<A,boolean>, xs: A[]): Maybe<A> => {
  for (let x of xs) {
    if (f(x))
      return just(x);
  }
  return none();
});
/**
 * any :: (a->Bool) -> [a] -> Bool
 * */
export let any = curry(<A>(f: CurryF1<A,boolean>, xs: A[]) => {
  for (let x of xs) {
    if (f(x))
      return true;
  }
  return false;
});

/**
 * @remark side effect
 * define infix operator (binary function)
 * */
export let defineSymbolF = curry(<A,B,C>(name: string, f: CurryF2<A,B,C>): CurryF2<A,B,C> => {
  symbolFs.set(name, f);
  return f;
});
/* number | string atomically for a and b */
export let add = defineSymbolF('+', (a: number, b: number) => b + a);
/* number | string atomically for a and b */
export let minus = defineSymbolF('-', (a: number, b: number) => b - a);
export let mult = defineSymbolF('*', (a: number, b: number): number => b * a);
defineSymbolF('/', (a: number, b: number): number => b / a);
export let rem = defineSymbolF('%', (a: number, b: number): number => b % a);
export let div = curry((a: number, b: number): number => Math.floor(b / a));
export let quot = curry((a: number, b: number): number => (b / a) | 0);
/** faster */
export let quotMod = curry((a: number, b: number): [number, number] => [(b / a) | 0, b % a]);
/* slower */
export let divMod = curry((a: number, b: number): [number, number] => {
  let d = Math.floor((b / a));
  return [d, b - d * a];
});
export let symbolF = curry(<A,B,C>(name: string): CurryF2<A,B,C> => symbolFs.get(name));
export let composeFs = curry(<A>(fs: CurryF1<A,A>[], acc: A) => {
  for (let i = fs.length - 1; i >= 0; i--) {
    acc = fs[i](acc);
  }
  return acc;
});
export let chainFs = curry(<A>(fs: CurryF1<A,A>[], acc: A) => {
  for (let f of fs) {
    acc = f(acc);
  }
  return acc;
});
/**
 * @remark side effect
 * f :: unary function <A,B>
 * args :: ArrayLike<A>
 * */
export let doAll = curry(<A>(f: Consumer<A>, args: A[]) => {
  for (let arg of args) {
    f(arg);
  }
});

/**
 * flatten the iterators as a single array
 * */
export function iteratorsToArray <A>(itrs: IterableIterator<A>[]): A[] {
  let xs = <A[]> [];
  for (let itr of itrs)
    for (let x of itr)
      xs.push(x);
  return xs;
}

export let concatWithoutDup = curry(<A>(as: A[], bs: A[]): A[] => {
  let acc = new Set<A>();
  doAll(
    (as: A[]) => doAll(
      (a: A) => acc.add(a)
      , as
    )
    , [as, bs]
  );
  return iteratorsToArray<A>([acc.values()]);
});

export let map = curry(<A,B>(f: CurryF1<A,B>, as: A[]): B[] => as.map(f));

let getOrSetDefault = curry(<K,V>(v: V, k: K, m: Map<K,V>): V => {
  if (m.has(k))
    return m.get(k);
  m.set(k, v);
  return v;
});

/**
 * groupBy :: (a->k) -> [a] -> Map k [a]
 * */
export let groupBy = curry(<A,K>(f: F1<A,K>, xs: A[]): Map<K,A[]> => {
  let res = new Map<K,A[]>();
  for (let x of xs) {
    getOrSetDefault([], f(x), res).push(x);
  }
  return res;
});

/**
 * foldl :: (b->a->b) -> b -> [a] -> b
 * */
export let foldl = curry(<A,B>(f: F2<B,A,B>, acc: B, xs: A[]): B => {
  for (let i = 0, n = xs.length; i < n; i++) {
    acc = f(acc, xs[i]);
  }
  return acc;
});
export let foldl1 = curry(<A>(f: F2<A,A,A>, xs: A[]): A => {
  let n = xs.length;
  if (n == 0)
    throw new TypeError('xs should be non-empty ArrayLike<*>');
  let acc = xs[0];
  for (let i = 1; i < n; i++) {
    acc = f(acc, xs[i]);
  }
  return acc;
});
/**
 * concat :: [a] -> [a] -> [a]
 * */
export let concat = curry(<A>(as: A[], bs: A[]): A[] => as.concat(bs));
/**
 * concatAll :: [[a]] -> [a]
 * */
export let concatAll = foldl(concat, []);
/**
 * @remark side effect to as
 * as -> bs -> __update as__
 * */
export let pushAll = curry(<A>(as: A[], bs: A[]) => as.push(...bs));
/**
 * merge array of plain objects
 *   do not support merging functions
 *   do not support instant object (e.g. Map instance)
 * merge :: [a|b] -> a & b
 * */
export let mergeObjs = curry(<A>(xs: A[]): A => Object.assign({}, ...xs));
// /**
//  * mergeAll :: (a=>) -> [a] -> [a] -> [a]
//  * */
// export let mergeAll = curry((f, as, bs) => {
//   as = groupBy(f, as);
//   bs = groupBy(f, bs);
//   let res = [];
//   forEach(xs => pushAll(res), as);
//   forEach(xs => pushAll(res), bs);
//   return res;
// });
/**
 * groupByAll :: (a->k) -> [[a]] -> Map k [a]
 * */
export let groupByAll = curry(<A,K>(f: F1<A,K>, xss: A[][]): Map<K,A[]> => {
  let res = new Map<K,A[]>();
  for (let xs of xss) {
    for (let x of xs) {
      getOrSetDefault([], f(x), res).push(x);
    }
  }
  return res;
});

/**
 * @remark side effect
 * update :: (a->__update a__) -> [a] -> [a]
 * @return original array
 *
 * more effective then using map if the original array is going to be discarded anyway
 * */
export let update = curry(<A>(f: Consumer<A>, as: A[]) => {
  as.forEach(f);
  return as;
});

export let map2 = curry(<A,B>(f: (a: A) => B, xss: A[][]): B[][] => {
  return xss.map(xs => xs.map(f));
});
