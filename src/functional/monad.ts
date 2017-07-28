/**
 * monad factory
 * reference : https://github.com/douglascrockford/monad/blob/master/monad.js
 * */

import {toArray} from "../array";
import {isDefined} from "../lang";

export interface Monad<A> {
  is_monad: true;

  bind<B>(f: (a: A, ...args: any[]) => Monad<B>, args?: ArrayLike<any>): Monad<B>;

  map<B>(f: (a: A, ...args: any[]) => B, args?: ArrayLike<any>): Monad<B>
}

export interface Unit<M extends Monad<V>, V> {
  (value: V): M;

  method(name: PropertyKey, f: Function): Unit<M, V>;

  lift_value(name: PropertyKey, f: Function): Unit<M, V>;

  lift(name: PropertyKey, f: Function): Unit<M, V>;
}

export function createUnit<M extends Monad<V>, V>(modifier?: (monad: Monad<V>, value: any) => any): Unit<M, V> {
  const prototype = Object.create(null);
  prototype.is_monad = true;

  const unit: Unit<M, V> = Object.assign(
    function unit(value): Monad<V> {
      const monad: Monad<V> = Object.assign(Object.create(prototype), {
        bind: function bind<B>(f: Function, args?: ArrayLike<any>): Monad<B> {
          return f.call(void 0, value, ...toArray(args));
        }
        , map: function map<B>(f: Function, args?: ArrayLike<any>): Monad<B> {
          return unit(monad.bind(f, args));
        }
      });
      if (typeof modifier === "function") {
        value = modifier(monad, value);
      }
      return monad;
    }
    , {
      method: function method(name: PropertyKey, f: Function): Unit<M, V> {
        prototype[name] = f;
        return unit;
      }
      , lift_value: function lift_value(name: PropertyKey, f: Function): Unit<M, V> {
        prototype[name] = function (): Monad<V> {
          return (<Monad<V>>this).bind(f, arguments);
        };
        return unit;
      }
      , lift: function lift(name: PropertyKey, f: Function): Unit<M, V> {
        prototype[name] = function (): Monad<V> {
          const res: Monad<V> | any = (<Monad<V> > this).bind(f, arguments);
          return (isDefined(res) && res.is_monad)
            ? res
            : unit(res);
        };
        return unit;
      }
    });

  return unit;
}


