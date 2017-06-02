import {createDefer} from './async';
/**
 * Created by beenotung on 6/2/17.
 */
export function checkFetch(url: string): Promise<boolean> {
  const defer = createDefer<boolean, void>();
  fetch(url)
    .then(x => defer.resolve(true))
    .catch(x => defer.resolve(false))
  ;
  return defer.promise;
}
