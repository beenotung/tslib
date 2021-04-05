import { test } from 'mocha'
import { batchGenerator, iterableToGenerator } from '../src/generator'
import { expect } from './jest-adapter'

test('batchGenerator', () => {
  const array = new Array(6).fill(0).map((_, i) => i)
  const arrays = Array.from(batchGenerator(2, iterableToGenerator(array)))
  expect(arrays).toEqual([
    [0, 1],
    [2, 3],
    [4, 5],
  ])
})
