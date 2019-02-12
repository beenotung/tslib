import {getLocalStorage, Store, storeGet, storeSet} from '../src/store';

let key = 'store-test';
let x = storeGet(key);
console.log({x});
let y = x + 1;
storeSet(key, y);

let store = Store.create(getLocalStorage('data'));
console.log(store['now'] = Date.now());
console.log(store['now'] == store.getItem('now'));
