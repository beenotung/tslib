import {CachedObjectStore} from "../src/cached-store";

let store = CachedObjectStore.create('data');
console.log('ownPropertyNames:', Object.getOwnPropertyNames(store));
console.log('ownPropertySymbols:', Object.getOwnPropertySymbols(store));
