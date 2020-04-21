import { KVMap } from '../src/kv-map'

const map = new KVMap()
map.set(1, 2)
map.set(3, 4)
console.log('keys:', map.keys())
console.log('values:', map.values())
console.log('2?', map.get(1))
console.log('1?', map.getKeys(2))
