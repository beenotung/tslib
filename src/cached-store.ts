import { CountedCache } from './counted-cache';
import { compare_number } from './number';
import { Store } from './store';

/**
 * only cache object
 * raw string item are not cached
 * */
export class CachedObjectStore implements Store {
  objectCache = new CountedCache<{ size: number; value: any }>();
  cacheSize = 0;

  constructor(
    public store: Store,
    public maxCacheSize = Number.MAX_SAFE_INTEGER,
  ) {}

  clear(): void {
    this.store.clear();
    this.objectCache.clear();
    this.cacheSize = 0;
  }

  getItem(key: string): string | null {
    return this.store.getItem(key);
  }

  getObject<T>(key: string): T | null {
    if (this.objectCache.has(key)) {
      return this.objectCache.get(key).value;
    }
    const value = JSON.parse(this.getItem(key));
    this.objectCache.set(key, value);
    return value;
  }

  // cannot be cached, require too much effort to monitor every setItem and removeItem
  key(index: number): string | null {
    return this.store.key(index);
  }

  // cannot be cached, require too much effort to monitor every setItem and removeItem
  keys(): string[] {
    return this.store.keys();
  }

  // cannot be cached, require too much effort to monitor every setItem and removeItem
  get length(): number {
    return this.store.length;
  }

  removeItem(key: string): void {
    this.objectCache.remove(key);
    this.store.removeItem(key);
  }

  setItem(key: string, value: string): void {
    this.objectCache.remove(key);
    this.store.setItem(key, value);
  }

  setObject(key: string, value): void {
    const s = JSON.stringify(value);
    this.cacheSize += s.length;
    if (this.cacheSize > this.maxCacheSize) {
      const caches = this.objectCache.getAll();
      caches.sort((a, b) => compare_number(a[1].count, b[1].count));
      for (; this.cacheSize > this.maxCacheSize && caches.length > 0; ) {
        const [key, cache] = caches.pop();
        this.cacheSize -= cache.data.size;
        this.objectCache.remove(key);
      }
    }
    this.objectCache.set(key, { size: s.length, value });
    this.store.setItem(key, s);
  }
}
