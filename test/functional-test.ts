import { groupBy } from '../src/functional'
import { mapToArray } from '../src/map'

const xs = [1, 2, 3, 4]
const ys = groupBy(x => x % 2, xs)
const zs = mapToArray(ys, v => v)
console.log({ xs, ys, zs })
