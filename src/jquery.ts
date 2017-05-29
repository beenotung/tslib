import {createDefer} from './async';

export function $ToPromise<A>(p: JQueryPromise<A>): Promise<A> {
  const defer = createDefer<A, any>();
  p.done(defer.resolve)
    .fail(defer.reject);
  return defer.promise;
}
