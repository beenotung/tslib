// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

export function clearAllTimer() {
  let i = setInterval(noop)
  if (typeof i !== 'number') {
    throw new Error('clearAllTimer does not support node.js')
  }
  for (; i > 0; i--) {
    clearTimeout(i)
    clearInterval(i)
  }
}
