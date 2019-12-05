// tslint:disable:no-bitwise
export function combinations<T>(xs: T[]): T[][] {
  const xss: T[][] = [];
  const listLen = xs.length;
  const combinationCount = 1 << listLen;
  for (let i = 1; i < combinationCount; i++) {
    const ys: T[] = [];
    for (let j = 0; j < listLen; j++) {
      if (i & (1 << j)) {
        ys.push(xs[j]);
      }
    }
    xss.push(ys);
  }
  return xss;
}
// tslint:enable:no-bitwise
