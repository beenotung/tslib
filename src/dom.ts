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

/** @deprecated */
export function htmlCollectionToArray(es: HTMLCollection): Element[] {
  return Array.from(es);
}

/** @deprecated lost type hint */
export let qa = (x, parent = document.body) => parent.querySelectorAll(x);
/** @deprecated lost type hint */
export let q = (x, parent = document.body) => parent.querySelector(x);
