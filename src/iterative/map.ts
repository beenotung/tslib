import '../polyfill-array';
import { getObjectType } from '../type';

export type Mapper<A, B> = (a: A) => B;
export type ArrayMapper<A, B> = (a: A, i: number, xs: A[]) => B;
export type ObjectMapper<A, B> = (a: A[keyof A], key: keyof A, A) => B;
export type SetMapper<A, B> = (a: A, xs: Set<A>) => B;
export type MapValueMapper<AK, AV, BK, BV> = (
  v: AV,
  k: AK,
  xs: Map<AK, AV>,
) => BV;
export type MapKeyMapper<AK, AV, BK, BV> = (
  v: AV,
  k: AK,
  xs: Map<AK, AV>,
) => BK;

export namespace maps {
  export const array = <A, B>(xs: A[], f: ArrayMapper<A, B>): B[] => xs.map(f);
  export const object = <A, B>(x: A, f: ObjectMapper<A, B>): B => {
    const y = new (x as any).constructor();
    /* tslint:disable:forin */
    for (const k in x) {
      y[k] = f(x[k], k, x);
    }
    /* tslint:enable:forin */
    return y;
  };
  export const set = <A, B>(xs: Set<A>, f: SetMapper<A, B>) => {
    const ys = new Set<B>();
    xs.forEach(x => ys.add(f(x, xs)));
    return ys;
  };
  export const map = <AK, AV, BK, BV>(
    xs: Map<AK, AV>,
    valueMapper: MapValueMapper<AK, AV, BK, BV>,
    keyMapper?: MapKeyMapper<AK, AV, BK, BV>,
  ): Map<BK, BV> => {
    const ys = new Map<BK, BV>();
    xs.forEach((av, ak) => {
      const bv = valueMapper(av, ak, xs);
      const bk = keyMapper ? keyMapper(av, ak, xs) : ((ak as any) as BK);
      ys.set(bk, bv);
    });
    return ys;
  };
  export const any = (o, f: (a: any) => any): any => {
    if (Array.isArray(o)) {
      return array(o, f);
    }
    switch (getObjectType(o)) {
      case 'Array':
        return array(o, f);
      case 'Set':
        return set(o, f);
      case 'Map':
        return map(o, f);
      case 'Object':
        return object(o, f);
      default:
        return f(o);
    }
  };
}

export const map_array = maps.array;
export const map_object = maps.object;
export const map_set = maps.set;
export const map_map = maps.map;
export const map_any = maps.any;
