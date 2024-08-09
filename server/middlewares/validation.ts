import { Request, Response, NextFunction } from 'express';
import { HttpBodyValidationError } from '../types/errors';

import { validationResult } from 'express-validator';

export const inputValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpBodyValidationError(400, errors.array());

    return next(error);
  }
  next();
};
