export function toggleSet<A>(s: Set<A>, a: A) {
  if (s.has(a)) {
    s.delete(a);
  } else {
    s.add(a);
  }
}
