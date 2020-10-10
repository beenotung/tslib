/**
 * implement tape functions using jest
 * to aid migrating test from tape into jest
 * */

export let t = {
  end: () => {
    // noop
  },
  true: wrap1(a => expect(a).toBe(true)),
  equal: wrap2((a, b) => expect(a).toBe(b)),
  notEqual: wrap2((a, b) => expect(a).not.toBe(b)),
  deepEqual: wrap2((a, b) => expect(a).toEqual(b)),
  deepEquals: wrap2((a, b) => expect(a).toEqual(b)),
  notDeepEqual: wrap2((a, b) => expect(a).not.toEqual(b)),
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
    test(name, fn)
  } else {
    fn()
  }
}
