/**
 * A Map that can do normal and reversed operations
 * */
export class KVMap<K, V> extends Map<K, V> {
  private reversed = new Map<V, K>();

  clear(): void {
    super.clear();
    this.reversed.clear();
  }

  delete(key: K): boolean {
    if (this.has(key)) {
      this.reversed.delete(this.get(key));
      super.delete(key);
      return true;
    }
    return false;
  }

  getKey(value: V): K | undefined {
    return this.reversed.get(value);
  }

  hasValue(value: V): boolean {
    return this.reversed.has(value);
  }

  set(key: K, value: V): this {
    this.reversed.set(value, key);
    return super.set(key, value);
  }

  static fromMap<K, V>(map: Map<K, V>) {
    const res = new KVMap();
    map.forEach((value, key) => {
      res.set(key, value);
    });
    return res;
  }
}
