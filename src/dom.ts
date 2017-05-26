/**
 * Created by beenotung on 5/26/17.
 */
export function nodeListToArray<A extends Element>(nodes: NodeListOf<A>): A[] {
  const xs = [];
  (<any>nodes).forEach(x => xs.push(x));
  return xs;
}
