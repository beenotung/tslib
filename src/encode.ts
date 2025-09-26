export function urlEncode(o: object): string {
  function escape(x: any): string {
    const type = typeof x
    if (type === 'number') {
      return x + ''
    }
    if (type === 'string') {
      let res = ''
      for (let i = 0; i < x.length; i++) {
        const c: string = x[i]
        if (
          ('A' <= c && c <= 'Z') ||
          ('a' <= c && c <= 'z') ||
          ('0' <= c && c <= '9')
        ) {
          res += c
        } else {
          res += '%' + c.charCodeAt(0).toString(16)
        }
      }
      return res
    }
    return escape(JSON.stringify(x))
  }

  return Object.entries(o)
    .map(([k, v]) => escape(k) + '=' + escape(v))
    .join('&')
}
