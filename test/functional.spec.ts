import { mergeAll } from './../src/functional'
import { expect } from 'chai'
import { groupBy } from '../src/functional'
import { mapToArray } from '../src/map'

describe('functional.ts tests', () => {
  const numbers = [1, 2, 3, 4]
  const groupMap = groupBy(x => x % 2, numbers)
  const values = mapToArray(groupMap, v => v)
  const keys = mapToArray(groupMap, (v, k) => k)

  const users1 = [
    { id: 1, username: 'alice' },
    { id: 2, username: 'bob' },
  ]
  const users2 = [
    { id: 1, username: 'alice' },
    { id: 3, username: 'charlie' },
  ]
  const uniqueUsers = mergeAll(user => user.id, users1, users2)

  it('should not modify original input', () => {
    expect(numbers).to.deep.equals([1, 2, 3, 4])
    expect(users1).to.deep.equals([
      { id: 1, username: 'alice' },
      { id: 2, username: 'bob' },
    ])
    expect(users2).to.deep.equals([
      { id: 1, username: 'alice' },
      { id: 3, username: 'charlie' },
    ])
  })

  it('should group Array values into Map by custom key mapper', () => {
    expect(groupMap).to.deep.equals(
      new Map([
        [1, [1, 3]],
        [0, [2, 4]],
      ]),
    )
  })

  it('should convert Map into Array with custom mapper', () => {
    expect(keys).to.deep.equals([1, 0])
    expect(values).to.deep.equals([
      [1, 3],
      [2, 4],
    ])
  })

  it('should merge two array by custom key mapper', () => {
    expect(uniqueUsers).to.deep.equals([
      { id: 1, username: 'alice' },
      { id: 2, username: 'bob' },
      { id: 3, username: 'charlie' },
    ])
  })
})
