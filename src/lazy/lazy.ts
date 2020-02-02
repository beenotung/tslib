/**
 * @description this class is not strict type, be ware of the type <A>
 * */
export class Lazy<A> {
  private f: () => A;

  constructor(f: () => A) {
    this.f = f;
  }

  public value(): A {
    const res = this.f();
    delete this.f;
    this.value = () => res;
    return res;
  }

  public map<B>(f: (a: A) => B): Lazy<B> {
    return new Lazy<B>(() => f(this.value()));
  }

  public add(b: string | number) {
    return this.map(a => a + (b as string));
  }

  public minus(b: number) {
    return this.map(a => (a as any) - b);
  }

  public mult(b: number) {
    return this.map(a => (a as any) * b);
  }

  public rem(b: number) {
    return this.map(a => (a as any) % b);
  }

  public div(b: number) {
    return this.map(a => (a as any) / b);
  }

  public quot(b: number) {
    /* tslint:disable no-bitwise */
    return this.map(a => ((a as any) / b) | 0);
    /* tslint:enable no-bitwise */
  }

  public quotRem(b: number) {
    return this.map(
      (a: any) =>
        /* tslint:disable no-bitwise */
        [(a / b) | 0, a % b],
      /* tslint:enable no-bitwise */
    );
  }

  public and(b: boolean | any) {
    return this.map(a => a && b);
  }

  public or(b: boolean | any) {
    return this.map(a => a || b);
  }

  public not() {
    return this.map(a => !a);
  }

  public notnot() {
    return this.map(a => !!a);
  }
}
