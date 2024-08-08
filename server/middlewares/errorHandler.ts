import { Request, Response, NextFunction } from 'express';
import { HttpBodyValidationError, HttpError } from '../types/errors';

type HandlerError = Error | HttpError | HttpBodyValidationError;

export const errorHandler = (
  error: HandlerError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof HttpBodyValidationError) {
    const statusCode = error.statusCode;
    const errors = error.errors;

    res.status(statusCode).json({
      status: 'fail',
      data: errors,
    });
  } else if (error instanceof HttpError) {
    const statusCode = error.statusCode;
    const message = error.message;

    res.status(statusCode).json({
      status: 'error',
      message,
    });
  } else {
    const statusCode = 500;
    const message = error.message;

    res.status(statusCode).json({
      status: 'error',
      message,
    });
  }
};
