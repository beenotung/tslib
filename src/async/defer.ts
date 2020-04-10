import { isDefined } from '../lang'

export interface Defer<A, E> {
  promise: Promise<A>
  resolve: (a: A) => Promise<A>
  reject: (e: E) => Promise<A>
}

export function createDefer<A, E>(): Defer<A, E> {
  const res = {} as Defer<A, E>
  res.promise = new Promise<A>((resolve, reject) => {
    res.resolve = a => {
      resolve(a)
      return res.promise
    }
    res.reject = e => {
      reject(e)
      return res.promise
    }
  })
  return res
}

export async function resolveDefer<A, E>(
  defer: Defer<A, E>,
  a: A,
  f: () => E | Promise<E>,
) {
  if (isDefined(a)) {
    defer.resolve(a)
  } else {
    defer.reject(await f())
  }
  return defer.promise
}
