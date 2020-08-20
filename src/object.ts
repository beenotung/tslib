import { replaceArray } from './array'
import { ApplyUndefinedType } from './assert'
import { map_any, map_set } from './iterative/map'
import { getObjectType } from './type'

export function isObject(o: any): boolean {
  return typeof o === 'object'
}

export function hasFunction(o: object | any[], name: PropertyKey): boolean {
  return typeof (o as any)[name] === 'function'
}

export function deepClone<A>(o: A): A {
  if (!isObject(o)) {
    return o
  }
  if (o instanceof Array) {
    return ((o.map(deepClone) as any[]) as any) as A
  } else {
    const res = {} as A
    Object.keys(o).forEach(x => ((res as any)[x] = deepClone((o as any)[x])))
    return res
  }
}

export function deepEqual(a: any, b: any): boolean {
  if (a === b) {
    return true
  }
  const aType = getObjectType(a)
  const bType = getObjectType(b)
  if (aType !== bType) {
    return false
  }
  switch (aType) {
    case 'AsyncFunction':
    case 'Function':
      return a.toString() === b.toString()
    case 'Array':
      if (a.length !== b.length) {
        return false
      }
      return (a as any[]).every((_, i) => deepEqual(a[i], b[i]))
    case 'Uint8Array':
      if (a.length !== b.length) {
        return false
      }
      return (a as Uint8Array).every((_, i) => deepEqual(a[i], b[i]))
    case 'Boolean':
    case 'Number':
    case 'String':
      return a === b
    case 'Null':
    case 'Undefined':
      return true
    case 'Map':
      const aMap = a as Map<any, any>
      const bMap = b as Map<any, any>
      for (const key of aMap.keys()) {
        if (!bMap.has(key)) {
          return false
        }
        if (!deepEqual(aMap.get(key), bMap.get(key))) {
          return false
        }
      }
      return true
    case 'Set':
      const aSet = a as Set<any>
      const bSet = b as Set<any>
      if (aSet.size !== bSet.size) {
        return false
      }
      for (const value of aSet.values()) {
        if (!bSet.has(value)) {
          return false
        }
      }
      return true
    case 'Date':
      return (a as Date).getTime() === (b as Date).getTime()
    case 'Object':
      const aKeys = Object.keys(a)
      const bKeys = Object.keys(b)
      if (aKeys.length !== bKeys.length) {
        return false
      }
      return aKeys.every(key => deepEqual(a[key], b[key]))
    default:
      throw Error('unsupported data type')
  }
}

export function replaceObject<A>(dest: A, src: A): A {
  Object.keys(dest).forEach(x => delete (dest as any)[x])
  return Object.assign(dest, src)
}

const SafeObject = Symbol.for('SafeObject')
export const SafeObjectOptions = {
  throwError: false,
}
const safeProxyHandler: ProxyHandler<any> = {
  get: (target, p, receiver) => {
    let value = Reflect.get(target, p, receiver)
    if (typeof p === 'symbol' || p === 'inspect') {
      return value
    }
    if (SafeObjectOptions.throwError && !Reflect.has(target, p)) {
      throw new TypeError(
        JSON.stringify(p) + ' is not defined in ' + target.toString(),
      )
    }
    if (value === null || value === undefined) {
      value = createSafeObject()
      target[p] = value
      return value
    }
    if (typeof value === 'object') {
      if (value[SafeObject] === true) {
        return value
      }
      value = createSafeObject(value)
      target[p] = value
      return value
    } else {
      return value
    }
  },
}

/**
 * make a loss object, very forgiving
 * */
export function createSafeObject(target: object = {}) {
  ; (target as any)[SafeObject] = true
  return new Proxy(target, safeProxyHandler)
}

export const updateObject = <T, U>(dest: T) => (x: U): T & U =>
  Object.assign(dest, x)

export const isNull = (x: any): boolean =>
  !(x === null || x === undefined || x === '')

export function removeNull<A>(o: A): A {
  if (Array.isArray(o)) {
    return o
      .filter(x => !(x === null || x === undefined || x === ''))
      .map(x => removeNull(x)) as any
  }
  if (o instanceof Set) {
    return new Set(removeNull(Array.from(o))) as any
  }
  if (o instanceof Date) {
    return o
  }
  if (typeof o === 'object' && o !== null) {
    o = Object.assign({}, o)
    for (const k of Object.keys(o)) {
      const v = (o as any)[k]
      if (v === null || v === undefined || v === '') {
        delete (o as any)[k]
      }
    }
  }
  return o
}

/**
 * @param {any}       o           : value to be checked
 * @param {boolean}   skip        : true will remove duplicated value silently;
 *                                  false will throw an error upon duplication
 * @param {any}       placeholder : custom value to replace duplicated object
 * @param {function}  mapper      : optional map function
 * @param {Set}       visited     : internal book keeping seen objects
 * */
export function ensureNonCyclic<A>(
  o: A,
  skip = true,
  placeholder: any = void 0,
  mapper?: (a: any) => any,
  visited = new Set(),
): A {
  switch (getObjectType(o)) {
    case 'Number':
    case 'String':
    case 'Null':
    case 'Undefined':
    case 'Function':
    case 'AsyncFunction':
      /* these types can be duplicated */
      return mapper ? mapper(o) : o
    default:
      /* array, set, map, object */
      if (visited.has(o)) {
        /* duplicated object */
        if (skip) {
          return placeholder
        }
        throw new Error('circular structure, duplicated value: ' + o)
      }
      /* non-duplicated object */
      /* clone the set, to allow sibling duplication */
      visited = map_set(visited, x => x)
      visited.add(o)
      return map_any(o, x =>
        ensureNonCyclic(x, skip, placeholder, mapper, visited),
      )
  }
}

export function deleteUndefined(o: ApplyUndefinedType): void {
  if (Array.isArray(o)) {
    replaceArray(
      o,
      o.filter(x => x !== undefined),
    )
    o.forEach(x => deleteUndefined(x))
    return
  }
  if (o instanceof Map) {
    o.forEach((value, key) => {
      if (value === undefined) {
        o.delete(key)
      }
      deleteUndefined(value)
    })
    return
  }
  if (typeof o === 'object') {
    for (const s of Object.keys(o)) {
      if ((o as any)[s] === undefined) {
        delete (o as any)[s]
        continue
      }
      deleteUndefined((o as any)[s])
    }
    return
  }
  // e.g. number, string
  return
}

/**
 * to encode json data in csv-style
 * i.e. only need to store the keys once for a large collection (e.g. Array / Set)
 * */
export function objectToValues<T>(
  o: T,
  keys: Array<keyof T> = Object.keys(o).sort() as any[],
): Array<T[keyof T]> {
  return keys.map(key => o[key])
}

/**
 * to decode json data from csv-style
 * i.e. populate values and keys to a collection (e.g. Array / Set)
 * */
export function valuesToObject<T>(
  values: Array<T[keyof T]>,
  keys: Array<keyof T>,
): T {
  const res: any = {}
  if (values.length !== keys.length) {
    console.error('length of values and keys mismatch:', {
      keys: keys.length,
      values: values.length,
    })
    throw new Error('invalid values')
  }
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = values[i]
    res[key] = value
  }
  return res
}

export function objectGetOrSetDefault<V = any, K extends PropertyKey = string>(
  object: Record<K, V>,
  key: K,
  f: () => V,
): V {
  if (key in object) {
    return object[key]
  }
  const res = f()
  object[key] = res
  return res
}

export function objectPick<T, K extends keyof T = keyof T>(
  object: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    result[key] = object[key]
  }
  return result
}
