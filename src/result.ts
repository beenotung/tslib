export type Result<T> = T | Promise<T>

const PromiseString = Promise.resolve().toString()

export function isPromise(x: any): boolean {
  return String(x) === PromiseString
}

export function then<T, R>(
  x: Result<T>,
  f: (x: T) => Result<R>,
  onError?: (e: any) => void,
): Result<R> {
  if (isPromise(x)) {
    const res = (x as Promise<T>).then(f)
    if (onError) {
      res.catch(onError)
    }
    return res
  }
  return f(x as T)
}

export function thenF<T, R>(
  f: () => Result<T>,
  q: (x: T) => Result<R>,
  onError?: (e: any) => void,
): Result<R> {
  try {
    const x = f()
    return then(x, q, onError)
  } catch (e) {
    if (typeof onError === 'function') {
      onError(e)
    }
    return Promise.reject(e)
  }
}
