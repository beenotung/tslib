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

  export function nextDate(after = new Date('2016-12-12'), before = new Date('2018-12-12')): Date {
    let diff = before.getTime() - after.getTime();
    let time = Random.nextInt(after.getTime() + diff, after.getTime());
    return new Date(time);
  }
}
