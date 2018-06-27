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
