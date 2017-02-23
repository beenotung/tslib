/**
 * Created by beenotung on 2/1/17.
 */
export namespace Random {
  /** @return number : lower <= value < upper */
  export function nextInt(upper: number, lower: number = 0): number {
    return Math.floor(Math.random() * (upper - lower) + lower);
  }

  /** @return number : -1 .. 1 */
  export function nextNP1() {
    return Math.random() * 2 - 1;
  }
}
