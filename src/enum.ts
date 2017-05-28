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
