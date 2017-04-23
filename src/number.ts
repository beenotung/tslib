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
export type CompareResult = CompareResult.Smaller | CompareResult.Equal | CompareResult.Larger;

export function compare_number(a: number, b: number): CompareResult {
  return a === b
    ? CompareResult.Equal
    : a < b
      ? CompareResult.Smaller
      : CompareResult.Larger
    ;
}
