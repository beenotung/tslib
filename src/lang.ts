/**
 * Created by beenotung on 12/26/16.
 */
import * as R from "ramda";
import {TranslateService} from "ng2-translate";
import {createDefer} from "./async";

export let getProp = R.curry((name: string, o: any) => {
  if (o[name])
    return o[name];
  else {
    return name.split('.').reduce((acc, c) => acc[c], o);
  }
});

export function first_non_null(...args: any[]) {
  for (let arg of args)
    if (arg) return arg;
}
export function bindFunction(f: Function) {
  return f.bind(f);
}
export async function translateAsync(translate: TranslateService, key: string): Promise<string> {
  let defer = createDefer<string,any>();
  translate.get(key).subscribe(defer.resolve, defer.reject);
  return defer.promise;
}
