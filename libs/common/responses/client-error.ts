export class ClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
    public readonly errors?: unknown,
  ) {
    super(message)
    this.name = new.target.name
  }
}
