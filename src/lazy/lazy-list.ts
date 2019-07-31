import { Lazy } from './lazy';

/**
 * @description lazy linked list
 * */
export class LazyList<A> extends Lazy<A> {
  private isHead?: true;
  private tail?: LazyList<A>;
  private mapper?: (x: any) => A;

  constructor(value?: () => A, tail?: LazyList<A>, mapper?: (x: any) => A) {
    super(value || (() => undefined as any));
    if (arguments.length === 0) {
      this.isHead = true;
    }
    this.tail = tail;
    this.mapper = mapper;
  }

  public append(a: () => A): LazyList<A> {
    return new LazyList<A>(a, this, this.mapper);
  }

  public appendRaw(a: A): LazyList<A> {
    return this.append(() => a);
  }

  public appendAll(xs: A[]): LazyList<A> {
    return xs.reduce((acc: LazyList<A>, c) => acc.appendRaw(c), this);
  }

  /** @description non-lazy */
  public toArray(thisArg: LazyList<A> = this): A[] {
    const xs: A[] = [];
    for (let c: undefined | LazyList<A> = thisArg; c && !c.isHead; c = c.tail) {
      if (c.mapper) {
        xs.push(c.mapper(c.value()));
      } else {
        xs.push(c.value());
      }
    }
    return xs;
  }

  /** @override */
  public map<B>(f: (a: A) => B): LazyList<B> {
    if (this.mapper) {
      const mapper = this.mapper;
      return new LazyList<B>(() => this.value() as any, this.tail as any, a =>
        f(mapper(a)),
      );
    } else {
      return new LazyList<B>(() => this.value() as any, this.tail as any, f);
    }
  }
}

export namespace LazyList {
  export const headSymbol = Symbol.for('head');
  export const empty = <A>(): LazyList<A> => new LazyList<A>();
  export const fromArray = <A>(xs: A[]): LazyList<A> =>
    empty<A>().appendAll(xs);
}
