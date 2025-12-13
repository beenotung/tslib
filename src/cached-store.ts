import { AsyncStore, dirpathSymbol } from './async-store'
import { compare } from './compare'
import { CacheItem, CountedCache } from './counted-cache'
import { getLocalStorage, proxyStore, storageSymbol, Store } from './store'

export const objectCacheSymbol = Symbol.for('objectCache')
export const cacheSizeSymbol = Symbol.for('cacheSize')
export const storeSymbol = Symbol.for('store')
export const asyncStoreSymbol = Symbol.for('asyncStore')
export const maxCacheSizeSymbol = Symbol.for('maxCacheSize')

/**
 * only cache object
 * raw string item are not cached
 * */
export class CachedObjectStore implements Store {
  private [objectCacheSymbol] = new CountedCache<{
    size: number
    value: any
  }>()
  private [cacheSizeSymbol] = 0
  private [storeSymbol]: Store
  private [asyncStoreSymbol]: AsyncStore
  private [maxCacheSizeSymbol]: number

  private constructor(
    dirpath: string,
    maxCacheSize = Number.MAX_SAFE_INTEGER,
    maxStorageSize = Number.MAX_SAFE_INTEGER,
  ) {
    this[storeSymbol] = Store.create(getLocalStorage(dirpath, maxStorageSize))
    this[asyncStoreSymbol] = AsyncStore.create(dirpath)
    this[maxCacheSizeSymbol] = maxCacheSize
  }

  get [storageSymbol](): Storage {
    return this[storeSymbol][storageSymbol]
  }

  set storage(storage: Storage) {
    const dirpath = storage._location
    if (typeof dirpath !== 'string') {
      throw new Error('cannot swap storage instance without storage._location')
    }
    this[storeSymbol][storageSymbol] = storage
    this[asyncStoreSymbol][dirpathSymbol] = dirpath
  }

  // cannot be cached, require too much effort to monitor every setItem and removeItem
  get length(): number {
    return this[storeSymbol].length
  }

  clear(): void {
    this[asyncStoreSymbol].clear()
    this[objectCacheSymbol].clear()
    this[cacheSizeSymbol] = 0
  }

  clearCache() {
    this[objectCacheSymbol].clear()
    this[cacheSizeSymbol] = 0
  }

  // do not cache to reduce memory load
  getItem(key: string): string | null {
    return this[storeSymbol].getItem(key)
  }

  getObject<T>(key: string): T | null {
    if (this[objectCacheSymbol].has(key)) {
      const data = this[objectCacheSymbol].get(key)
      if (data !== null) {
        return data.value
      }
    }
    const s = this.getItem(key)
    if (s === null) {
      return null
    }
    const value = JSON.parse(s)
    this[objectCacheSymbol].set(key, { size: s.length, value })
    return value
  }

  // cannot be cached, require too much effort to monitor every setItem and removeItem
  key(index: number): string | null {
    return this[storeSymbol].key(index)
  }

  // cannot be cached, require too much effort to monitor every setItem and removeItem
  keys(): string[] {
    return this[storeSymbol].keys()
  }

  removeItem(key: string): void {
    this[objectCacheSymbol].remove(key)
    this[asyncStoreSymbol].removeItem(key)
  }

  setItem(key: string, value: string): void {
    this[objectCacheSymbol].remove(key)
    this[asyncStoreSymbol].setItem(key, value)
  }

  setObject(key: string, value: any): void {
    const s = JSON.stringify(value)
    this[cacheSizeSymbol] += s.length
    if (this[cacheSizeSymbol] > this[maxCacheSizeSymbol]) {
      const caches: Array<[string, CacheItem<any>]> =
        this[objectCacheSymbol].getAll()
      caches.sort((a, b) => compare(a[1].count, b[1].count))
      for (
        ;
        this[cacheSizeSymbol] > this[maxCacheSizeSymbol] && caches.length > 0;
      ) {
        const [key, cache] = caches.pop() as [string, CacheItem<any>]
        this[cacheSizeSymbol] -= cache.data.size
        this[objectCacheSymbol].remove(key)
      }
    }
    this[objectCacheSymbol].set(key, { size: s.length, value })
    this[asyncStoreSymbol].setItem(key, s)
  }

  static create(
    dirpath: string,
    maxCacheSize = Number.MAX_SAFE_INTEGER,
    maxStorageSize = Number.MAX_SAFE_INTEGER,
  ): CachedObjectStore {
    const store = new CachedObjectStore(dirpath, maxCacheSize, maxStorageSize)
    return proxyStore(store)
  }
}
