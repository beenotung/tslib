/**
 * inplace delete all element from the array
 * @return old elements
 * */
export function clear<A>(xs: A[]): A[] {
  return xs.splice(0, xs.length);
}
