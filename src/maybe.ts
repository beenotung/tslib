import {isDefined} from "./lang";
/**
 * Created by beenotung on 2/16/17.
 */
export interface Maybe<A> {
  get(): A;
  isJust: boolean;
  isNothing: boolean;
  map: <B>(f: (a: A) => B) => Maybe<B>;
}
export const Nothing: Maybe<any> = {
  get: function () {
    throw new Error("Cannot get value from Nothing.");
  }
  , isJust: false
  , isNothing: true
  , map: () => Nothing
};
export namespace Maybe {
  export function fromNullable<A>(a: A): Maybe<A> {
    if (isDefined(a)) {
      return {
        get: () => a
        , isJust: true
        , isNothing: false
        , map: f => fromNullable(f(a))
      };
    } else {
      return Nothing;
    }
  }

  export function or<A>(a: Maybe<A>, b: Maybe<A>): Maybe<A> {
    if (a.isJust)
      return a;
    if (b.isJust)
      return b;
    return Nothing;
  }

  export function and<A,B>(a: Maybe<A>, b: Maybe<B>): Maybe<[A, B]> {
    if (a.isJust && b.isJust)
      return fromNullable<[A, B]>([a.get(), b.get()]);
    return Nothing;
  }
}
