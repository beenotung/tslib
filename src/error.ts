export class NotImplError extends Error {
}

export function not_impl(): any {
  throw new NotImplError();
}
