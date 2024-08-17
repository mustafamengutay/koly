import { ValidationError } from 'express-validator';

export class HttpError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class HttpBodyValidationError extends HttpError {
  public errors: ValidationError[];
  constructor(statusCode: number, errors: ValidationError[]) {
    super(statusCode, 'Field Validation Error');
    this.errors = errors;
  }
}
