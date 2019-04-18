export function assertNever(x: never): any {
  console.error('assert never, but got:', x);
  throw new Error('assert never, but got: ' + x);
}

export type ApplyUndefinedType = any[] | Map<any, any> | object;

export function assertNoUndefined(
  o: ApplyUndefinedType,
  visited = new Set(),
): void {
  if (visited.has(o)) {
    return;
  }
  visited.add(o);
  if (Array.isArray(o)) {
    o.forEach(x => assertNoUndefined(x, visited));
    return;
  }
  if (o instanceof Map) {
    Array.from(o.values()).forEach(x => assertNoUndefined(x, visited));
    return;
  }
  if (typeof o === 'object') {
    Object.keys(o).forEach(x => assertNoUndefined(o[x], visited));
    return;
  }
  // e.g. number, string
  if (o === undefined) {
    throw new Error('AssertionError: undefined value');
  }
}
