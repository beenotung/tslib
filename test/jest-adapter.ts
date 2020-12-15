import chai from 'chai'

/**
 * implement tape functions using chai
 * to aid migrating test from tape into mocha
 * */
export let expect = function expect(result: any) {
  return {
    toEqual: (expected: any) => chai.expect(result).deep.equals(expected),
    not: {
      toEqual: (expected: any) => chai.expect(result).not.deep.equals(expected),
    },
  }
}
