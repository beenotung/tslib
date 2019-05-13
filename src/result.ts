export type Result<T> = T | Promise<T>;

const PromiseString = Promise.resolve().toString();

export function then<T, R>(x: Result<T>, f: (x: T) => Result<R>): Result<R> {
  if (x && typeof x === 'object' && x.toString() === PromiseString) {
    return (x as Promise<T>).then(f);
  }
  return f(x as T);
}
