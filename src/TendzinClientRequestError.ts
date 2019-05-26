export default class TendzinClientRequestError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status || 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
