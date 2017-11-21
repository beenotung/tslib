export function calcPhi() {
  let phi = 1;
  for (; ;) {
    const x = 1 + 1 / phi;
    if (phi == x) {
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
    throw new Error("unexpected assignment");
  }
};
