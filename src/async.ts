import {Consumer} from "./functional";
/**
 * Created by beenotung on 12/26/16.
 */
export class Defer<A,E> {
  promise: Promise<A>;
  resolve: Consumer<A>;
  reject: Consumer<E>
}
export function createDefer<A,E>(): Defer<A,E> {
  let res = new Defer<A,E>();
  res.promise = new Promise<A>((resolve, reject) => {
    res.resolve = resolve;
    res.reject = reject;
  });
  return res;
}
