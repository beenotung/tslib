/**
 * A Map that can do normal and reversed operations
 * */
import { remove } from './array';

export class KVMap<K, V> /* implements Map<K, V> */ {
  readonly [Symbol.toStringTag]: string = 'KVMap';
  private kvMap: Map<K, V>;
  private vkMap: Map<V, K[]>;

  constructor() {
    this.kvMap = new Map();
    this.vkMap = new Map();
  }

  get size(): number {
    return this.keySize;
  }

  get keySize(): number {
    return this.kvMap.size;
  }

  get valueSize(): number {
    return this.vkMap.size;
  }

  clear(): void {
    this.kvMap.clear();
    this.vkMap.clear();
  }

  delete(key: K): boolean {
    return this.deleteKey(key);
  }

  deleteKey(key: K): boolean {
    if (this.kvMap.has(key)) {
      const value = this.kvMap.get(key) as V;
      const keys = this.vkMap.get(value) || [];
      remove(keys, key);
    }
    return this.kvMap.delete(key);
  }

  deleteValue(value: V): boolean {
    if (this.vkMap.has(value)) {
      const keys = this.vkMap.get(value) as K[];
      keys.forEach(key => this.kvMap.delete(key));
    }
    return this.vkMap.delete(value);
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any,
  ): void {
    this.forEachKV(callbackfn, thisArg);
  }

  forEachKV(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any,
  ): void {
    this.kvMap.forEach(callbackfn, thisArg);
  }

  forEachVKs(
    callbackfn: (keys: K[], value: V, map: Map<V, K[]>) => void,
    thisArg?: any,
  ): void {
    this.vkMap.forEach(callbackfn, thisArg);
  }

  get(key: K): V | undefined {
    return this.getValue(key);
  }

  getValue(key: K): V | undefined {
    return this.kvMap.get(key);
  }

  getKeys(value: V): K[] {
    return this.vkMap.get(value) || [];
  }

  has(key: K): boolean {
    return this.hasKey(key);
  }

  hasKey(key: K): boolean {
    return this.kvMap.has(key);
  }

  hasValue(value: V): boolean {
    return this.vkMap.has(value) && (this.vkMap.get(value) as K[]).length > 0;
  }

  set(key: K, value: V): this {
    if (this.hasKey(key)) {
      this.deleteKey(key);
    }
    this.kvMap.set(key, value);
    if (this.vkMap.has(value)) {
      const keys = this.vkMap.get(value) as K[];
      if (!keys.includes(key)) {
        keys.push(key);
      }
    } else {
      this.vkMap.set(value, [key]);
    }
    return this;
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.kvMap[Symbol.iterator]();
  }

  entries(): IterableIterator<[K, V]> {
    return this.kvEntries();
  }

  kvEntries(): IterableIterator<[K, V]> {
    return this.kvMap.entries();
  }

  vkEntries(): IterableIterator<[V, K[]]> {
    return this.vkMap.entries();
  }

  keys(): IterableIterator<K> {
    return this.kvMap.keys();
  }

  values(): IterableIterator<V> {
    return this.kvMap.values();
  }
}

// function checkType<K, V>(map: Map<K, V>) {
// }
//
// checkType<string, string>({} as any as KVMap<string, string>);

export namespace KVMap {
  export function fromMap<K, V>(map: Map<K, V>) {
    const res = new KVMap<K, V>();
    map.forEach((value, key) => {
      res.set(key, value);
    });
    return res;
  }
}
