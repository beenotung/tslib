import { expect } from 'chai'
import { Random } from '../src/random'

describe('Random', () => {
  let samples = 1000

  function repeat(fn: () => void) {
    for (let i = 0; i < samples; i++) {
      fn()
    }
  }

  describe('fallback handle when upper and lower are reversed', () => {
    function test(args: {
      lower: number
      upper: number
      fn: (upper: number, lower: number) => number
    }) {
      let { lower, upper, fn } = args
      repeat(() => {
        let result = fn(upper, lower)
        expect(result).greaterThanOrEqual(lower)
        expect(result).lessThan(upper)

        result = fn(lower, upper)
        expect(result).greaterThanOrEqual(lower)
        expect(result).lessThan(upper)
      })
    }
    it('nextInt()', () => {
      test({ lower: 110, upper: 120, fn: Random.nextInt })
    })
    it('nextFloat()', () => {
      test({ lower: 110, upper: 120, fn: Random.nextFloat })
    })
  })

  describe('nextFloat()', () => {
    let lower = 0.8
    let upper = 1.2

    it('should not exceed the given number of decimal places', () => {
      let max_decimal = 2
      repeat(() => {
        let value = Random.nextFloat(lower, upper, max_decimal)
        let string = value.toString()
        let [integer, decimal] = string.split('.')
        let decimal_length = decimal ? decimal.length : 0
        expect(decimal_length).lessThanOrEqual(max_decimal)
      })
    })
  })
})
