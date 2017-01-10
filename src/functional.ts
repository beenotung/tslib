/**
 * Created by beenotung on 12/26/16.
 */

import {curry} from "./curry";
import {id} from "./curry";
import {copyToArray} from "./lang";

export type Consumer<A> = (a: A) => void;
export type Supplier<A> = () => A;

/** take all args (ignore arity) */
export let apply = curry(f => function () {
  return id(f.apply(null, arguments));
});

/* reference : http://stackoverflow.com/questions/27996544/how-to-correctly-curry-a-function-in-javascript */
export let prop = curry((name, o) => o[name]);
export let length = curry(x => x.length);
export let filter = curry((f, xs) => xs.filter(f));
export let compose = curry((f, g, x) => f(g(x)));
export let flip = curry((f, a, b) => f(b, a));
export let lift = curry(a => b => a);
export let compose2 = compose(compose, compose);
export let odd = curry(x => x % 2 == 1);
export let even = curry(x => x % 2 == 0);
export let countWhere = curry(compose2(length, filter));
/**
 * @remark side effect
 * apply2 :: (*->a) -> (a->b) -> a -> b
 * */
export let apply2 = curry((f, g, x) => {
  f(x);
  return g(x)
});
/**
 * @example echoF (console.log) (1) ~> console.log(1) +> return 1
 * */
export let echoF = flip(apply2)(id);
export let symbolFs = {};
export let isFunction = curry(x => typeof x === 'function');
export let isNumber = curry(x => typeof x === 'number');
export let isString = curry(x => typeof x === 'string');
/*
 * main :: RealWorld -> ((), RealWorld)
 * */
/**@remark side effect */
export let forEach = curry((f, xs) => {
  /* xs is ArrayLike, might not has forEach */
  let n = xs.length;
  for (let i = 0; i < n; i++) {
    f(xs[i]);
  }
});
export type Maybe<A>=[A]|A[];
/**
 * just :: a -> [a]
 * */
export let just = curry(x => [x]);
/**
 * none :: * -> []
 * */
export let none = lift(x => []);
export let eq = curry((a, b) => b === a);
export let neq = curry((a, b) => b !== a);
export let gt = curry((a, b) => b !== a);
/**
 * first :: (a->Bool) -> [a] -> Maybe a
 * */
export let first = curry((f, xs) => {
  for (let x of xs) {
    if (f(x))
      return just(x);
  }
  return none();
});
/**
 * any :: (a->Bool) -> [a] -> Bool
 * */
export let any = curry((f, xs) => {
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
export let defineSymbolF = curry((name, f) => {
  f = curry(f);
  return symbolFs[name] = curry((a, b) => f(a, b));
});
export let add = defineSymbolF('+', (a, b) => b + a);
export let minus = defineSymbolF('-', (a, b) => b - a);
export let mult = defineSymbolF('*', (a, b) => b * a);
defineSymbolF('/', (a, b) => b / a);
export let rem = defineSymbolF('%', (a, b) => b % a);
export let div = curry((a, b) => Math.floor(b / a));
export let quot = curry((a, b) => (b / a) | 0);
/** faster */
export let quotMod = curry((a, b) => [(b / a) | 0, b % a]);
/* slower */
export let divMod = curry((a, b) => {
  let d = Math.floor((b / a));
  return [d, b - d * a];
});
export let symbolF = curry(name => symbolFs[name]);
export let composeFs = curry((fs, acc) => {
  for (let i = fs.length - 1; i >= 0; i--) {
    acc = fs[i](acc);
  }
  return acc;
});
export let chainFs = curry((fs, acc) => {
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
export let doAll = curry((f: Function, args) => {
  for (let arg of args) {
    f(arg);
  }
});
