export function removeNode(node: Node) {
  if (!node) {
    return;
  }
  if (typeof node['remove'] === 'function') {
    return node['remove']();
  }
  return node.parentNode.removeChild(node);
}

/**
 * auto remove, then append to {parent}
 * */
export function appendNode(node: Node, parent: Node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
  parent.appendChild(node);
}
