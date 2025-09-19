export class NotImplError extends Error {}

export function not_impl(): any {
  throw new NotImplError()
}

export class HttpError extends Error {
  public status: number
  public statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.status = statusCode
  }

  toString() {
    return `HttpError(${this.status}): ${this.message}`
  }
}
