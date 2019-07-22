export function toggleSet<A>(s: Set<A>, a: A) {
  if (s.has(a)) {
    s.delete(a);
  } else {
    s.add(a);
  }
}

/**
 * @deprecated use Array.from(set) instead
 * */
export function setToArray<A>(s: Set<A>): A[] {
  return Array.from(s.values());
}

export function setMinus<A>(a: Set<A>, b: Set<A>): Set<A> {
  const res = new Set<A>();
  a.forEach(x => {
    if (!b.has(x)) {
      res.add(x);
    }
  });
  return res;
}

export function setAdd<A>(a: Set<A>, b: Set<A>): Set<A> {
  const res = new Set<A>(a);
  b.forEach(x => res.add(x));
  return res;
}

export function setMinusInplace<A>(to: Set<A>, from: Set<A>): void {
  from.forEach(x => to.delete(x));
}

export function setAddInplace<A>(to: Set<A>, from: Set<A>): void {
  from.forEach(x => to.add(x));
}
