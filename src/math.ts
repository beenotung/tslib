export function calcPhi() {
  let phi = 1
  for (;;) {
    const x = 1 + 1 / phi
    if (phi === x) {
      return x
    }
    phi = x
  }
}

let phi: number
export let math: { phi: number } = {
  get phi(): number {
    return phi || (phi = calcPhi())
  },
  set phi(never: number) {
    throw new Error('unexpected assignment')
  },
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  if (b > a) {
    const t = a
    a = b
    b = t
  }
  for (;;) {
    if (b === 0) {
      return a
    }
    a %= b
    if (a === 0) {
      return b
    }
    b %= a
  }
}

export function lcm(a: number, b: number): number {
  return !a || !b ? 0 : Math.abs(a * b) / gcd(a, b)
}

/**
 * input: x
 * output: [a, b], where x = a/b
 * */
export function numberToFraction(x: number, error = 1e-12): [number, number] {
  if (x === Math.round(x)) {
    return [x, 1]
  }
  if (x < 0) {
    const [a, b] = numberToFraction(-x, error)
    return [-a, b]
  }
  let a = 1
  let b = 1
  for (;;) {
    const y = a / b
    // process.stdout.write(`\r diff=${y - x}, x=${x}, ${a}/${b}`);
    if (x === y || Math.abs(y - x) < error) {
      return [a, b]
    }
    if (y > x) {
      b++
    } else {
      a++
    }
  }
}

export function reduceFraction([a, b]: [number, number]): [number, number] {
  const c = gcd(a, b)
  a /= c
  b /= c
  return b < 0 ? [-a, -b] : [a, b]
}
