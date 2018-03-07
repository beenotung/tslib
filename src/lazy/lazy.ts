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
    return this.map(a => a + b);
  }

  minus(b) {
    return this.map(a => a as any - b);
  }

  mult(b) {
    return this.map(a => a as any * b);
  }

  rem(b) {
    return this.map(a => a as any % b);
  }

  div(b) {
    return this.map(a => a as any / b);
  }

  quot(b) {
    return this.map(a => (a as any / b) | 0);
  }

  quotRem(b) {
    return this.map((a: any) => {
      return [(a / b) | 0, a % b];
    });
  }

  and(b) {
    return this.map(a => a && b);
  }

  or(b) {
    return this.map(a => a || b);
  }

  not() {
    return this.map(a => !a);
  }

  notnot() {
    return this.map(a => !!a);
  }
}
