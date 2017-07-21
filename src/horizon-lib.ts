import {Observable} from "rxjs/Observable";
import {createDefer} from "./async";

/**@deprecated inject 'rxjs/add/operator/toPromise' instead */
export function obsToPromise<A>(o: Observable<A>): Promise<A[]> {
  const defer = createDefer<A[], any>();
  const res: A[] = [];
  o.subscribe(x => {
    res.push(x);
  }, err => {
    defer.reject(err);
  }, () => {
    defer.resolve(res);
  });
  return defer.promise;
}
