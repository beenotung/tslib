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

export class NotImplError extends HttpError {
  constructor() {
    super(501, 'Not Implemented')
  }
}

export function not_impl(): any {
  throw new NotImplError()
}
