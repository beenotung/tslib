import { expect } from 'chai'

/**
 * implement tape functions using chai
 * to aid migrating test from tape into mocha
 * */
export const t = {
  end: () => {
    // noop
  },
  true: wrap1(a => expect(a).true),
  equal: wrap2((a, b) => expect(a).equals(b)),
  notEqual: wrap2((a, b) => expect(a).not.equals(b)),
  deepEqual: wrap2((a, b) => expect(a).deep.equals(b)),
  deepEquals: wrap2((a, b) => expect(a).deep.equals(b)),
  notDeepEqual: wrap2((a, b) => expect(a).not.deep.equals(b)),
}

function wrap1(fn: (a: any) => void) {
  return (a: any, name?: string) => {
    run(name, () => fn(a))
  }
}

function wrap2(fn: (a: any, b: any) => void) {
  return (a: any, b: any, name?: string) => {
    run(name, () => fn(a, b))
  }
}

function run(name: string | undefined, fn: () => void) {
  if (name) {
    it(name, () => {
      fn()
    })
  } else {
    fn()
  }
}
