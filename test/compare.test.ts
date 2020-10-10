import { compare, compare_by_keys, sort_by_keys } from '../src/compare'
import { t } from './tape-adaptor'

const numbers = [1, 10, 3, 2]
const sorted = [1, 2, 3, 10]
test('sort numeric number', () => {
  t.deepEquals(numbers.slice().sort(compare), sorted)
  t.end()
})

test('sort object array by key', () => {
  t.deepEquals(
    sort_by_keys(
      numbers.map(x => ({ x })),
      ['x'],
    ),
    sorted.map(x => ({ x })),
  )
  const objects = numbers.map(x => ({ x }))
  t.deepEquals(
    objects.sort(
      compare_by_keys<typeof objects[0]>(['x']),
    ),
    sorted.map(x => ({ x })),
  )
  t.deepEquals(
    sort_by_keys(
      [
        { a: 10, b: 10 },
        { a: 1, b: 1 },
        { a: 10, b: 1 },
        { a: 1, b: 10 },
      ],
      ['a', 'b'],
    ),
    [
      { a: 1, b: 1 },
      { a: 1, b: 10 },
      { a: 10, b: 1 },
      { a: 10, b: 10 },
    ],
  )
  t.end()
})

test('sort object with non-numeric key', () => {
  const user = {
    name: 'Alice',
    age: 20,
    other_field: true,
  }
  // should compile without complaining the boolean field
  sort_by_keys([user], ['name', 'age'])
  t.end()
})
