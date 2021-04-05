import { memorize, MemorizePool } from '../src/memorize'

// tslint:disable

function time(f: () => any, name: string = f.name) {
  console.log('timing', name)
  const start = Date.now()
  const res = f()
  const end = Date.now()
  console.log(name, 'used', end - start, 'ms')
  if (res !== undefined) {
    console.log(name, 'has result:', res)
  }
}

function test(name: string, f: () => any, g: () => any, q?: () => any) {
  console.log('=== begin ' + name + ' ====')
  console.log('=== pass 1 ====')
  time(f, 'f')
  q ? time(q, 'q') : ''
  time(g, 'g')
  console.log('=== pass 2 ====')
  time(f, 'f')
  q ? time(q, 'q') : ''
  time(g, 'g')
  console.log('=== finish ====')
}

/* Fib number */
function test1() {
  const f = (n: number): number => (n < 2 ? 1 : f(n - 1) + f(n - 2))
  const q = memorize((n: number): number => (n < 2 ? 1 : q(n - 1) + q(n - 2)))
  const pool = new MemorizePool<number>()
  const g = function (n: number): number {
    return pool.getOrCalc(arguments, () => (n < 2 ? 1 : g(n - 1) + g(n - 2)))
  }
  const n = 45
  console.log('n=' + n)
  test(
    'recursion',
    () => f(n),
    () => g(n),
  )
}

/* deep loop */
function test2() {
  const heavy = (n: number, level: number, res: number): number => {
    if (level < 1) {
      return res
    }
    for (let i = 0; i < n; i++) {
      heavy(n, level - 1, res)
    }
    return res
  }
  const n = 10
  const l = (level: number) => {
    console.log('             ', '>>>>', 'level', '=', level, '<<<<')
    const f = (x: number): number => (x < 0 ? x : f(heavy(n, level, x - 1)))
    type F = typeof f
    const pool = new MemorizePool<number>()
    const g = function (x: number): number {
      return pool.getOrCalc(arguments, () =>
        x < 0 ? x : g(heavy(n, level, x - 1)),
      )
    }
    const t = (f: F) => () => f(10)
    test('deep loop (heavy compute)', t(f), t(g))
  }
  for (let level = 7; level <= 8; level++) {
    l(level)
  }
}

/* long arguments */
function test3() {
  // @ts-ignore
  const f = (q, w, e, a, s, d, z, x, c) => {
    console.log('>>called<<')
    return q + w + e + a + s + d + z + x + c
  }
  type F = typeof f
  const pool = new MemorizePool()
  // @ts-ignore
  const g = function (q, w, e, a, s, d, z, x, c) {
    const args: any = arguments
    return pool.getOrCalc(arguments, () => f.apply(null, args))
  }
  const t = (f: F) => () => f(1, 2, 3, 4, 5, 6, 7, 8, 9)
  test('long arguments (using pool)', t(f), t(g))
  test('long arguments (using wrapper)', t(f), t(memorize(f)))
}

test1()
test2()
test3()

// tslint:enable
