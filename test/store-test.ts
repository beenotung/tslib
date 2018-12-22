import { storeGet, storeSet } from '../src/store';

let key = 'store-test';
let x = storeGet(key);
console.log({ x });
let y = x + 1;
storeSet(key, y);
