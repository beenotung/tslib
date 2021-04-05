import { expect } from 'chai'
import reflection from '../src/reflection'
import { wrapFunction } from '../src/reflection'

describe('reflection.ts testsuit', () => {
  function add(a: number, b: number): number {
    return a + b
  }

  function test(
    wrapFunction: (...args: any[]) => any,
    name = wrapFunction.name,
  ) {
    describe(name, () => {
      it('should wrap function with given name', function () {
        let res = wrapFunction(add, 2, 'sum')
        expect(res.name).to.equals('sum')
      })
      it('should wrap function with given length', function () {
        let res = wrapFunction(add, 2, 'sum')
        expect(res).to.be.length(2)
      })
      it('should wrap function with given logics', function () {
        let res = wrapFunction(add, 2, 'sum')
        expect(res(3, 4)).to.equals(7)
      })
    })
  }

  test(wrapFunction, 'wrapFunction')
  test(reflection.wrapFunction_defineProperty)
  test(reflection.wrapFunction_newFunction_eval)
})
