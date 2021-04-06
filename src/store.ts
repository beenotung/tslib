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
 * @param storage {Storage} e.g. localStorage
 * */
export function getStoreKeys(storage: Storage): string[] {
  const n = storage.length
  const keys: string[] = new Array(n)
  for (let i = 0; i < n; i++) {
    keys[i] = storage.key(i) as string
  }
  return keys
}
