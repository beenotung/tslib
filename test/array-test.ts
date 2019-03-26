import { binArray, mode, range } from '../src/array';

let xs = range(1, 100);
console.log({ xs });
let xss = binArray(xs, 7);
console.log({ xss });

console.log('mode:', mode(['a', 'a', 'b', 'b', 'b', 'c', 'c', 'd', 'd']));
