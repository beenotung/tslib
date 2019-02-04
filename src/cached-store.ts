import { AsyncStore } from './async-store';
import { CountedCache } from './counted-cache';
import { compare_number } from './number';
import { getLocalStorage, proxyStore, Store } from './store';

Symbol.objectCache = Symbol.for('objectCache');
Symbol.cacheSize = Symbol.for('cacheSize');
Symbol.store = Symbol.for('store');
Symbol.asyncStore = Symbol.for('asyncStore');
Symbol.maxCacheSize = Symbol.for('maxCacheSize');

/**
 * only cache object
 * raw string item are not cached
 * */
export class CachedObjectStore implements Store {
  get [Symbol.storage](): Storage {
    return this[Symbol.store][Symbol.storage];
  }

  set storage(storage: Storage) {
    const dirpath = storage._location;
    if (typeof dirpath !== 'string') {
      throw new Error('cannot swap storage instance without storage._location');
    }
    this[Symbol.store][Symbol.storage] = storage;
    this[Symbol.asyncStore][Symbol.dirpath] = dirpath;
  }

  // cannot be cached, require too much effort to monitor every setItem and removeItem
  get length(): number {
    return this[Symbol.store].length;
  }

  private [Symbol.objectCache] = new CountedCache<{
    size: number;
    value: any;
  }>();
  private [Symbol.cacheSize] = 0;
  private [Symbol.store]: Store;
  private [Symbol.asyncStore]: AsyncStore;
  private [Symbol.maxCacheSize]: number;

  private constructor(
    dirpath: string,
    maxCacheSize = Number.MAX_SAFE_INTEGER,
    maxStorageSize = Number.MAX_SAFE_INTEGER,
  ) {
    this[Symbol.store] = Store.create(getLocalStorage(dirpath, maxStorageSize));
    this[Symbol.asyncStore] = AsyncStore.create(dirpath);
    this[Symbol.maxCacheSize] = maxCacheSize;
  }

  clear(): void {
    this[Symbol.asyncStore].clear();
    this[Symbol.objectCache].clear();
    this[Symbol.cacheSize] = 0;
  }

  clearCache() {
    this[Symbol.objectCache].clear();
    this[Symbol.cacheSize] = 0;
  }

  // do not cache to reduce memory load
  getItem(key: string): string | null {
    return this[Symbol.store].getItem(key);
  }

  getObject<T>(key: string): T | null {
    if (this[Symbol.objectCache].has(key)) {
      const data = this[Symbol.objectCache].get(key);
      if (data !== null) {
        return data.value;
      }
    }
    const s = this.getItem(key);
    const value = JSON.parse(s);
    this[Symbol.objectCache].set(key, { size: s.length, value });
    return value;
  }

  // cannot be cached, require too much effort to monitor every setItem and removeItem
  key(index: number): string | null {
    return this[Symbol.store].key(index);
  }

  // cannot be cached, require too much effort to monitor every setItem and removeItem
  keys(): string[] {
    return this[Symbol.store].keys();
  }

  removeItem(key: string): void {
    this[Symbol.objectCache].remove(key);
    this[Symbol.asyncStore].removeItem(key);
  }

  setItem(key: string, value: string): void {
    this[Symbol.objectCache].remove(key);
    this[Symbol.asyncStore].setItem(key, value);
  }

  setObject(key: string, value): void {
    const s = JSON.stringify(value);
    this[Symbol.cacheSize] += s.length;
    if (this[Symbol.cacheSize] > this[Symbol.maxCacheSize]) {
      const caches = this[Symbol.objectCache].getAll();
      caches.sort((a, b) => compare_number(a[1].count, b[1].count));
      for (
        ;
        this[Symbol.cacheSize] > this[Symbol.maxCacheSize] && caches.length > 0;

      ) {
        const [key, cache] = caches.pop();
        this[Symbol.cacheSize] -= cache.data.size;
        this[Symbol.objectCache].remove(key);
      }
    }
    this[Symbol.objectCache].set(key, { size: s.length, value });
    this[Symbol.asyncStore].setItem(key, s);
  }

  static create(
    dirpath: string,
    maxCacheSize = Number.MAX_SAFE_INTEGER,
    maxStorageSize = Number.MAX_SAFE_INTEGER,
  ): CachedObjectStore {
    const store = new CachedObjectStore(dirpath, maxCacheSize, maxStorageSize);
    return proxyStore(store);
  }
}
