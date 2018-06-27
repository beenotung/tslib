import {later} from "./async/wait";

export const tryN = <A>(n: number, f: () => Promise<A>, interval = 0, e?): Promise<A> => n < 0
  ? Promise.reject(e)
  : f().catch((e) => {
    const h = () => tryN(n - 1, f, interval, e);
    return interval ? later(interval).then(h) : h();
  });
