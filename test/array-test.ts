import { Bar } from 'cli-progress'
import test from 'tape'
import {
  binArray,
  cloneArray,
  countArray,
  countElement,
  defaultComparator,
  getMaxArraySize,
  makeArray,
  max,
  maxByField,
  maxByFunc,
  median,
  min,
  minByField,
  minByFunc,
  mode,
  pushBackward,
  pushForward,
  range,
  sum,
  sumByField,
  zipArray,
} from '../src/array'

test('getMaxArraySize', t => {
  const MaxArraySize = getMaxArraySize()
  console.log({ MaxArraySize })
  const xss = new Array(MaxArraySize)
  const bar = new Bar({})
  bar.start(MaxArraySize, 0)
  for (let i = 0; i < 10000; i++) {
    xss[i] = new Array(MaxArraySize)
    bar.increment(1)
  }
  bar.stop()
  t.end()
})

test('cloneArray', t => {
  const xs = [1, 3, 2]
  const ys = cloneArray(xs)

  t.deepEquals(xs, ys, 'should clone identical array')

  ys[0]++
  t.notDeepEqual(xs, ys, 'should not modify original array')

  t.end()
})

test('range', t => {
  const xs = range(1, 100)
  t.deepEqual(
    xs,
    new Array(100).fill(0).map((x, i) => i + 1),
  )
  t.end()
})

test('binArray', t => {
  const xs = range(1, 100)
  const xss = binArray(xs, 7)
  t.deepEqual(xss.length, 15)
  t.deepEqual(xss[0], [1, 2, 3, 4, 5, 6, 7])
  t.deepEqual(xss[14], [99, 100])
  t.end()
})

test('countArray', t => {
  t.equal(
    countArray(range(1, 100), x => x % 2 === 0),
    50,
  )
  t.end()
})

test('array compare', t => {
  const numbers = [1, 3, 2]
  const negativeNumbers = numbers.map(x => -x)
  const objects = numbers.map(x => ({ x }))
  const numberSum = 1 + 2 + 3

  t.equal(max(numbers), 3, 'max')
  t.deepEqual(maxByField(objects, 'x'), { x: 3 }, 'maxByField')
  t.deepEquals(
    maxByFunc(objects, (a, b) => defaultComparator(a.x, b.x)),
    { x: 3 },
    'maxByFunc',
  )

  t.equal(min(numbers), 1, 'min')
  t.equal(min(negativeNumbers), -3, 'min negative')
  t.deepEqual(minByField(objects, 'x'), { x: 1 }, 'minByField')
  t.deepEquals(
    minByFunc(objects, (a, b) => defaultComparator(a.x, b.x)),
    { x: 1 },
    'minByFunc',
  )

  t.equal(sum(numbers), numberSum, 'sum')
  t.equal(sumByField(objects, 'x'), numberSum, 'sumByField')

  t.end()
})

test('median', t => {
  const xs = [1, 4, 5, 2, 1, 3, 4, 1, 5, 1, 5, 3, 2, 1, 2, 3]
  const x = median(xs)
  t.equal(x, 2.5)
  t.end()
})

test('counting', t => {
  const xs = [
    ...'a'.repeat(2).split(''),
    ...'b'.repeat(3).split(''),
    ...'c'.repeat(4).split(''),
    ...'d'.repeat(2).split(''),
  ]
  t.equal(countElement(xs, 'c'), 4, 'countElement')
  t.equal(mode(xs), 'c', 'mode')
  t.end()
})

test('push', t => {
  const xs = [1, 2, 3]
  pushBackward(xs, 4)
  t.deepEqual(xs, [1, 2, 3, 4])
  pushBackward(xs, 2)
  t.deepEqual(xs, [1, 3, 2, 4])
  pushForward(xs, 2)
  t.deepEqual(xs, [1, 2, 3, 4])
  pushForward(xs, 0)
  t.deepEqual(xs, [0, 1, 2, 3, 4])
  t.end()
})

test('zip', t => {
  const a = [1, 2, 3]
  const b = ['apple', 'banana', 'cherry']
  const c = zipArray(a, b)
  t.deepEqual(c, [
    [1, 'apple'],
    [2, 'banana'],
    [3, 'cherry'],
  ])
  t.end()
})

test('makeArray', t => {
  const n = 10
  t.deepEqual(
    makeArray(n, i => i * 10),
    new Array(n).fill(0).map((_, i) => i * 10),
  )
  t.end()
})
