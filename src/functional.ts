/**
 * Created by beenotung on 12/26/16.
 */

import {copyToArray, ObjKey, Obj} from "./lang";
import {id} from "./curry";
import {CurryF1, CurryF2} from "./typeStub-curry";
import {curry} from "./curry";

export type Consumer<A> = (a: A) => void;
export type Supplier<A> = () => A;

/** take all args (ignore arity) */
export let apply = curry((f: Function) => function () {
  return id(f.apply(null, arguments));
});

/* reference : http://stackoverflow.com/questions/27996544/how-to-correctly-curry-a-function-in-javascript */
export let prop = curry(<A>(name: ObjKey, o: Obj<A>): A => o[name]);
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
export let gt = curry((a: number|string, b: number|string): boolean => b > a);
export let lt = curry((a: number|string, b: number|string): boolean => b < a);
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
