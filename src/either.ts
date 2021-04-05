/**
 * Created by beenotung on 3/8/17.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

export interface Either<L, R> {
  isLeft: boolean
  isRight: boolean

  getLeft(): L

  getRight(): R

  mmap<L2, R2>(fl: (l: L) => L2, fr: (r: R) => R2): Either<L2, R2>

  mapLeft<L2>(f: (l: L) => L2): Either<L2, R>

  mapRight<R2>(f: (r: R) => R2): Either<L, R2>

  bindLeft<L2>(f: (l: L) => Either<L2, R>): Either<L2, R>

  bindRight<R2>(f: (r: R) => Either<L, R2>): Either<L, R2>
}

export function right<L, R>(r: R): Either<L, R> {
  const res: Either<L, R> = {
    isLeft: false,
    isRight: true,
    getLeft: () => {
      throw new TypeError('get left on right Either')
    },
    getRight: () => r,
    mmap: <L2, R2>(fl: (l: L) => L2, fr: (r: R) => R2): Either<L2, R2> =>
      right<L2, R2>(fr(r)),
    mapLeft: <L2>(f: (L: L) => L2) => res as Either<any, R>,
    mapRight: <R2>(f: (r: R) => R2): Either<L, R2> => right<L, R2>(f(r)),
    bindLeft: <L2>(f: (l: L) => Either<L2, R>) => res as Either<any, R>,
    bindRight: <R2>(f: (r: R) => Either<L, R2>) => f(r),
  }
  return res
}

export function left<L, R>(l: L): Either<L, R> {
  const res: Either<L, R> = {
    isLeft: true,
    isRight: false,
    getLeft: () => l,
    getRight: () => {
      throw new TypeError('get right on left Either')
    },
    mmap: <L2, R2>(fl: (l: L) => L2, fr: (r: R) => R2): Either<L2, R2> =>
      left<L2, R2>(fl(l)),
    mapLeft: <L2>(f: (l: L) => L2) => left<L2, R>(f(l)),
    mapRight: <R2>(f: (r: R) => R2) => (res as Either<L, any>) as Either<L, R2>,
    bindLeft: <L2>(f: (l: L) => Either<L2, R>) => f(l),
    bindRight: <R2>(f: (r: R) => Either<L, R2>) => res as Either<L, any>,
  }
  return res
}

export namespace Either {
  export function get<A>(either: Either<A, A>): A {
    return either.isLeft ? either.getLeft() : either.getRight()
  }
}
