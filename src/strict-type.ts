import {notDefined, toNumber} from './lang';

export function ensureDefined<A> (a: A): A {
  if (notDefined(a)) {
    throw new TypeError('data is not defined');
  }
  return a;
}

/**
 * inclusively
 * */
export function ensureNumberInRange (a: number | string, lower: number, higher: number): number {
  const res = toNumber(a);
  if (lower <= res && res <= higher) {
    return res;
  }
  throw new TypeError(`number not in range, value: ${a}, lower: ${lower}, higher: ${higher}`);
}

export function ensureString<S extends string> (s: S): S {
  if (typeof s !== 'string') {
    throw new TypeError('expect string, but got ' + (typeof s));
  }
  return s;
}

export function ensureNumber<Num extends number> (x: Num): Num {
  if (typeof x !== 'number') {
    throw new TypeError('expect number, but got ' + (typeof x));
  }
  return x;
}
