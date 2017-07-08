/**
 * Created by beenotung on 5/18/17.
 */
export interface PolyfillArray<A>extends Array<A> {
  peek(f: (element: A, index?: number) => void);
}

export namespace PolyfillArray {
  const _prototype = {
    peek: function <A>(f: (element: A, index?: number) => void) {
      (<Array<A>><PolyfillArray<A>>this).forEach(f);
      return this;
    }
  };
  Object.assign(Array.prototype, _prototype);
  export const prototype: PolyfillArray<any> = Object.assign({}, _prototype, Array.prototype);

  export function wrapArray<A>(xs: A[]): PolyfillArray<A> {
    return <PolyfillArray<A>>xs;
  }
}
