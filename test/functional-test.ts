import { groupBy } from '../src/functional';
import { mapToArray } from '../src/map';

let xs = [1, 2, 3, 4];
let ys = groupBy(x => x % 2, xs);
let zs = mapToArray(ys, v => v);
console.log({ xs, ys, zs });
