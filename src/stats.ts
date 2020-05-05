export function createAlphaSmoother(alpha: number) {
  const beta = 1 - alpha
  let acc: number

  const res = {
    next: init,
  }

  function init(c: number) {
    acc = c
    res.next = next
    return c
  }

  function next(c: number) {
    acc = acc! * alpha + c * beta
    return acc
  }

  return res
}
