import { expect } from 'chai'
import { countFractionDigits, fromLocaleString } from '../src/number'

describe('fromLocaleString TestSuit', () => {
  it('should reverse number.toLocaleString()', () => {
    function test(num: number) {
      let str = num.toLocaleString()
      expect(fromLocaleString(str)).to.equals(num)
    }
    for (let num of [0, 10, 100, 1e5, 1e10]) {
      test(num)
      test(-num)
    }
  })
})

describe('countFractionDigits TestSuit', () => {
  it('should count fraction digits', () => {
    expect(countFractionDigits(10)).to.equals(0)
    expect(countFractionDigits(10.1)).to.equals(1)
    expect(countFractionDigits(10.12)).to.equals(2)
    expect(countFractionDigits(10.123)).to.equals(3)
    expect(countFractionDigits(10.1234)).to.equals(4)
    expect(countFractionDigits(10.12345)).to.equals(5)
    expect(countFractionDigits(10.123456)).to.equals(6)
  })
  it('should count fraction digits of negative number', () => {
    expect(countFractionDigits(-10)).to.equals(0)
    expect(countFractionDigits(-10.1)).to.equals(1)
    expect(countFractionDigits(-10.12)).to.equals(2)
    expect(countFractionDigits(-10.123)).to.equals(3)
  })
  it('should count fraction digits of zero', () => {
    expect(countFractionDigits(0)).to.equals(0)
    expect(countFractionDigits(-0)).to.equals(0)
  })
  it('should handle exponential notation', () => {
    expect(countFractionDigits(1e23)).to.equals(0)
    expect(countFractionDigits(1.1e23)).to.equals(1)
    expect(countFractionDigits(1.12e23)).to.equals(2)
    expect(countFractionDigits(1.123e23)).to.equals(3)
  })
})
