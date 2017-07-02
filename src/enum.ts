import {range} from "./array";
import {isDefined} from "./lang";

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
  return Object.keys(e).filter(x => typeof x !== 'number');
}

export function enum_values<E extends Enum>(e: E): number[] {
  return range(0, Object.keys(e).length / 2 - 1);
}

export function enum_last_i<E extends Enum>(e: E): number {
  return Object.keys(e).length / 2 - 1;
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
  if (typeof v === 'number') {
    return enum_is_last_i(e, <any>v);
  } else {
    return enum_is_last_s(e, v);
  }
}

export function enum_is_in_range<E extends Enum>(e: E, v: any): boolean {
  return isDefined(e[v]);
}
