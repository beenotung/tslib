import { AsyncStore } from './async-store';
import { CountedCache } from './counted-cache';
import { compare_number } from './number';
import { getLocalStorage, Store } from './store';

/**
 * only cache object
 * raw string item are not cached
 * */
export class CachedObjectStore {
  private objectCache = new CountedCache<{ size: number; value: any }>();
  private cacheSize = 0;
  private store: Store;
  private asyncStore: AsyncStore;

  constructor(
    dirpath: string,
    private maxCacheSize = Number.MAX_SAFE_INTEGER,
    maxStorageSize = Number.MAX_SAFE_INTEGER,
  ) {
    this.store = new Store(getLocalStorage(dirpath, maxStorageSize));
    this.asyncStore = new AsyncStore(dirpath);
  }

  clear(): void {
    this.asyncStore.clear();
    this.objectCache.clear();
    this.cacheSize = 0;
  }

  clearCache() {
    this.objectCache.clear();
    this.cacheSize = 0;
  }

  // do not cache to reduce memory load
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
    this.asyncStore.removeItem(key);
  }

  setItem(key: string, value: string): void {
    this.objectCache.remove(key);
    this.asyncStore.setItem(key, value);
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
    this.asyncStore.setItem(key, s);
  }
}
