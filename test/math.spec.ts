import { test } from 'mocha'
import { expect } from 'chai'
import { numberToFraction, simplifyFraction } from '../src/math'
import { Random } from '../src/random'

describe('math.ts TestSuit', () => {
  describe('factorize + simplify', () => {
    function test1(x: number) {
      let [a, b] = numberToFraction(x)
      test(`factorize ${x}`, () => {
        expect(a / b, `${x} ${a}/${b}`).to.equals(x)
      })
      let a2 = a * Random.nextInt(10, -10)
      let b2 = b * Random.nextInt(5, -5)
      test(`simplify ${a2}/${b2}`, () => {
        let [c, d] = simplifyFraction([a2, b2])
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
        let [c, d] = simplifyFraction([a, b])
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
})
