import { expect } from 'chai'
import { genFunction } from '../src/lang'

describe('genFunction()', () => {
  function echo(...args: any[]) {
    return args
  }
  it('should generate function that takes no arguments', () => {
    let f = genFunction(0, echo)
    expect(f()).deep.equals([])
    expect(f.name).to.equals('func0')
    expect(f.length).to.equals(0)
    expect(f.toString()).to.includes('func0()')
  })
  it('should generate function that takes one argument', () => {
    let f = genFunction(1, echo)
    expect(f(1)).deep.equals([1])
    expect(f.name).to.equals('func1')
    expect(f.length).to.equals(1)
    expect(f.toString()).to.includes('func1(a0)')
  })
  it('should generate function that takes multiple arguments', () => {
    let f = genFunction(3, echo)
    expect(f(1, 2, 3)).deep.equals([1, 2, 3])
    expect(f.name).to.equals('func3')
    expect(f.length).to.equals(3)
    expect(f.toString()).to.includes('func3(a0, a1, a2)')
  })
})
