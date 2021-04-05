import { createDefer } from './defer'

export async function tryFAsync<A>(f: () => A): Promise<A> {
  try {
    return f()
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function autoRetryAsync<A>(
  f: () => Promise<A>,
  retry_delay = 1000,
): Promise<A> {
  try {
    return await f()
  } catch (e) {
    if (retry_delay > 0) {
      const defer = createDefer<A, any>()
      setTimeout(
        () =>
          autoRetryAsync(f, retry_delay)
            .then(defer.resolve)
            .catch(defer.reject),
        retry_delay,
      )
      return defer.promise
    } else {
      return await autoRetryAsync(f, retry_delay)
    }
  }
}
