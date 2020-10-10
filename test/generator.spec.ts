import { batchGenerator, iterableToGenerator } from '../src/generator'

test('batchGenerator', () => {
  let array = new Array(6).fill(0).map((_, i) => i)
  let arrays = Array.from(batchGenerator(2, iterableToGenerator(array)))
  expect(arrays).toEqual([
    [0, 1],
    [2, 3],
    [4, 5],
  ])
})
