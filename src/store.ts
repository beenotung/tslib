export let storeName = 'data';
export let storeQuota: number;

let _store: Storage;

export function setStoreName(name: string) {
  storeName = name;
  _store = undefined;
}

export function setStoreQuota(quota: number) {
  storeQuota = quota;
  _store = undefined;
}

export function getStore() {
  if (!_store) {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      _store = getNodeStore(storeName, storeQuota);
    } else {
      _store = localStorage;
    }
  }
  return _store;
}

export function getNodeStore(name: string, quota?: number): Storage {
  const { LocalStorage } = require('node-localstorage');
  return typeof quota === 'number'
    ? new LocalStorage(name, quota)
    : new LocalStorage(name);
}

export function getLocalStorage(name: string, quota?: number): Storage {
  return typeof localStorage === 'undefined' || localStorage === null
    ? getNodeStore(name, quota)
    : localStorage;
}

export function storeSet(key: string, value) {
  getStore().setItem(key, JSON.stringify(value));
}

export function storeGet(key: string) {
  const s = getStore().getItem(key);
  try {
    return JSON.parse(s);
  } catch (e) {
    return s;
  }
}

export function storeLength(): number {
  return getStore().length;
}

export function storeKey(index: number): string | null {
  return getStore().key(index);
}

export function storeKeys(): string[] {
  const store = getStore();
  const n = store.length;
  const keys: string[] = new Array(n);
  for (let i = 0; i < n; i++) {
    keys[i] = store.key(i);
  }
  return keys;
}
