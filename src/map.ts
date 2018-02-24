export function mapMap<K, V, A>(map: Map<K, V>, mapper: (v: V, k: K) => A) {
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

export function reduceMap<K, V, A>(map: Map<K, V>, mapper: (acc: A, v: V, k: K) => A, initial: A): A {
  let acc = initial;
  map.forEach((value, key) => {
    acc = mapper(acc, value, key);
  });
  return acc;
}
