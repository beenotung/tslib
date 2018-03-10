export function collectMap<K, V, A>(map: Map<K, V>, mapper: (v: V, k: K) => A): Map<A, V[]> {
  const res = new Map<A, V[]>();
  map.forEach((value, key) => {
    const a = mapper(value, key);
    const vs = res.get(a);
    if (vs) {
      vs.push(value);
    } else {
      res.set(a, [value]);
    }
  });
  return res;
}

/**@deprecated renamed to collectMap */
export const mapMap = collectMap;

export function reduceMap<K, V, A>(map: Map<K, V>, mapper: (acc: A, v: V, k: K) => A, initial: A): A {
  let acc = initial;
  map.forEach((value, key) => {
    acc = mapper(acc, value, key);
  });
  return acc;
}

export function mapFetOrSetDefault<K, V>(map: Map<K, V>, key: K, f: () => V): V {
  if (map.has(key)) {
    return map.get(key);
  }
  const res = f();
  map.set(key, res);
  return res;
}
