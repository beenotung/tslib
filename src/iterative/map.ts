import '../polyfill-array'
import { getObjectType } from '../type'

export type Mapper<A, B> = (a: A) => B
export type ArrayMapper<A, B> = (a: A, i: number, xs: A[]) => B
export type ObjectMapper<A, B> = (
  value: A[keyof A],
  key: keyof A,
  object: A,
) => B
export type SetMapper<A, B> = (a: A, xs: Set<A>) => B
export type MapValueMapper<AK, AV, BK, BV> = (
  v: AV,
  k: AK,
  xs: Map<AK, AV>,
) => BV
export type MapKeyMapper<AK, AV, BK, BV> = (v: AV, k: AK, xs: Map<AK, AV>) => BK
export type NodeListElementMapper<A extends Element, B> = (
  a: A,
  i: number,
  xs: NodeListOf<A> | HTMLCollectionOf<A>,
) => B

export namespace maps {
  export function array<A, B>(xs: A[], f: ArrayMapper<A, B>): B[] {
    return xs.map(f)
  }

  export function object<A, B>(x: A, f: ObjectMapper<A, B>): B {
    const y = new (x as any).constructor()
    /* tslint:disable:forin */
    for (const k in x) {
      y[k] = f(x[k], k, x)
    }
    /* tslint:enable:forin */
    return y
  }

  export function set<A, B>(xs: Set<A>, f: SetMapper<A, B>) {
    const ys = new Set<B>()
    xs.forEach(x => ys.add(f(x, xs)))
    return ys
  }

  export function map<AK, AV, BK, BV>(
    xs: Map<AK, AV>,
    valueMapper: MapValueMapper<AK, AV, BK, BV>,
    keyMapper?: MapKeyMapper<AK, AV, BK, BV>,
  ): Map<BK, BV> {
    const ys = new Map<BK, BV>()
    xs.forEach((av, ak) => {
      const bv = valueMapper(av, ak, xs)
      const bk = keyMapper ? keyMapper(av, ak, xs) : ((ak as any) as BK)
      ys.set(bk, bv)
    })
    return ys
  }

  export function nodeList<A extends Element, B>(
    xs: NodeListOf<A> | HTMLCollectionOf<A>,
    f: NodeListElementMapper<A, B>,
  ) {
    const ys = new Array(xs.length)
    for (let i = 0; i < xs.length; i++) {
      ys[i] = f(xs.item(i) as A, i, xs)
    }
    return ys
  }

  export function any(o: any, f: (a: any) => any): any {
    if (Array.isArray(o)) {
      return array(o, f)
    }
    if (o instanceof NodeList || o instanceof HTMLCollection) {
      return nodeList(o as any, f)
    }
    switch (getObjectType(o)) {
      case 'Array':
        return array(o, f)
      case 'Set':
        return set(o, f)
      case 'Map':
        return map(o, f)
      case 'Object':
        return object(o, f)
      default:
        return f(o)
    }
  }
}

export const map_array = maps.array
export const map_object = maps.object
export const map_set = maps.set
export const map_map = maps.map
export const map_nodeList = maps.nodeList
export const map_any = maps.any
