import { expect } from 'chai'
import { n_permutation } from '../src/permutation'

describe('n_permutation', () => {
  let a = 'a'
  let b = 'b'
  let c = 'c'
  let list = [a, b, c]

  it('should return empty list for n = 0', () => {
    let actual = n_permutation(0, list)
    let expected = []
    expect(actual).to.deep.equals(expected)
  })

  it('should return list of each element for n = 1', () => {
    let actual = n_permutation(1, list)
    let expected = [[a], [b], [c]]
    expect(actual).to.deep.equals(expected)
  })

  it('should return list of two elements for n = 2', () => {
    let actual = n_permutation(2, list)
    let expected = [
      [a, a],
      [a, b],
      [a, c],
      [b, a],
      [b, b],
      [b, c],
      [c, a],
      [c, b],
      [c, c],
    ]
    expect(actual).to.deep.equals(expected)
  })

  it('should return list of three elements for n = 3', () => {
    let actual = n_permutation(3, list)
    let expected: string[][] = []
    for (let e1 of list) {
      for (let e2 of list) {
        for (let e3 of list) {
          expected.push([e1, e2, e3])
        }
      }
    }
    expect(actual).to.deep.equals(expected)
  })
})
