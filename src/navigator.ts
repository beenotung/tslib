export type json = object | string | number | boolean | null

/**
 * 1. resolve nested object as undefined
 *
 * 2. remove undefined fields
 *
 * 3. remove non-serializable fields (function, prototype)
 *
 * */
export function toJson(o: any, visited: Set<any>): json {
  if (o === null) {
    return null
  }
  if (typeof o === 'object') {
    if (visited.has(o)) {
      return undefined as any
    } else {
      visited.add(o)
    }
  }
  const res: any = {}
  switch (typeof o) {
    case 'string':
    case 'number':
    case 'boolean':
      return o
  }
  // eslint-disable-next-line guard-for-in
  for (const k in o) {
    const type = typeof o[k]
    switch (type) {
      case 'string':
      case 'number':
      case 'boolean':
        res[k] = o[k]
        break
      case 'function':
        break
      case 'undefined':
        break
      case 'object': {
        const v = o[k]
        if (Array.isArray(v)) {
          res[k] = v.map(o => toJson(o, visited))
        } else {
          const x = toJson(v, visited)
          if (x === null || (x !== undefined && Object.keys(x).length > 0)) {
            res[k] = x
          }
        }
        break
      }
      default:
        console.debug('unknown type of property:', { type, k, v: o[k] })
    }
  }
  return res
}

export function mkNavigator(): json {
  return toJson(window.navigator, new Set<any>())
}
