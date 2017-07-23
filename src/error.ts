export const not_impl_error = new Error("not impl");

export function not_impl<A>(): A {
  throw not_impl_error;
}
