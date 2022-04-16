export function collectMap<K, V, A>(
  map: Map<K, V>,
  mapper: (v: V, k: K) => A,
): Map<A, V[]> {
  const res = new Map<A, V[]>()
  map.forEach((value, key) => {
    const a = mapper(value, key)
    const vs = res.get(a)
    if (vs) {
      vs.push(value)
    } else {
      res.set(a, [value])
    }
  })
  return res
}

export function mapToArray<K, V, A>(
  map: Map<K, V>,
  f: (v: V, k: K, map: Map<K, V>) => A,
): A[] {
  const res: A[] = []
  map.forEach((v, k, m) => res.push(f(v, k, m)))
  return res
}

export function reduceMap<K, V, A>(
  map: Map<K, V>,
  mapper: (acc: A, v: V, k: K) => A,
  initial: A,
): A {
  let acc = initial
  map.forEach((value, key) => {
    acc = mapper(acc, value, key)
  })
  return acc
}

export function mapGetOrThrow<K, V>(
  map: Map<K, V>,
  key: K,
  message: Error | string = key + ' not found',
): V {
  if (map.has(key)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return map.get(key)!
  }
  if (typeof message === 'string') {
    throw new Error(message)
  } else {
    throw message
  }
}

export function mapGetOrSetDefault<K, V>(
  map: Map<K, V>,
  key: K,
  f: () => V,
): V {
  if (map.has(key)) {
    return map.get(key) as V
  }
  const res = f()
  map.set(key, res)
  return res
}

export function mapGetMap<K, V extends Map<any, any>>(
  map: Map<K, V>,
  key: K,
): V {
  return mapGetOrSetDefault<K, V>(map, key, () => new Map() as V)
}

export function mapGetSet<K, V extends Set<any>>(map: Map<K, V>, key: K): V {
  return mapGetOrSetDefault(map, key, () => new Set() as V)
}

export function mapGetArray<K, V extends any[]>(map: Map<K, V>, key: K): V {
  return mapGetOrSetDefault(map, key, () => [] as any[] as V)
}

export function incMap<K>(map: Map<K, number>, key: K): void {
  if (map.has(key)) {
    map.set(key, (map.get(key) as number) + 1)
  } else {
    map.set(key, 1)
  }
}
