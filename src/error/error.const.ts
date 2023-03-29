export class HttpException extends Error {
  statusCode: number;
  constructor(error: { statusCode: number; message: string }) {
    super(error.message);
    this.statusCode = error.statusCode;
  }
}
