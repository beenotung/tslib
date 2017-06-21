import {Obj} from './lang';
/**
 * Created by beenotung on 6/21/17.
 */

/**
 * fix 'this' scope issue of the member methods when passed to other functions
 * @return original object
 * */
export function bindMethods<A extends Obj<Function | any>>(o: A): A {
  Object.keys(o)
    .forEach(x => {
      const f = o[x];
      if (typeof f === 'function') {
        o[x] = f.bind(o);
      }
    });
  return o;
}
