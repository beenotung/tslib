/**
 * monad factory
 * reference : https://github.com/douglascrockford/monad/blob/master/monad.js
 * */

import { toArray } from '../array';

export interface Monad<A> {
  is_monad: true;

  bind<B>(
    f: (a: A, ...args: any[]) => Monad<B>,
    args?: ArrayLike<any>,
  ): Monad<B>;

  map<B>(f: (a: A, ...args: any[]) => B, args?: ArrayLike<any>): Monad<B>;
}

export interface Unit<M extends Monad<A>, A> {
  <M extends Monad<A>, A>(value: A): M;

  method(name: PropertyKey, f: (...args: any[]) => any): Unit<M, A>;

  lift_value<B>(
    name: PropertyKey,
    f: (a: A, ...args: any[]) => Monad<B>,
  ): Unit<Monad<B>, B>;

  lift<B>(
    name: PropertyKey,
    f: (a: A, ...args: any[]) => Monad<B> | B,
  ): Unit<M, A>;
}

export function createUnit<M extends Monad<A>, A>(
  modifier?: (monad: Monad<A>, value: A) => any,
): Unit<M, A> {
  const prototype = Object.create(null);
  prototype.is_monad = true;

  const unit: Unit<M, A> = Object.assign(function unit(value: A) {
    return unitFunction(value);
  });

  function unitFunction(value: A): M {
    const bind = <B>(
      f: (a: A, ...args: any[]) => Monad<B>,
      args?: ArrayLike<any>,
    ): Monad<B> => f.call(void 0, value, ...toArray(args));

    const map = <B>(
      f: (a: A, ...args: any[]) => B,
      args?: ArrayLike<any>,
    ): Monad<B> => bind((a, args) => unit(f.call(void 0, a, ...args)), args);

    const monad: Monad<A> = {
      is_monad: true,
      bind,
      map,
    };
    if (typeof modifier === 'function') {
      value = modifier(monad, value);
    }
    return monad as M;
  }

  const method = (
    name: PropertyKey,
    f: (...args: any[]) => any,
  ): Unit<M, A> => {
    prototype[name] = f;
    return unit;
  };

  const lift_value = <B>(
    name: PropertyKey,
    f: (a: A, ...args: any[]) => Monad<B>,
  ): Unit<Monad<B>, B> => {
    prototype[name] = function(): Monad<B> {
      /* tslint:disable:no-invalid-this */
      const monad = this as Monad<A>;
      /* tslint:enable:no-invalid-this */
      return monad.bind(f, arguments);
    };
    return unit as Unit<any, any>;
  };

  const lift = <B>(
    name: PropertyKey,
    f: (a: A, ...args: any[]) => Monad<B> | B,
  ): Unit<M, A> => {
    prototype[name] = function(): Monad<B> {
      /* tslint:disable:no-invalid-this */
      const monad = this as Monad<A>;
      /* tslint:enable:no-invalid-this */
      return monad.bind((a, args) => {
        const b = f(a, ...args);
        if ((b as Monad<B>).is_monad) {
          return b as Monad<B>;
        } else {
          return unit(b as B);
        }
      }, arguments);
    };
    return unit;
  };

  return Object.assign(unit, {
    method,
    lift_value,
    lift,
  });
}
