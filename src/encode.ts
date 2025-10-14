/**
 * Encodes an object into a URL-encoded query string.
 *
 * Similar to native `URLSearchParams` but with key differences:
 * - **Same behavior for strings and numbers**: Both are handled identically to native implementation
 * - **Different for arrays and objects**: Automatically converts complex values to JSON strings
 *   - Arrays: `[1,2,3]` becomes `"[1,2,3]"` (vs native: `"1,2,3"`)
 *   - Objects: `{a:1}` becomes `'{"a":1}'` (vs native: `"[object Object]"`)
 * - **Encoding differences**: Uses lowercase hex (`%3d`) and `%20` for spaces (vs native: `%3D` and `+`)
 * - **Null values**: Converts `null` to the string `"null"` (same as native behavior)
 *
 * @param o - Object to encode into query string
 * @returns URL-encoded query string
 *
 * @example
 * ```typescript
 * urlEncode({ name: 'john', age: 25 }) // "name=john&age=25"
 * urlEncode({ items: [1,2,3] }) // "items=%5b1%2c2%2c3%5d"
 * urlEncode({ user: { id: 1, username: 'tester' } }) // "user=%7b%22id%22%3a1%2c%22username%22%3a%22tester%22%7d"
 * ```
 */
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

export function decodeUTF16BE(buffer: Buffer): string {
  swapBytes(buffer)
  return buffer.toString('utf16le')
}

export function encodeUTF16BE(text: string): Buffer {
  let buffer = Buffer.from(text, 'utf-16le')
  swapBytes(buffer)
  return buffer
}

/**
 * convert between BE (big endian) and LE (little endian)
 */
export function swapBytes(buffer: Buffer) {
  for (let i = 0; i < buffer.length; i += 2) {
    let tmp = buffer[i]
    buffer[i] = buffer[i + 1]
    buffer[i + 1] = tmp
  }
}
