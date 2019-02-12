export interface CacheItem<T> {
  count: number;
  data: T;
}

export class CountedCache<T = any> {
  private caches: { [key: string]: CacheItem<T> } = {};
  private count = 0;

  get length(): number {
    return this.count;
  }

  getAll(): Array<[string, CacheItem<T>]> {
    return Object.keys(this.caches).map(
      key => [key, this.caches[key]] as [string, CacheItem<T>],
    );
  }

  clear(): void {
    this.caches = {};
  }

  has(key: string): boolean {
    return key in this.caches;
  }

  set(key: string, value: T): void {
    const item = this.caches[key];
    if (item) {
      item.count++;
      item.data = value;
    } else {
      this.caches[key] = {
        count: 1,
        data: value,
      };
      this.count++;
    }
  }

  get(key: string): T | null {
    const item = this.caches[key];
    if (item) {
      item.count++;
      return item.data;
    }
    return null;
  }

  remove(key: string): void {
    if (key in this.caches) {
      delete this.caches[key];
      this.count--;
    }
  }
}
