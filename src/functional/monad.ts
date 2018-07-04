/**
 * monad factory
 * reference : https://github.com/douglascrockford/monad/blob/master/monad.js
 * */

import {toArray} from '../array';
import {isDefined} from '../lang';

export interface Monad<A> {
  is_monad: true;

  bind<B> (f: (a: A, ...args: any[]) => Monad<B>, args?: ArrayLike<any>): Monad<B>;

  map<B> (f: (a: A, ...args: any[]) => B, args?: ArrayLike<any>): Monad<B>
}

export interface Unit<M extends Monad<A>, A> {
  <M extends Monad<A>, A>(value: A): M;

  method (name: PropertyKey, f: (...args: any[]) => any): Unit<M, A>;

  lift_value<B> (name: PropertyKey, f: (a: A, ...args: any[]) => Monad<B>): Unit<Monad<B>, B>;

  lift<B> (name: PropertyKey, f: (a: A, ...args: any[]) => Monad<B> | B): Unit<M, A>;
}

export function createUnit<M extends Monad<A>, A> (modifier?: (monad: Monad<A>, value: any) => any): Unit<M, A> {
  const prototype = Object.create(null);
  prototype.is_monad = true;

  const unit: Unit<M, A> = Object.assign(
    function unit (value): Monad<A> {
      const monad: Monad<A> = Object.assign(Object.create(prototype), {
        bind: function bind<B> (f: (a: A, ...args: any[]) => Monad<B>, args?: ArrayLike<any>): Monad<B> {
          return f.call(void 0, value, ...toArray(args));
        }
        , map: function map<B> (f: (a: A, ...args: any[]) => B, args?: ArrayLike<any>): Monad<B> {
          return monad.bind((a, args) => unit(f.call(void 0, a, ...args)) as Monad<A> as Monad<any>, args);
        },
      });
      if (typeof modifier === 'function') {
        value = modifier(monad, value);
      }
      return monad;
    }
    , {
      method: function method (name: PropertyKey, f: (...args: any[]) => any): Unit<M, A> {
        prototype[name] = f;
        return unit;
      }
      , lift_value: function lift_value<B> (name: PropertyKey, f: (a: A, ...args: any[]) => Monad<B>): Unit<M, A> {
        prototype[name] = function (): Monad<B> {
          /* tslint:disable:no-invalid-this */
          return (this as Monad<A>).bind(f, arguments);
          /* tslint:enable:no-invalid-this */
        };
        return unit;
      }
      , lift: function lift<B> (name: PropertyKey, f: (a: A, ...args: any[]) => Monad<B> | B): Unit<M, A> {
        prototype[name] = function (): Monad<B> {
          /* tslint:disable:no-invalid-this */
          const res: Monad<B> | B = (this as Monad<A>).bind(f as (a: A, ...args: any[]) => Monad<B>, arguments);
          /* tslint:enable:no-invalid-this */
          return (isDefined(res) && res.is_monad)
            ? res as Monad<B>
            : unit(res as any as B);
        };
        return unit;
      },
    }) as Unit<M, A>;

  return unit;
}
