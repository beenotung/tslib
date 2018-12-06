export function calcPhi() {
  let phi = 1;
  for (;;) {
    const x = 1 + 1 / phi;
    if (phi === x) {
      return x;
    }
    phi = x;
  }
}

let phi: number;
export let math: { phi: number } = {
  get phi(): number {
    return phi || (phi = calcPhi());
  },
  set phi(never: number) {
    throw new Error('unexpected assignment');
  },
};

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  if (b > a) {
    const t = a;
    a = b;
    b = t;
  }
  for (;;) {
    if (b === 0) {
      return a;
    }
    a %= b;
    if (a === 0) {
      return b;
    }
    b %= a;
  }
}

export function lcm(a: number, b: number): number {
  return !a || !b ? 0 : Math.abs(a * b) / gcd(a, b);
}
