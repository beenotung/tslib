export function removeNode(node: Node) {
  if (!node) {
    return;
  }
  if (typeof node["remove"] === "function") {
    return node["remove"]();
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

export function setFullscreen(element = document.body) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else {
    console.warn("full screen is not supported");
  }
}

export function exitFullscreen() {
  if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  } else {
    console.warn("full screen is not supported");
  }
}

export function htmlCollectionToArray(es: HTMLCollection): HTMLElement[] {
  const n = es.length;
  const res = new Array(n);
  for (let i = 0; i < n; i++) {
    res[i] = es.item(i);
  }
  return res;
}
