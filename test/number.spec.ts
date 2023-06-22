import { expect } from 'chai'
import { fromLocaleString } from '../src/number'

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
