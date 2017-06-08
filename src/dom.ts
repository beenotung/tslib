import {mapI} from './lang';
/**
 * Created by beenotung on 5/26/17.
 */
export function nodeListToArray<A extends Element>(nodes: NodeListOf<A>): A[] {
  return mapI(i => nodes[i], nodes.length);
}

export function removeNode(node: Node) {
  if (!node) {
    return;
  }
  if (typeof node['remove'] === 'function') {
    return node['remove']();
  }
  return node.parentNode.removeChild(node);
}
