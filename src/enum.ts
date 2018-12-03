import { range } from './array';
import { isDefined, isNumber } from './lang';
import { ensureNumber, ensureString } from './strict-type';

/* tslint:disable:ban-types */
/**@deprecated*/
export type Enum =
  | { [index: number]: string } & { [key: string]: number }
  | Object;

/* tslint:enable:ban-types */

/**
 * for the sake of implicit any in object index
 * */
export function enum_i2s<E>(e: E, i: keyof E): E[keyof E] {
  const res = e[i];
  if (res === void 0) {
    throw new TypeError(`Invalid index '${i}' in enum`);
  }
  return ensureString(res as any);
}

export function enum_s2i<E>(e: E, s: E[keyof E]): keyof E {
  const res = e[s as any];
  if (res === void 0) {
    throw new TypeError(`Invalid key '${s}' in enum`);
  }
  return ensureNumber(res as any);
}

export function enum_next_i<E>(e: E, i: number & keyof E): keyof E {
  const res = e[e[i + 1]];
  if (res === void 0) {
    throw new TypeError(`Enum of index '${i}' don't have next value`);
  }
  return res;
}

export function enum_next_s<E>(e: E, s: E[keyof E]): E[keyof E] {
  const res = e[e[s as any] + 1];
  if (res === void 0) {
    throw new TypeError(`Enum of key '${s}' don't have next value`);
  }
  return res;
}

export function enum_keys<E>(e: E): Array<E[keyof E]> {
  return (Object.keys(e).filter(x => !isNumber(x)) as string[]) as any[];
}

/**
 * numeric values
 * */
export function enum_indices<E>(e: E): Array<keyof E> {
  return range(0, enum_last_i(e) as any) as any;
}

/**
 * numeric or string values
 * if    original enum -> numeric values;
 *    stringified enum -> string values
 * */
export function enum_values<E>(e: E): Array<keyof E> {
  return enum_keys(e).map(s => e[s as any]) as any[];
}

export function enum_last_i<E>(e: E): keyof E {
  return (enum_keys(e).length - 1) as any;
}

export function enum_last_s<E>(e: E): E[keyof E] {
  return e[enum_last_i(e)];
}

export function enum_is_last_i<E>(e: E, i: keyof E): boolean {
  return i === enum_last_i(e);
}

export function enum_is_last_s<E>(e: E, s: E[keyof E]): boolean {
  return s === enum_last_s(e);
}

export function enum_is_last<E>(e: E, v: E[keyof E] | keyof E): boolean {
  if (typeof v === 'number') {
    return enum_is_last_i(e, v as keyof E);
  } else {
    return enum_is_last_s(e, v as E[keyof E]);
  }
}

export function enum_is_in_range<E>(e: E, v: E[keyof E] | keyof E): boolean {
  return isDefined(e[v as any]);
}

export function enum_not_equals<E1, E2>(e1: E1, e2: E2): boolean {
  return (e1 as any) !== e2;
}

/**
 * inplace update
 *
 * @return original (modified) enum
 * */
export function enum_set_string<E>(e: E): E {
  Object.keys(e)
    .filter(x => !isNumber(x))
    .forEach(x => (e[x] = e[e[x]]));
  return e;
}

/**
 * inplace update
 * */
export function enum_only_string<E>(e: E) {
  Object.keys(e)
    .filter(isNumber)
    .forEach(i => {
      const s = e[i];
      e[s] = s;
      delete e[i];
    });
  return e;
}
