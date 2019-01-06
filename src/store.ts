export let storeName = 'data';

let _store: Storage;

export function setStoreName(name: string) {
  storeName = name;
  _store = undefined;
}

function getStore() {
  if (!_store) {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      const { LocalStorage } = require('node-localstorage');
      _store = new LocalStorage(storeName);
    } else {
      _store = localStorage;
    }
  }
  return _store;
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
