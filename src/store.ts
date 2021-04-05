/// <reference types="./global" />
Symbol.storage = Symbol.for('storage')

export function getNodeStore(name: string, quota?: number): Storage {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { LocalStorage } = require('node-localstorage')
  return typeof quota === 'number'
    ? new LocalStorage(name, quota)
    : new LocalStorage(name)
}

export function getLocalStorage(name: string, quota?: number): Storage {
  return typeof localStorage === 'undefined' || localStorage === null
    ? getNodeStore(name, quota)
    : localStorage
}

export interface IStore<getItemResult, setItemResult> {
  getItem(key: string): getItemResult

  setItem(key: string, value: string): setItemResult
}

export function proxyStore<
  getItemResult = string | null,
  setItemResult = void,
  Store extends IStore<getItemResult, setItemResult> = IStore<
    getItemResult,
    setItemResult
  >
>(store: Store) {
  return new Proxy(store, {
    get(target: Store, p: PropertyKey, receiver: any): any {
      const value = Reflect.get(target, p, receiver)
      if (
        typeof p === 'symbol' ||
        p === 'inspect' ||
        typeof value === 'function'
      ) {
        return value
      }
      return target.getItem(p as string)
    },
    set(target: Store, p: PropertyKey, value: any, receiver: any): boolean {
      if (typeof p === 'symbol') {
        return Reflect.set(target, p, value, receiver)
      }
      target.setItem(p as string, value)
      return true
    },
  })
}

export class Store implements Storage {
  [Symbol.storage]: Storage

  private constructor(storage: Storage) {
    this[Symbol.storage] = storage
  }

  get length(): number {
    return this[Symbol.storage].length
  }

  clear(): void {
    return this[Symbol.storage].clear()
  }

  getItem(key: string): string | null {
    return this[Symbol.storage].getItem(key)
  }

  getObject<T>(key: string): T | null {
    const value = this.getItem(key)
    return JSON.parse(value as string)
  }

  key(index: number): string | null {
    const value = this[Symbol.storage].key(index)
    return value === undefined ? null : value
  }

  keys(): string[] {
    const n = this.length
    const keys: string[] = new Array(n)
    for (let i = 0; i < n; i++) {
      keys[i] = this.key(i) as string
    }
    return keys
  }

  removeItem(key: string): void {
    return this[Symbol.storage].removeItem(key)
  }

  setItem(key: string, value: string): void {
    return this[Symbol.storage].setItem(key, value)
  }

  setObject(key: string, value: any): void {
    return this.setItem(key, JSON.stringify(value))
  }

  static create(storage: Storage): Store {
    const store = new Store(storage)
    return proxyStore(store)
  }
}

/**
 * below are deprecated
 * the impl below use global state, may have unintended side effect by other client
 * */

export let storeName = 'data'
export let storeQuota: number

let _store: Storage | undefined

export function setStoreName(name: string) {
  storeName = name
  _store = undefined
}

export function setStoreQuota(quota: number) {
  storeQuota = quota
  _store = undefined
}

export function getStore(): Storage {
  if (!_store) {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      _store = getNodeStore(storeName, storeQuota)
    } else {
      _store = localStorage
    }
  }
  return _store
}

export function storeSet(key: string, value: any) {
  getStore().setItem(key, JSON.stringify(value))
}

export function storeGet(key: string) {
  const s = getStore().getItem(key)
  try {
    return JSON.parse(s as string)
  } catch (e) {
    return s
  }
}

export function storeLength(): number {
  return getStore().length
}

export function storeKey(index: number): string | null {
  return getStore().key(index)
}

export function storeKeys(): string[] {
  const store = getStore()
  const n = store.length
  const keys: string[] = new Array(n)
  for (let i = 0; i < n; i++) {
    keys[i] = store.key(i) as string
  }
  return keys
}
