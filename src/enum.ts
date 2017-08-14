import {range} from "./array";
import {isDefined, isNumber} from "./lang";

export type Enum = { [index: number]: string } & { [key: string]: number } | Object;

/**
 * for the sake of implicit any in object index
 * */
export function enum_i2s<E extends Enum>(e: E, i: number): keyof E {
  const res = e[i];
  if (res === void 0) {
    throw new TypeError(`Invalid index '${i}' in enum`);
  }
  return res;
}

export function enum_s2i<E extends Enum>(e: E, s: keyof E): number {
  const res = e[s];
  if (res === void 0) {
    throw new TypeError(`Invalid key '${s}' in enum`);
  }
  return res;
}

export function enum_next_i<E extends Enum>(e: E, i: number): number {
  const res = e[e[i + 1]];
  if (res === void 0) {
    throw new TypeError(`Enum of index '${i}' don't have next value`);
  }
  return res;
}

export function enum_next_s<E extends Enum>(e: E, s: string): keyof E {
  const res = e[e[s] + 1];
  if (res === void 0) {
    throw new TypeError(`Enum of key '${s}' don't have next value`);
  }
  return res;
}

export function enum_keys<E extends Enum>(e: E): string[] {
  return Object.keys(e).filter(x => !isNumber(x));
}

export function enum_values<E extends Enum>(e: E): number[] {
  return range(0, enum_last_i(e));
}

export function enum_last_i<E extends Enum>(e: E): number {
  return enum_keys(e).length - 1;
}

export function enum_last_s<E extends Enum>(e: E): string {
  return e[enum_last_i(e)];
}

export function enum_is_last_i<E extends Enum>(e: E, i: number): boolean {
  return i === enum_last_i(e);
}

export function enum_is_last_s<E extends Enum>(e: E, s: string): boolean {
  return s === enum_last_s(e);
}

export function enum_is_last<E extends Enum>(e: E, v: keyof E): boolean {
  if (typeof v === "number") {
    return enum_is_last_i(e, <any>v);
  } else {
    return enum_is_last_s(e, v);
  }
}

export function enum_is_in_range<E extends Enum>(e: E, v: any): boolean {
  return isDefined(e[v]);
}

export function enum_not_equals<E1 extends Enum, E2 extends Enum>(e1: E1, e2: E2): boolean {
  return <Enum>e1 !== <Enum>e2;
}

/**
 * inplace update
 *
 * @return original (modified) enum
 * */
export function enum_set_string<E extends Enum>(e: E): E {
  Object.keys(e)
    .filter(x => !isNumber(x))
    .forEach(x => e[x] = e[e[x]]);
  return e;
}

/**
 * inplace update
 * */
export function enum_only_string<E extends Enum>(e: E) {
  Object.keys(e)
    .filter(isNumber)
    .forEach(i => {
      const s = e[i];
      e[s] = s;
      delete e[i];
    });
}
