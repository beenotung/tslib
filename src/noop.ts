export function gen_noop<A>(): (a: A) => void {
  return () => {
    // do nothing
  };
}

export const noop: (...args: any[]) => void = () => {
  // do nothing
};
