import { Enum, enum_keys } from './enum'
import { str_minus } from './string'

/**
 * @param start {number} inclusive
 * @param end {number} exclusive
 * */
export function genStringRange(start: number, end: number): string {
  let s = ''
  for (let i = start; i < end; i++) {
    s += String.fromCharCode(i)
  }
  return s
}

/** @description from '0' to '9' */
export const digits = genStringRange(48, 48 + 10)
/** @description from 'A' to 'Z' */
export const upperCaseLetters = genStringRange(65, 65 + 26)
/** @description from 'a' to 'z' */
export const lowerCaseLetters = genStringRange(65 + 32, 65 + 32 + 26)
/** @description visible characters only in ascii range */
export const visibleLetters = genStringRange(32, 127)
/** @description base58btc format, removed '0OIl' and '+/' */
export const base58Letters =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
export const symbolLetters = str_minus(
  visibleLetters,
  digits + upperCaseLetters + lowerCaseLetters,
)
/** @description upperCaseLetters + lowerCaseLetters + digits */
export const alphabetNumLetters = upperCaseLetters + lowerCaseLetters + digits

export namespace Random {
  /**
   * @param {number} upper defaults to Number.MAX_SAFE_INTEGER
   * @param {number} lower defaults to 0
   * @returns {number} integer, lower <= value < upper
   */
  export function nextInt(
    upper: number = Number.MAX_SAFE_INTEGER,
    lower = 0,
  ): number {
    return Math.floor(Math.random() * (upper - lower) + lower)
  }

  /**
   * @param {number} upper defaults to Number.MAX_VALUE
   * @param {number} lower defaults to 0
   * @param {number} decimal defaults to 2
   * @returns {number} integer or float, lower <= value < upper
   */
  export function nextFloat(
    upper: number = Number.MAX_VALUE,
    lower = 0,
    decimal = 2,
  ): number {
    const range = upper - lower
    const value_random = Math.random() * range + lower
    const value_int = Math.floor(value_random)
    if (value_random == value_int) {
      return value_random
    }
    const value_decimal = value_random - value_int
    const value_decimal_str = value_decimal.toString().slice(2, 2 + decimal)
    return +(value_int + '.' + value_decimal_str)
  }

  /**
   * @param {number} prob defaults to 0.5
   * @returns {boolean} boolean with prob chance being true
   */
  export function nextBool(prob = 0.5): boolean {
    return Math.random() < prob
  }

  export function probablyRun<T>(prop: number, run: () => T): T | undefined {
    if (nextBool(prop)) {
      return run()
    }
  }

  /** @returns real number : -1 .. 1 */
  export function nextNP1() {
    return Math.random() * 2 - 1
  }

  /**
   * @description random pick one element from array or string
   * @throws Error if given empty array or empty string
   * */
  export function element<A>(xs: A[]): A
  export function element(s: string): string
  export function element<A>(xs: string | A[]): A | string {
    if (xs.length == 0) {
      throw new Error(
        typeof xs == 'string'
          ? 'cannot random pick from empty string'
          : 'cannot random pick from empty array',
      )
    }
    const idx = Math.floor(Math.random() * xs.length)
    return xs[idx]
  }

  export function nextDate(
    after = new Date('2016-12-12'),
    before = new Date('2018-12-12'),
  ): Date {
    const diff = before.getTime() - after.getTime()
    const time = Random.nextInt(after.getTime() + diff, after.getTime())
    return new Date(time)
  }

  /**
   * @return value of enum (not key of enum)
   * */
  export function nextEnum<E>(e: Enum<E>): E {
    const key = Random.element(enum_keys<E>(e))
    return (e as any)[key as any] as any
  }

  export function nextEnumKey<E>(e: Enum<E>): string & keyof E {
    return Random.element(enum_keys(e))
  }

  export function nextBuffer(n: number) {
    const res = Buffer.alloc(n)
    for (let i = 0; i < n; i++) {
      res[i] = (Math.random() * 256) >>> 0
    }
    return res
  }

  /**
   * @param {number} n length of string to be generated
   * @param {string} pool candidate characters, defaults to visibleLetters
   * @returns string random generated characters, possible to have repeating characters
   */
  export function nextString(n: number, pool = visibleLetters) {
    let s = ''
    for (; s.length < n; ) {
      s += element(pool)
    }
    return s
  }
}
