import { ClientError } from './client-error'

export class ValidationError extends ClientError {
  constructor(message: string, errors?: unknown) {
    super(message, 400, errors)
  }
}

export class NotFoundError extends ClientError {
  constructor(message: string, errors?: unknown) {
    super(message, 404, errors)
  }
}

export class InvariantError extends ClientError {
  constructor(message: string) {
    super(message)
  }
}

export class AuthorizationError extends ClientError {
  constructor(message: string) {
    super(message, 403)
  }
}

export class AuthenticationError extends ClientError {
  constructor(message: string) {
    super(message, 401)
  }
}
