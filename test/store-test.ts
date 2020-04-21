import { getLocalStorage, Store, storeGet, storeSet } from '../src/store'

const key = 'store-test'
const x = storeGet(key)
console.log({ x })
const y = x + 1
storeSet(key, y)

const store: any = Store.create(getLocalStorage('data'))
console.log((store.now = Date.now()))
console.log(store.now === store.getItem('now'))
