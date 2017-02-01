/**
 * Created by beenotung on 2/1/17.
 */
export namespace Random {
  export function nextInt(upper: number, lower: number = 0): number {
    return Math.floor(Math.random() * (upper - lower) + lower);
  }
}
