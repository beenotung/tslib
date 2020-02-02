import { isDefined } from '../lang';
import { createUnit, Monad, Unit } from './monad';

export interface MaybeMonad<A> extends Monad<A> {
  map<B>(f: (a: A) => B): MaybeMonad<B>;
}

export const MaybeUnit: Unit<MaybeMonad<any>, any> = createUnit<
  MaybeMonad<any>,
  any
>((monad, value) => {
  if (!isDefined(value)) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    monad.bind = _ => monad;
  }
});

export namespace MaybeMonad {
  export function fromNullable<A>(value: A | null): MaybeMonad<A> {
    return MaybeUnit(value);
  }
}
