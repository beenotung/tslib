import { createDefer } from './async/defer';
import { Obj } from './lang';

/**
 * Created by beenotung on 6/2/17.
 */
export function checkFetch(url: string): Promise<boolean> {
  const defer = createDefer<boolean, void>();
  fetch(url)
    .then(x => defer.resolve(true))
    .catch(x => defer.resolve(false));
  return defer.promise;
}

export function toFormData(o: Obj<string | number | Blob>): FormData {
  const formData = new FormData();
  Object.keys(o).forEach(x => {
    if (typeof o[x] === 'number') {
      formData.append(x, o[x] + '');
    } else {
      formData.append(x, o[x] as string | Blob);
    }
  });
  return formData;
}
