/**
 * monad factory
 * reference : https://github.com/douglascrockford/monad/blob/master/monad.js
 * */

import {toArray} from "../array";
import {isDefined} from "../lang";

export interface Monad {
  is_monad: true;

  bind(f: Function, args?: ArrayLike<any>): Monad;
}

export interface Unit {
  (value): Monad;

  method(name: PropertyKey, f: Function): Unit;

  lift_value(name: PropertyKey, f: Function): Unit;

  lift(): Unit;
}

export function createUnit(modifier?: Function): Unit {
  const prototype = Object.create(null);
  prototype.is_monad = true;

  const unit: Unit = Object.assign(
    function unit(value): Monad {
      const monad = Object.assign(Object.create(prototype), {
        bind: function bind(f: Function, args?: ArrayLike<any>): Monad {
          return f.apply(void 0, value, ...toArray(args));
        }
      });
      if (typeof modifier === "function") {
        value = modifier(monad, value);
      }
      return monad;
    }
    , {
      method: function method(name: PropertyKey, f: Function): Unit {
        prototype[name] = f;
        return unit;
      }
      , lift_value: function lift_value(name: PropertyKey, f: Function): Unit {
        prototype[name] = function (): Monad {
          return (<Monad>this).bind(f, arguments);
        };
        return unit;
      }
      , lift: function lift(name: PropertyKey, f: Function): Unit {
        prototype[name] = function (): Monad {
          const res = (<Monad>this).bind(f, arguments);
          return (isDefined(res) && res.is_monad)
            ? res
            : unit(res);
        };
        return unit;
      }
    });

  return unit;
}


