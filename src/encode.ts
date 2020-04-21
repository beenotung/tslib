import { forI, Obj, objToArray } from './lang'

export function urlEncode(o: Obj<string | number>): string {
  function escape(x: any): string {
    const type = typeof x
    if (type === 'number') {
      return x + ''
    }
    if (type === 'string') {
      let res = ''
      forI(i => {
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
      }, x.length)
      return res
    }
    return escape(JSON.stringify(x))
  }

  return objToArray(o)
    .map(vk => escape(vk[1]) + '=' + escape(vk[0]))
    .join('&')
}
