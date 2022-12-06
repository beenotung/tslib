import { ensureNumber, ensureString } from './strict-type'

/* tslint:disable:ban-types */
export type Enum<E> =
  | ({ [value: number]: keyof E } & { [key: string]: E })
  | Object

/* tslint:enable:ban-types */

function is_enum_key(x: any) {
  /* tslint:disable */
  return x != +x
  /* tslint:enable */
}

/**
 * for the sake of implicit any in object index
 * */
export function enum_i2s<E>(e: E, i: keyof E): E[keyof E] {
  const res = e[i]
  if (res === void 0) {
    throw new TypeError(`Invalid index '${String(i)}' in enum`)
  }
  return ensureString(res as any)
}

export function enum_s2i<E>(e: E, s: E[keyof E]): keyof E {
  const res = (e as any)[s as any]
  if (res === void 0) {
    throw new TypeError(`Invalid key '${s}' in enum`)
  }
  return ensureNumber(res as any)
}

export function enum_next_i<E>(e: E, i: number & keyof E): keyof E {
  const res = (e as any)[(e as any)[i + 1]]
  if (res === void 0) {
    throw new TypeError(`Enum of index '${i}' don't have next value`)
  }
  return res
}

export function enum_next_s<E>(e: E, s: E[keyof E]): E[keyof E] {
  const res = (e as any)[(e as any)[s as any] + 1]
  if (res === void 0) {
    throw new TypeError(`Enum of key '${s}' don't have next value`)
  }
  return res
}

export function enum_keys<E>(e: Enum<E>): Array<string & keyof E> {
  return Object.keys(e).filter(is_enum_key) as any[]
}

/**
 * numeric values
 * */
export function enum_indices<E>(e: Enum<E>): Array<keyof E> {
  const n = enum_last_i(e) + 1
  const res = new Array(n)
  for (let i = 0; i < n; i++) {
    res[i] = i
  }
  return res
}

/**
 * numeric or string values
 * if    original enum -> numeric values;
 *    stringified enum -> string values
 * */
export function enum_values<E>(e: Enum<E>): E[] {
  return enum_keys(e).map(s => (e as any)[s as any]) as any[]
}

export function enum_last_i<E>(e: Enum<E>): E & number {
  return (e as any)[enum_last_s(e) as string]
}

export function enum_last_s<E>(e: Enum<E>): keyof E & string {
  const ks = Object.keys(e)
  return ks[ks.length - 1] as any
}

export function enum_is_last_i<E>(e: Enum<E>, i: E): boolean {
  return i === enum_last_i(e)
}

export function enum_is_last_s<E>(e: Enum<E>, s: keyof E): boolean {
  return s === enum_last_s(e)
}

export function enum_is_last<E>(
  e: Enum<E>,
  v: E | number | keyof E | string,
): boolean {
  if (typeof v === 'number') {
    return enum_is_last_i(e, v as any)
  } else {
    return enum_is_last_s(e, v as keyof E)
  }
}

export function enum_is_in_range<E>(e: E, v: E[keyof E] | keyof E): boolean {
  return (v as any) in e
}

export function enum_not_equals<E1, E2>(e1: E1, e2: E2): boolean {
  return (e1 as any) !== e2
}

/**
 * inplace update
 *
 * @return original (modified) enum
 * */
export function enum_set_string<E extends object>(e: E): E {
  Object.keys(e)
    .filter(is_enum_key)
    .forEach(s => ((e as any)[s] = (e as any)[(e as any)[s]]))
  return e
}

/**
 * inplace update
 * */
export function enum_only_string<E extends object>(e: E) {
  Object.keys(e).forEach(i => {
    /* tslint:disable */
    if ((i as any) == +i) {
      /* tslint:enable */
      const s = (e as any)[i]
      ;(e as any)[s] = s
      delete (e as any)[i]
    }
  })
  return e
}
