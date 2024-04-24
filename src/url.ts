export function parseURLSearchParams<T extends object>(
  /**
   *  @example "http://localhost:4200/profile?id=123&tab=posts"
   *  @example "?id=123&tab=posts"
   *  @example "id=123&tab=posts"
   * */
  url = location.search,
  options?: {
    parse?: 'json'
  },
): T {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    url = url.replace(/.*\?/, '')
  }
  if (url.startsWith('?')) {
    url = url.substring(1)
  }
  if (url.includes('%')) {
    url = decodeURIComponent(url)
  }
  const params = {} as Record<string, unknown>
  url.split('&').forEach(s => {
    let [key, value] = s.split('=')
    if (options?.parse === 'json') {
      try {
        key = JSON.parse(key)
      } catch (e) {
        // the key is not json
      }
      try {
        value = JSON.parse(value)
      } catch (e) {
        // the value is not json
      }
    }
    params[key] = value
  })
  return params as T
}

// IPv6 format reference: https://www.ietf.org/rfc/rfc2732.txt
export function isIP(
  /**
   * @example "http://192.168.1.109:8100/profile" -> true
   * @example "ipfs://192.168.1.109:8080" -> true
   * @example "192.168.1.109:8100" -> true
   * @example "192.168.1.109" -> true
   * @example "::192.168.1.109" -> true
   * @example "example.net" -> false
   */
  url: string,
): boolean {
  // e.g. "http://", "https://", "ftp://"
  let index = url.indexOf('://')
  if (index != -1) {
    url = url.substring(index + '://'.length)
  }

  // e.g. "example.net/about-us"
  index = url.indexOf('/')
  if (index != -1) {
    url = url.substring(0, index)
  }

  // e.g. "[2001:0000:130F:0000:0000:09C0:876A:130B]:8100"
  const match = url.match(/\[(.*?)\]/)
  if (match) {
    url = match[1]
  }

  // e.g. "::FFFF:129.144.52.38"
  if (url.toUpperCase().startsWith('::FFFF:')) {
    url = url.substring(7)
  }
  // e.g. "::127.0.0.1"
  else if (url.startsWith('::')) {
    url = url.substring(2)
  }

  // e.g. "127.0.0.1:8100"
  let parts = url.split(':')[0].split('.')
  if (
    parts.length == 4 &&
    Number.isInteger(+parts[0]) &&
    Number.isInteger(+parts[1]) &&
    Number.isInteger(+parts[2]) &&
    Number.isInteger(+parts[3])
  ) {
    return true
  }

  // e.g. "2001:0000:130F:0000:0000:09C0:876A:130B"
  // e.g. "1080::8:800:200C:417A"
  parts = url.split(':')
  if (parts.every(part => part == '' || isHex(part))) {
    return true
  }

  return false
}

function isHex(part: string): boolean {
  for (const char of part) {
    if ('0' <= char && char <= '9') continue
    if ('a' <= char && char <= 'f') continue
    if ('A' <= char && char <= 'F') continue
    return false
  }
  return true
}
