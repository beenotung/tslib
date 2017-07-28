/** reference : https://github.com/douglascrockford/monad/blob/master/monad.js*/
import {toArray} from "../array";

export interface Monad {
  bind(f: Function, args?: ArrayLike<any>): Monad;
}

export interface Unit {
  (value): Monad;

  method(name: PropertyKey, f: Function);

  lift_value(name: PropertyKey, f: Function);
}

export function createUnit(modifier?: Function): Unit {
  const prototype = Object.create(null);
  prototype.is_monad = true;

  function unit(value): Monad {
    const monad = Object.create(prototype);
    monad.bind = function (f: Function, args: any[] = []) {
      return f.apply(void 0, value, ...args);
    };
    if (typeof modifier === "function") {
      value = modifier(monad, value);
    }
    return monad;
  }

  const res = Object.assign(
    function unit(value): Monad {
      const monad = Object.assign(Object.create(prototype), {
        bind: function bind(f: Function, args?: ArrayLike<any>): Monad {
          toArray(args);
          return f.apply(void 0, value, ...args);
        }
      });
      if (typeof modifier === "function") {
        value = modifier(monad, value);
      }
      return monad;
    }
    , {
      method: function method(name: PropertyKey, f: Function) {
        prototype[name] = f;
        return res;
      }
      , lift_value: function lift_value(name: PropertyKey, f: Function) {
        prototype[name] = function () {
          return (<Monad>this).bind(f, arguments);
        };
        return res;
      }
    });
  return res;
}


