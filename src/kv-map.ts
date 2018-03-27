/**
 * A Map that can do normal and reversed operations
 * */
export class KVMap<K, V> implements Map<K, V> {
  [Symbol.toStringTag];
  private kvs = new Map<K, V>();
  private vks = new Map<V, K>();

  constructor(entries?: [K, V][]) {
    if (entries) {
      for (const [k, v] of entries) {
        this.set(k, v);
      }
    }
  }

  get size(): number {
    return this.kvs.size;
  };

  clear(): void {
    this.kvs.clear();
    this.vks.clear();
  }

  delete(key: K): boolean {
    if (this.kvs.has(key)) {
      this.vks.delete(this.kvs.get(key));
      this.kvs.delete(key);
      return true;
    }
    return false;
  }

  deleteKey = this.delete;

  deleteValue(value: V): boolean {
    if (this.vks.has(value)) {
      this.kvs.delete(this.vks.get(value));
      this.vks.delete(value);
      return true;
    }
    return false;
  }

  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
    this.kvs.forEach(callbackfn, this);
  }

  get(key: K): V | undefined {
    return this.kvs.get(key);
  }

  getValue = this.get;

  getKey(value: V): K | undefined {
    return this.vks.get(value);
  }

  has(key: K): boolean {
    return this.kvs.has(key);
  }

  hasKey = this.has;

  hasValue(value: V): boolean {
    return this.vks.has(value);
  }

  set(key: K, value: V): this {
    this.kvs.set(key, value);
    this.vks.set(value, key);
    return this;
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.kvs[Symbol.iterator]();
  }

  entries(): IterableIterator<[K, V]> {
    return this.kvs.entries();
  }

  keys(): IterableIterator<K> {
    return this.kvs.keys();
  }

  values(): IterableIterator<V> {
    return this.kvs.values();
  }

  toKVMap(): Map<K, V> {
    return this.kvs;
  }

  toVKMap(): Map<V, K> {
    return this.vks;
  }

  static fromMap<K, V>(map: Map<K, V>) {
    const res = new KVMap<K, V>();
    map.forEach((value, key) => {
      res.set(key, value);
    });
    return res;
  }
}
