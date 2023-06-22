export interface Defer<A, E> {
  promise: Promise<A>
  resolve: (a: A) => Promise<A>
  reject: (e: E) => Promise<A>
}

export function createDefer<A = void, E = Error>(): Defer<A, E> {
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
