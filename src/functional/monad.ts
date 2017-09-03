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

export interface Unit<M extends Monad<A>, A> {
  <M extends Monad<A>, A>(value: A): M;

  method(name: PropertyKey, f: Function): Unit<M, A>;

  lift_value<B>(name: PropertyKey, f: (a: A, ...args: any[]) => Monad<B>): Unit<Monad<B>, B>;

  lift<B>(name: PropertyKey, f: (a: A, ...args: any[]) => Monad<B> | B): Unit<M, A>;
}

export function createUnit<M extends Monad<A>, A>(modifier?: (monad: Monad<A>, value: any) => any): Unit<M, A> {
  const prototype = Object.create(null);
  prototype.is_monad = true;

  const unit: Unit<M, A> = <Unit<Monad<A>, A>> Object.assign(
    function unit(value): Monad<A> {
      const monad: Monad<A> = Object.assign(Object.create(prototype), {
        bind: function bind<B>(f: (a: A, ...args: any[]) => Monad<B>, args?: ArrayLike<any>): Monad<B> {
          return f.call(void 0, value, ...toArray(args));
        }
        , map: function map<B>(f: (a: A, ...args: any[]) => B, args?: ArrayLike<any>): Monad<B> {
          return monad.bind((a, args) => <Monad<any>> <Monad<A>> unit(f.call(void 0, a, ...args)), args);
        }
      });
      if (typeof modifier === "function") {
        value = modifier(monad, value);
      }
      return monad;
    }
    , {
      method: function method(name: PropertyKey, f: Function): Unit<M, A> {
        prototype[name] = f;
        return unit;
      }
      , lift_value: function lift_value<B>(name: PropertyKey, f: (a: A, ...args: any[]) => Monad<B>): Unit<M, A> {
        prototype[name] = function (): Monad<B> {
          return (<Monad<A>>this).bind(f, arguments);
        };
        return unit;
      }
      , lift: function lift<B>(name: PropertyKey, f: (a: A, ...args: any[]) => Monad<B> | B): Unit<M, A> {
        prototype[name] = function (): Monad<B> {
          const res: Monad<B> | B = (<Monad<A> > this).bind(<(a: A, ...args: any[]) => Monad<B>>f, arguments);
          return (isDefined(res) && res.is_monad)
            ? <Monad<B>>res
            : unit(<B><any>res);
        };
        return unit;
      }
    });

  return unit;
}
