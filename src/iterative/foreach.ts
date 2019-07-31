import { getObjectType } from '../type';
import {
  ArrayMapper,
  MapValueMapper,
  NodeListElementMapper,
  ObjectMapper,
  SetMapper,
} from './map';

export type ArrayConsumer<A> = ArrayMapper<A, void>;
export type ObjectConsumer<A> = ObjectMapper<A, void>;
export type SetConsumer<A> = SetMapper<A, void>;
export type MapValueConsumer<K, V> = MapValueMapper<K, V, void, void>;
export type NodeListElementConsumer<A extends Element> = NodeListElementMapper<
  A,
  void
>;

export namespace foreachs {
  export function array<A>(xs: A[], f: ArrayConsumer<A>): void {
    xs.forEach(f);
  }

  export function object<A>(x: A, f: ObjectConsumer<A>): void {
    /* tslint:disable:forin */
    for (const k in x) {
      f(x[k], k, x);
    }
    /* tslint:enable:forin */
  }

  export function set<A>(xs: Set<A>, f: SetConsumer<A>): void {
    xs.forEach(x => f(x, xs));
  }

  export function map<K, V>(xs: Map<K, V>, f: MapValueConsumer<K, V>): void {
    xs.forEach(f);
  }

  export function nodeList<A extends Element = Element>(
    xs: NodeListOf<A> | HTMLCollectionOf<A>,
    f: NodeListElementConsumer<A>,
  ): void {
    for (let i = 0; i < xs.length; i++) {
      f(xs.item(i) as A, i, xs);
    }
  }

  export function any(o: any, f: (a: any) => void): void {
    if (Array.isArray(o)) {
      return o.forEach(f);
    }
    if (o instanceof HTMLCollection) {
      return nodeList(o, f);
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
  }
}

export const foreach_array = foreachs.array;
export const foreach_object = foreachs.object;
export const foreach_set = foreachs.set;
export const foreach_map = foreachs.map;
export const foreach_nodeList = foreachs.nodeList;
export const foreach_any = foreachs.any;
