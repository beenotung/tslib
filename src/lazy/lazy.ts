/**
 * @description this class is not strict type, be ware of the type <A>
 * */
export class Lazy<A> {
  private f: () => A;

  constructor(f: () => A) {
    this.f = f;
  }

  value(): A {
    const res = this.f();
    delete this.f;
    this.value = () => res;
    return res;
  }

  map<B>(f: (a: A) => B): Lazy<B> {
    return new Lazy<B>(() => f(this.value()));
  }

  add(b) {
    return new Lazy(() => this.value() + b);
  }

  minus(b) {
    return new Lazy(() => this.value() as any - b);
  }

  mult(b) {
    return new Lazy(() => this.value() as any * b);
  }

  rem(b) {
    return new Lazy(() => this.value() as any % b);
  }

  div(b) {
    return new Lazy(() => this.value() as any / b);
  }

  quot(b) {
    return new Lazy(() => (this.value() as any / b) | 0);
  }

  quotRem(b) {
    return new Lazy(() => {
      const a = this.value() as any;
      return [(a / b) | 0, a % b];
    });
  }

  and(b) {
    return new Lazy(() => this.value() && b);
  }

  or(b) {
    return new Lazy(() => this.value() || b);
  }

  not() {
    return new Lazy(() => !this.value());
  }

  notnot() {
    return new Lazy(() => !!this.value());
  }
}
