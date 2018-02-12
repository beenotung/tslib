export function mapMap<K, V, A>(map: Map<K, V>, mapper: (v: V, k: K) => A) {
  const res = new Map<A, V[]>();
  map.forEach((v, k) => {
    const a = mapper(v, k);
    const vs = res.get(a);
    if (vs) {
      vs.push(v);
    } else {
      res.set(a, [v]);
    }
  });
  return res;
}
