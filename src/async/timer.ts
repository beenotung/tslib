/* tslint:disable no-empty */
function noop() {}
/* tslint:enable no-empty */

export function clearAllTimer() {
  let i = setInterval(noop)
  for (; i > 0; i--) {
    clearTimeout(i)
    clearInterval(i)
  }
}
