/**
 * check if the status code is 2xx
 * */
export function checkedFetch<T>({
  input,
  init,
  on2xx,
  non2xx,
}: {
  input: RequestInfo
  init?: RequestInit
  on2xx: (response: Response) => T | Promise<T>
  non2xx: (response: Response) => T | Promise<T>
}): Promise<T> {
  return fetch(input, init).then(res => {
    if (200 <= res.status && res.status < 300) {
      return on2xx(res)
    }
    return non2xx(res)
  })
}
