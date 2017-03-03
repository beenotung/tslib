export namespace Random {
  /** @return number : lower <= value < upper */
  export function nextInt(upper: number = Number.MAX_SAFE_INTEGER, lower: number = 0): number {
    return Math.floor(Math.random() * (upper - lower) + lower);
  }

  /** @return real number : -1 .. 1 */
  export function nextNP1() {
    return Math.random() * 2 - 1;
  }

  export function element<A>(xs: A[]): A {
    return xs[nextInt(xs.length, 0)];
  }

  export function nextDate(after?: Date): Date {
    if (after) {
      return new Date(nextInt(Number.MAX_SAFE_INTEGER, after.getTime()));
    }
    return new Date(nextInt());
  }
}
