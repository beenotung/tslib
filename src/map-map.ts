import { PolyfillMap } from './polyfill-map';

/**
 * map of value or map, aka nested map
 *
 * example use cases:
 *   - memorized function parameter lookup
 *
 * K can be any type
 * */
export class MapMap<K, V> {
  private m: Map<K, V>;

  constructor() {
    if (typeof Map === 'function') {
      this.m = new Map<K, V>();
    } else {
      this.m = new PolyfillMap<K, V>();
    }
  }

  public has(k: K): boolean {
    return this.m.has(k);
  }

  public get(k: K): V {
    return this.m.get(k);
  }

  public set(k: K, v: V) {
    return this.m.set(k, v);
  }

  public getMap(k: K): V & MapMap<any, any> {
    if (this.m.has(k)) {
      return this.m.get(k) as any;
    }
    const res = new MapMap();
    this.set(k, res as any);
    return res as any;
  }

  public clear() {
    this.m.clear();
  }
}

/**
 * Key can only be number, string or symbol
 * */
export class SimpleMapMap<K extends PropertyKey, V> {
  private o: { [k: string]: V } = {};

  public has(k: K): boolean {
    return k in this.o;
  }

  public get(k: K): V {
    return this.o[k as string];
  }

  public set(k: K, v: V) {
    this.o[k as string] = v;
  }

  public getMap(k: K): V {
    if (k in this.o) {
      return this.o[k as string];
    }
    const res = new SimpleMapMap<K, V>();
    this.o[k as string] = (res as any) as V;
    return (res as any) as V;
  }

  public clear() {
    this.o = {};
  }
}
