export function isObject(o: any): boolean {
  return typeof o === "object";
}

export function deepClone<A>(o: A): A {
  if (!isObject(o)) {
    return o;
  }
  if (o instanceof Array) {
    return <A><any><any[]>o.map(deepClone);
  } else {
    const res = <A>{};
    Object.keys(o).forEach(x => res[x] = deepClone(o[x]));
    return res;
  }
}

export function replaceObject<A>(dest: A, src: A): A {
  Object.keys(dest).forEach(x => delete dest[x]);
  return Object.assign(dest, src);
}
