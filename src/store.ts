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
