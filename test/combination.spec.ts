import { expect } from 'chai'
import { any_combinations, n_combinations } from '../src/combination'

describe('n_combination', () => {
  let a = 'a'
  let b = 'b'
  let c = 'c'
  let d = 'd'
  let list = [a, b, c, d]

  it('should return empty list for n = 0', () => {
    let actual = n_combinations(0, list)
    let expected = []
    expect(actual).to.deep.equals(expected)
  })

  it('should return list of each element for n = 1', () => {
    let actual = n_combinations(1, list)
    let expected = [[a], [b], [c], [d]]
    expect(actual).to.deep.equals(expected)
  })

  it('should return list of two elements for n = 2', () => {
    let actual = n_combinations(2, list)
    let expected = [
      [a, b],
      [a, c],
      [a, d],
      [b, c],
      [b, d],
      [c, d],
    ]
    expect(actual).to.deep.equals(expected)
  })

  it('should return list of three elements for n = 3', () => {
    let actual = n_combinations(3, list)
    let expected = [
      [a, b, c],
      [a, b, d],
      [a, c, d],
      [b, c, d],
    ]
    expect(actual).to.deep.equals(expected)
  })

  it('should return entire list of for n = length(list)', () => {
    let actual = n_combinations(4, list)
    let expected = [list]
    expect(actual).to.deep.equals(expected)
  })
})

describe('any_combination', () => {
  it('should return list of 1 to n length', () => {
    let list = 'abcd'.split('')
    let expected = `
a
b
ab
c
ac
bc
abc
d
ad
bd
abd
cd
acd
bcd
abcd
`
      .trim()
      .split('\n')
      .map(s => s.split(''))
    expect(any_combinations(list)).to.deep.equals(expected)
  })
})
