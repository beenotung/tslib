export const MILLISECOND = 1;
export const SECOND = MILLISECOND * 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;

export namespace session {
  let intervals = {};

  export function now(interval = 1000): number {
    const now = Date.now();
    const last = intervals[interval];
    if (last) {
      if (now - last < interval) {
        return last;
      } else {
        intervals[interval] = now;
        return now;
      }
    } else {
      intervals[interval] = now;
      return now;
    }
  }
}
