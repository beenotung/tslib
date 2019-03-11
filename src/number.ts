/**
 * Created by beenotung on 4/23/17.
 */

export namespace CompareResult {
  export type Smaller = -1;
  export const Smaller: Smaller = -1;
  export type Equal = 0;
  export const Equal: Equal = 0;
  export type Larger = 1;
  export const Larger: Larger = 1;
}
export type CompareResult =
  | CompareResult.Smaller
  | CompareResult.Equal
  | CompareResult.Larger;

export function compare_number(a: number, b: number): CompareResult {
  return a === b
    ? CompareResult.Equal
    : a < b
    ? CompareResult.Smaller
    : CompareResult.Larger;
}

/**
 * input: x
 * output: [a, b], where x = a/b
 * */
export function numToAB(x: number, error = 1e-12): [number, number] {
  if (x === Math.round(x)) {
    return [x, 1];
  }
  if (x < 0) {
    const [a, b] = numToAB(-x);
    return [-a, b];
  }
  let a = 1;
  let b = 1;
  for (;;) {
    const y = a / b;
    // process.stdout.write(`\r diff=${y - x}, x=${x}, ${a}/${b}`);
    if (x === y || Math.abs(y - x) < error) {
      return [a, b];
    }
    if (y > x) {
      b++;
    } else {
      a++;
    }
  }
}
