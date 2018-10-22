export function toggleSet<A> (s: Set<A>, a: A) {
  if (s.has(a)) {
    s.delete(a);
  } else {
    s.add(a);
  }
}

export function setToArray<A> (s: Set<A>): A[] {
  return Array.from(s.values());
}

export function setMinus<A> (a: Set<A>, b: Set<A>): Set<A> {
  const res = new Set<A>();
  a.forEach(x => {
    if (!b.has(x)) {
      res.add(x);
    }
  });
  return res;
}
