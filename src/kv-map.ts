/**
 * A Map that can do normal and reversed operations
 * */
export class KVMap<K, V> implements Map<K, V> {
  public [Symbol.toStringTag];
  public deleteKey = this.delete;
  public getValue = this.get;
  public hasKey = this.has;
  private kvs = new Map<K, V>();
  private vks = new Map<V, K>();

  constructor(entries?: Array<[K, V]>) {
    if (entries) {
      for (const [k, v] of entries) {
        this.set(k, v);
      }
    }
  }

  get size(): number {
    return this.kvs.size;
  }

  public clear(): void {
    this.kvs.clear();
    this.vks.clear();
  }

  public delete(key: K): boolean {
    if (this.kvs.has(key)) {
      this.vks.delete(this.kvs.get(key));
      this.kvs.delete(key);
      return true;
    }
    return false;
  }

  public deleteValue(value: V): boolean {
    if (this.vks.has(value)) {
      this.kvs.delete(this.vks.get(value));
      this.vks.delete(value);
      return true;
    }
    return false;
  }

  public forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any,
  ): void {
    this.kvs.forEach(callbackfn, this);
  }

  public get(key: K): V | undefined {
    return this.kvs.get(key);
  }

  public getKey(value: V): K | undefined {
    return this.vks.get(value);
  }

  public has(key: K): boolean {
    return this.kvs.has(key);
  }

  public hasValue(value: V): boolean {
    return this.vks.has(value);
  }

  public set(key: K, value: V): this {
    this.kvs.set(key, value);
    this.vks.set(value, key);
    return this;
  }

  public [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.kvs[Symbol.iterator]();
  }

  public entries(): IterableIterator<[K, V]> {
    return this.kvs.entries();
  }

  public keys(): IterableIterator<K> {
    return this.kvs.keys();
  }

  public values(): IterableIterator<V> {
    return this.kvs.values();
  }

  public toKVMap(): Map<K, V> {
    return this.kvs;
  }

  public toVKMap(): Map<V, K> {
    return this.vks;
  }
}

export namespace KVMap {
  export function fromMap<K, V>(map: Map<K, V>) {
    const res = new KVMap<K, V>();
    map.forEach((value, key) => {
      res.set(key, value);
    });
    return res;
  }
}
