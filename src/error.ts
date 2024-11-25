export class NotImplError extends Error {}

export function not_impl(): any {
  throw new NotImplError()
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }

  toString() {
    return `HttpError(${this.status}): ${this.message}`
  }
}
