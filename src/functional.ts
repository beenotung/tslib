/**
 * Created by beenotung on 12/26/16.
 * the curried functions are deprecated due to type system limit
 */

import { curry, id } from './curry'
import { Consumer } from './functional/types'
import { Mapper } from './iterative/map'
import { Obj, ObjKey } from './lang'
import { mapGetOrSetDefault } from './map'
import { CurryF1, CurryF2, F1, F2 } from './typestub-curry'

/** take all args (ignore arity)
 * apply :: (..args->a) -> ...args -> a
 * */
export const apply = curry(
  <A, B>(f: (...args: A[]) => B) =>
    function() {
      return id(f.apply(null, arguments as any))
    },
)

export const prop = curry(<A>(name: ObjKey, o: Obj<A>): A => o[name])

/** cannot represent recursive type, o must eventually contains type A */
export const deepProp = curry(<A>(name: ObjKey, o: Obj<A> | any): A => {
  if (o[name] !== void 0) {
    return o[name]
  } else {
    return (name as string).split('.').reduce((acc, c) => acc[c], o as any)
  }
})

/**
 * @remark side effect
 * @return original object
 *
 * setProp :: a -> k -> {k:a} -> {k:a}
 * */
export const setProp = curry(<A>(a: A, k: ObjKey, o: Obj<A>): Obj<A> => {
  o[k] = a
  return o
})
export const length = curry(<A>(x: ArrayLike<A>): number => x.length)
export const filter = curry(<A>(f: CurryF1<A, boolean>, xs: A[]): A[] =>
  xs.filter(f),
)
export const compose = curry(
  <A, B, C>(f: CurryF1<B, C>, g: CurryF1<A, B>, a: A): C => f(g(a)),
)
/**
 * flip :: (a->b) -> (b->a)
 * */
export const flip = curry(
  <A, B, C>(f: CurryF2<A, B, C>) =>
    (b: B) =>
    (a: A): C =>
      f(a, b),
)
/**
 * lift :: a -> b -> a
 * */
export const lift = curry(<A, B>(a: A, _b?: B): A => a)
export const lift_noarg = curry(
  <A>(a: A) =>
    (): A =>
      a,
)
export const liftError = curry(<E extends Error, A, B>(e: E, _b: B): A => {
  throw e
})
export const liftError_noarg = curry(<E extends Error, A>(e: E) => (): A => {
  throw e
})
export const compose2 = compose(compose, compose)
export const odd = curry((x: number) => x % 2 === 1)
export const even = curry((x: number) => x % 2 === 0)
export const countWhere = curry(compose2(length, filter))
/**
 * @remark side effect
 * apply2 :: (a->*) -> (a->b) -> a -> b
 * */
export const apply2 = curry(
  <A, B>(f: Consumer<A>, g: CurryF1<A, B>, x: A): B => {
    f(x)
    return g(x)
  },
)
/**
 * echoF :: (a->*) -> a -> a
 * @example echoF (console.log) (1) ~> console.log(1) +> return 1
 * */
export const echoF = flip(apply2)(id)
export const symbolFs = new Map<string, CurryF2<any, any, any>>()
export const isFunctionType = (x: any) => typeof x === 'function'
export const isNumberType = (x: any) => typeof x === 'number'
export const isStringType = (x: any) => typeof x === 'string'
/**
 * @remark side effect
 *
 * forEach :: (a->*) -> [a] -> *
 * */
export const forEach = curry(<A>(f: Consumer<A>, xs: ArrayLike<A>) => {
  /* xs is ArrayLike, might not has forEach */
  const n = xs.length
  for (let i = 0; i < n; i++) {
    f(xs[i])
  }
})
export type EmptyArray<A> = ArrayLike<A>
export type MaybeSingleton<A> = [A] | EmptyArray<A>
/**
 * just :: a -> [a]
 * */
export const just = curry(<A>(x: A) => [x])
/**
 * none :: * -> []
 * */
export const none = curry(<A>(_x: A): any[] => [])
export const eq = curry(<A>(a: A, b: A): boolean => b === a)
export const neq = curry(<A>(a: A, b: A): boolean => b !== a)
export const gt = curry(
  (a: number | string, b: number | string): boolean => b > a,
)
export const lt = curry(
  (a: number | string, b: number | string): boolean => b < a,
)
/**
 * first :: (a->Bool) -> [a] -> MaybeSingleton a
 * */
export const first = curry(
  <A>(f: CurryF1<A, boolean>, xs: A[]): MaybeSingleton<A> => {
    for (const x of xs) {
      if (f(x)) {
        return just(x)
      }
    }
    return none()
  },
)
/**
 * any :: (a->Bool) -> [a] -> Bool
 * */
export const any = curry(<A>(f: CurryF1<A, boolean>, xs: A[]) => {
  for (const x of xs) {
    if (f(x)) {
      return true
    }
  }
  return false
})

/**
 * @remark side effect
 * define infix operator (binary function)
 * */
export const defineSymbolF = curry(
  <A, B, C>(name: string, f: CurryF2<A, B, C>): CurryF2<A, B, C> => {
    symbolFs.set(name, f)
    return f
  },
)
/* number | string atomically for a and b */
export const add = defineSymbolF('+', (a: number, b: number) => b + a)
/* number | string atomically for a and b */
export const minus = defineSymbolF('-', (a: number, b: number) => b - a)
export const mult = defineSymbolF('*', (a: number, b: number): number => b * a)
defineSymbolF('/', (a: number, b: number): number => b / a)
export const rem = defineSymbolF('%', (a: number, b: number): number => b % a)
export const div = curry((a: number, b: number): number => Math.floor(b / a))
export const quot = curry((a: number, b: number): number => (b / a) | 0)
/** faster */
export const quotMod = curry((a: number, b: number): [number, number] => [
  (b / a) | 0,
  b % a,
])
/* slower */
export const divMod = curry((a: number, b: number): [number, number] => {
  const d = Math.floor(b / a)
  return [d, b - d * a]
})
export const and = defineSymbolF('&&', (a: any, b: any) => b && a)
export const or = defineSymbolF('||', (a: any, b: any) => b || a)
export const not = defineSymbolF('!', (a: any) => !a)
export const notnot = defineSymbolF('!!', (a: any) => !!a)
export const symbolF = curry(
  <A, B, C>(name: string): CurryF2<A, B, C> =>
    symbolFs.get(name) ||
    (() => {
      throw new Error('symbol ' + name + ' is not defined')
    })(),
)
export const composeFs = curry(<A>(fs: Array<CurryF1<A, A>>, acc: A) => {
  for (let i = fs.length - 1; i >= 0; i--) {
    acc = fs[i](acc)
  }
  return acc
})
export const chainFs = curry(<A>(fs: Array<CurryF1<A, A>>, acc: A) => {
  for (const f of fs) {
    acc = f(acc)
  }
  return acc
})
/**
 * @remark side effect
 * f :: unary function <A,B>
 * args :: ArrayLike<A>
 * */
export const doAll = curry(<A>(f: Consumer<A>, args: A[]) => {
  for (const arg of args) {
    f(arg)
  }
})

/**
 * flatten the iterators as a single array
 * */
export function iteratorsToArray<A>(itrs: Array<IterableIterator<A>>): A[] {
  const xs = [] as A[]
  for (const itr of itrs) {
    xs.push(...Array.from(itr))
  }
  return xs
}

export const concatWithoutDup = curry(<A>(as: A[], bs: A[]): A[] => {
  const acc = new Set<A>()
  doAll((as: A[]) => doAll((a: A) => acc.add(a), as), [as, bs])
  return iteratorsToArray<A>([acc.values()])
})

export const fmap = curry(<A, B>(f: CurryF1<A, B>, as: A[]): B[] => as.map(f))

/** @deprecated use mapGetOrSetDefault in map.ts */
export const getOrSetDefault = curry(<K, V>(v: V, k: K, m: Map<K, V>): V => {
  if (m.has(k)) {
    return m.get(k) as V
  }
  m.set(k, v)
  return v
})

/**
 * groupBy :: (a->k) , [a] -> Map k [a]
 * */
export function groupBy<A, K>(f: Mapper<A, K>, xs: A[]): Map<K, A[]> {
  const res = new Map<K, A[]>()
  for (const x of xs) {
    mapGetOrSetDefault(res, f(x), () => []).push(x)
  }
  return res
}

/**
 * foldl :: (b->a->b) -> b -> [a] -> b
 * */
export const foldl = curry(<A, B>(f: F2<B, A, B>, acc: B, xs: A[]): B => {
  for (let i = 0, n = xs.length; i < n; i++) {
    acc = f(acc, xs[i])
  }
  return acc
})

export const foldl1 = curry(<A>(f: F2<A, A, A>, xs: A[]): A => {
  const n = xs.length
  if (n === 0) {
    throw new TypeError('xs should be non-empty ArrayLike<*>')
  }
  let acc = xs[0]
  for (let i = 1; i < n; i++) {
    acc = f(acc, xs[i])
  }
  return acc
})

/**
 * concat :: [a] -> [a] -> [a]
 * */
export const concat = curry(<A>(as: A[], bs: A[]): A[] => as.concat(bs))

/**
 * concatAll :: [[a]] -> [a]
 * */
export const concatAll: <A>(ass: A[][]) => A[] = foldl(concat, [])

/**
 * @remark side effect to as
 * as -> bs -> __update as__
 * */
export const pushAll = curry(<A>(as: A[], bs: A[]) => as.push(...bs))

/**
 * merge array of plain objects
 *   do not support merging functions
 *   do not support instant object (e.g. Map instance)
 * merge :: [a|b] -> a & b
 * */
export const mergeObjs = curry(<A>(xs: A[]): A => Object.assign({}, ...xs))

// /**
//  * mergeAll :: (a=>) -> [a] -> [a] -> [a]
//  * */
// export const mergeAll = curry((f, as, bs) => {
//   as = groupBy(f, as);
//   bs = groupBy(f, bs);
//   const res = [];
//   forEach(xs => pushAll(res), as);
//   forEach(xs => pushAll(res), bs);
//   return res;
// });

/**
 * groupByAll :: (a->k) -> [[a]] -> Map k [a]
 * */
export const groupByAll = curry(
  <A, K>(f: F1<A, K>, xss: A[][]): Map<K, A[]> => {
    const res = new Map<K, A[]>()
    for (const xs of xss) {
      for (const x of xs) {
        getOrSetDefault([], f(x), res).push(x)
      }
    }
    return res
  },
)

/**
 * @remark side effect
 * update :: (a->__update a__) -> [a] -> [a]
 * @return original array
 *
 * more effective then using map if the original array is going to be discarded anyway
 * */
export const update = curry(<A>(f: Consumer<A>, as: A[]) => {
  as.forEach(f)
  return as
})

export const map2 = curry(<A, B>(f: (a: A) => B, xss: A[][]): B[][] => {
  return xss.map(xs => xs.map(f))
})
