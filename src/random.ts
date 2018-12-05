import { enum_keys } from './enum';
import { str_minus } from './string';

/**
 * @param start {number} inclusive
 * @param end {number} exclusive
 * */
export function genStringRange(start: number, end: number): string {
  let s = '';
  for (let i = start; i < end; i++) {
    s += String.fromCharCode(i);
  }
  return s;
}

export const digits = genStringRange(48, 48 + 10);
export const upperCaseLetters = genStringRange(65, 65 + 26);
export const lowerCaseLetters = genStringRange(65 + 32, 65 + 32 + 26);
/** visible characters only in ascii range */
export const visibleLetters = genStringRange(32, 127);
/** base58btc format, removed '0OIl' and '+/' */
export const base58Letters =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
export const symbolLetters = str_minus(
  visibleLetters,
  digits + upperCaseLetters + lowerCaseLetters,
);
export const alphabetNumLetters = upperCaseLetters + lowerCaseLetters + digits;

export namespace Random {
  /** @return number : lower <= value < upper */
  export function nextInt(
    upper: number = Number.MAX_SAFE_INTEGER,
    lower = 0,
  ): number {
    return Math.floor(Math.random() * (upper - lower) + lower);
  }

  export function nextBool(prob = 0.5): boolean {
    return Math.random() < prob;
  }

  /** @return real number : -1 .. 1 */
  export function nextNP1() {
    return Math.random() * 2 - 1;
  }

  export function element<A>(xs: A[]): A;
  export function element<A>(s: string): string;

  /**
   * Nullable
   * */
  export function element<A>(xs: string | A[]): A | string {
    return xs[nextInt(xs.length, 0)];
  }

  export function nextDate(
    after = new Date('2016-12-12'),
    before = new Date('2018-12-12'),
  ): Date {
    const diff = before.getTime() - after.getTime();
    const time = Random.nextInt(after.getTime() + diff, after.getTime());
    return new Date(time);
  }

  /**
   * @return value of enum (not key of enum)
   * */
  export function nextEnum<E>(e: E): E[keyof E] {
    return e[Random.element(enum_keys(e)) as any];
  }

  export function nextBuffer(n: number) {
    // tslint:disable:no-bitwise
    const res = new Buffer(n);
    for (let i = 0; i < n; i++) {
      res[i] = (Math.random() * 256) >>> 0;
    }
    return res;
    // tslint:enable:no-bitwise
  }

  export function nextString(n: number, pool = visibleLetters) {
    let s = '';
    for (; s.length < n;) {
      s += element(pool);
    }
    return s;
  }
}
