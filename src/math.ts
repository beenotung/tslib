export let math: { phi: number } = {
  get phi(): number {
    let phi = 1;
    for (; ;) {
      const x = 1 + 1 / phi;
      if (phi == x) {
        break;
      }
      phi = x;
    }
    math.phi = phi;
    return phi;
  }
};
