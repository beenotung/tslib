import { CachedObjectStore } from '../src/cached-store'

const store = CachedObjectStore.create('data')
console.log('ownPropertyNames:', Object.getOwnPropertyNames(store))
console.log('ownPropertySymbols:', Object.getOwnPropertySymbols(store))
