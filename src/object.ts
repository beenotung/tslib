export function isObject(o: any): boolean {
  return typeof o === 'object';
}
export function deepClone<A>(o: A): A {
  if (!isObject(o)) {
    return o;
  }
  const res = <A>{};
  Object.keys(o).forEach(x => res[x] = deepClone(o[x]));
  return res;
}
