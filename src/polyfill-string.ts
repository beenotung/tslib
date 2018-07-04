import {strReplaceAll} from './string';

export interface PolyfillString extends String {
  replaceAll (find: string, replace: string): PolyfillString;
}

export namespace PolyfillString {
  export function wrapString (s: string): PolyfillString {
    return Object.assign(s, {
      replaceAll (find: string, replace: string): PolyfillString {
        return wrapString(strReplaceAll(s, find, replace));
      },
    });
  }
}
