import { getObjectType } from '../object';
import { ArrayMapper, MapValueMapper, ObjectMapper, SetMapper } from './map';

export type ArrayConsumer<A> = ArrayMapper<A, void>;
export type ObjectConsumer<A> = ObjectMapper<A, void>;
export type SetConsumer<A> = SetMapper<A, void>;
export type MapValueConsumer<K, V> = MapValueMapper<K, V, void, void>;

export namespace foreachs {
  export const array = <A>(xs: A[], f: ArrayConsumer<A>) => xs.forEach(f);
  export const object = <A>(x: A, f: ObjectConsumer<A>) => {
    /* tslint:disable:forin */
    for (const k in x) {
      f(x[k], k, x);
    }
    /* tslint:enable:forin */
  };
  export const set = <A>(xs: Set<A>, f: SetConsumer<A>) =>
    xs.forEach(x => f(x, xs));
  export const map = <K, V>(xs: Map<K, V>, f: MapValueConsumer<K, V>) =>
    xs.forEach(f);
  export const any = (o, f) => {
    if (Array.isArray(o)) {
      return o.forEach(f);
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

export const foreach_array = foreachs.array;
export const foreach_object = foreachs.object;
export const foreach_set = foreachs.set;
export const foreach_map = foreachs.map;
export const foreach_any = foreachs.any;
