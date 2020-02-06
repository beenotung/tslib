import { Either, left, right } from './either';
import { isDefined } from './lang';

/**
 * Created by beenotung on 2/16/17.
 */
export interface Maybe<A> {
  isJust: boolean;
  isNothing: boolean;
  map: <B>(f: (a: A) => B) => Maybe<B>;

  get(): A;

  withDefault(a: A): Maybe<A>;

  then(f: (a: A) => void): Maybe<A>;

  otherwise(f: () => void): Maybe<A>;

  toEither<E>(e: E): Either<E, A>;
}

function fromNullable<A>(a: A): Maybe<A> {
  if (isDefined(a)) {
    return {
      get: () => a,
      isJust: true,
      isNothing: false,
      map: <B>(f: (a: A) => B): Maybe<B> => fromNullable(f(a)),
      withDefault: _ => fromNullable(a),
      then: (f: (a: A) => void) => {
        f(a);
        return fromNullable(a);
      },
      otherwise: _ => fromNullable(a),
      toEither: <E>(_e: E): Either<E, A> => right<E, A>(a),
    };
  } else {
    return Nothing;
  }
}

function or<A>(a: Maybe<A>, b: Maybe<A>): Maybe<A> {
  return a.isJust ? a : b.isJust ? b : Nothing;
}

function and<A, B>(a: Maybe<A>, b: Maybe<B>): Maybe<[A, B]> {
  return a.isJust && b.isJust
    ? fromNullable<[A, B]>([a.get(), b.get()])
    : Nothing;
}

export const Nothing: Maybe<any> = {
  get() {
    throw new Error('Cannot get value from Nothing.');
  },
  isJust: false,
  isNothing: true,
  map: () => Nothing,
  withDefault: a => fromNullable(a),
  then: () => {
    return Nothing;
  },
  otherwise: (f: () => void) => {
    f();
    return Nothing;
  },
  toEither: <E>(e: E): Either<E, any> => left(e),
};

export const Maybe = {
  fromNullable,
  or,
  and,
  Nothing,
};
