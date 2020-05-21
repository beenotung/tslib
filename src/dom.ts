export function removeNode(node: Node & { remove?: () => void }) {
  if (!node) {
    return
  }
  if (typeof node.remove === 'function') {
    return node.remove()
  }
  if (node.parentNode) {
    return node.parentNode.removeChild(node)
  }
}

/**
 * auto remove, then append to {parent}
 * */
export function appendNode(node: Node, parent: Node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node)
  }
  parent.appendChild(node)
}

export function setFullscreen(element = document.body) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if ((element as any).webkitRequestFullscreen) {
    ; (element as any).webkitRequestFullscreen()
  } else {
    console.warn('full screen is not supported')
  }
}

export function exitFullscreen() {
  if ((document as any).webkitExitFullscreen) {
    ; (document as any).webkitExitFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
  } else {
    console.warn('full screen is not supported')
  }
}

/** @deprecated */
export function htmlCollectionToArray(es: HTMLCollection): Element[] {
  return Array.from(es)
}

/** @deprecated lost type hint */
export let qa = (x: string, parent = document.body) =>
  parent.querySelectorAll(x)
/** @deprecated lost type hint */
export let q = (x: string, parent = document.body) => parent.querySelector(x)

export function csv_to_table_element(rows: string[][]): HTMLTableElement {
  /* initialize */
  const table = document.createElement('table')
  const thead = document.createElement('thead')
  const tbody = document.createElement('tbody')

  /* create table head */
  const tr = document.createElement('tr')
  rows[0].forEach(row => {
    const td = document.createElement('th')
    td.textContent = row
    tr.appendChild(td)
  })
  thead.appendChild(tr)

  /* create table body */
  for (let i = 1; i < rows.length; i++) {
    const tr = document.createElement('tr')
    rows[i].forEach(col => {
      const td = document.createElement('td')
      td.textContent = col
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  }

  /* finalize */
  table.appendChild(thead)
  table.appendChild(tbody)
  return table
}

export function copyToClipboard(text: string): void {
  const input = document.createElement('input')
  document.body.append(input)
  input.value = text
  input.select()
  document.execCommand('copy')
  input.remove()
}
