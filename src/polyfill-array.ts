/**
 * Created by beenotung on 5/18/17.
 */
export interface PolyfillArray<A>extends Array<A> {
  peek(f: (element: A, index?: number) => void);
}

export namespace PolyfillArray {
  const _prototype = {
    peek<A>(f: (element: A, index?: number) => void) {
      /* tslint:disable:no-invalid-this */
      (this as PolyfillArray<A> as A[]).forEach(f);
      return this;
      /* tslint:enable:no-invalid-this */
    }
  };
  Object.assign(Array.prototype, _prototype);
  export const prototype: PolyfillArray<any> = Object.assign({}, _prototype, Array.prototype);

  export function fromArray<A>(xs: A[]): PolyfillArray<A> {
    return xs as PolyfillArray<A>;
  }
}
