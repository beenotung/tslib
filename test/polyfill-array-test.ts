import { PolyfillArray } from '../src/polyfill-array'

interface Foo {
  x: number
}

const xs: PolyfillArray<Foo> = new PolyfillArray(3)
  .fill(0)
  .map((_, i) => i)
  .filter(x => x % 2 === 0)
  .map(x => ({ x }))
  .peek(x => console.log(x))
console.log(xs)

console.log(PolyfillArray.from([2, 3]).peek)
