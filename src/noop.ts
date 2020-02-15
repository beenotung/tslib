export const noop: (...args: any[]) => void = () => {
  // do nothing
};

export function gen_noop<A>(): (a: A) => void {
  return noop;
}
