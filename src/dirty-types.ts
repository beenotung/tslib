/**
 * Created by beenotung on 5/5/17.
 */
export type SupplierOrData<A> = A | (() => A);

export function unwrapSupplierOrData<A> (x: SupplierOrData<A>): A {
  if (typeof x === "function") {
    return x();
  }
  return x;
}

/**
 * to escape tslint:ban-types on Function
 * */
export type LossFunction = (...args: any[]) => any;
