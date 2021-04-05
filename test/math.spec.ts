import { test } from 'mocha'
import { expect } from 'chai'
import { floor, numberToFraction, round, simplifyFraction } from '../src/math'
import { Random } from '../src/random'

describe('math.ts TestSuit', () => {
  describe('factorize + simplify', () => {
    function test1(x: number) {
      const [a, b] = numberToFraction(x)
      test(`factorize ${x}`, () => {
        expect(a / b, `${x} ${a}/${b}`).to.equals(x)
      })
      const a2 = a * Random.nextInt(10, -10)
      const b2 = b * Random.nextInt(5, -5)
      test(`simplify ${a2}/${b2}`, () => {
        const [c, d] = simplifyFraction([a2, b2])
        expect(c / d).deep.equals(a2 / b2)
      })
    }

    test1(0)
    test1(1)
    test1(2)
    test1(-2)
    test1(0.128)
    test1(-987.64)
    test1(365.2425)
  })
  describe('sign handling in simplification', () => {
    function test_simplify([a, b]: [number, number]) {
      test(`simplify ${a}/${b}`, () => {
        const [c, d] = simplifyFraction([a, b])
        expect(c / d).to.equals(a / b)
      })
    }

    function test_multiply([a, b]: [number, number], pow: number) {
      test_simplify([a, b])
      test_simplify([a * pow, b])
      test_simplify([a, b * pow])
      test_simplify([a * pow, b * pow])
    }

    function test_sign([a, b]: [number, number], pow: number) {
      test_multiply([a, b], pow)
      test_multiply([-a, b], pow)
      test_multiply([a, -b], pow)
      test_multiply([-a, -b], pow)
    }

    test_sign([4, 5], 1)
    test_sign([4, 5], 2)
    test_sign([4, 5], 18)
    test_sign([4, 5], -5)
  })
  describe('rounding', () => {
    test('round', () => {
      expect(round(3.14, 2)).to.equals(3.14)
      expect(round(3.1415, 2)).to.equals(3.14)
      expect(round(3.1497, 2)).to.equals(3.15)
    })
    test('floor', () => {
      expect(floor(3.14, 2)).to.equals(3.14)
      expect(floor(3.1415, 2)).to.equals(3.14)
      expect(floor(3.1497, 2)).to.equals(3.14)
    })
  })
})
