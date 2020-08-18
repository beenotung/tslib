import { mapIterableToArray } from '../src/iterable'

describe('Iterable TestSuit', function() {
  it('should map iterable to array', function() {
    expect(mapIterableToArray(new Set([1, 2, 3]), x => x + 1)).toEqual([
      2,
      3,
      4,
    ])
  })
})
