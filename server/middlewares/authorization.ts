import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customRequest';
import { HttpError } from '../types/errors';
import { LoginJwtPayload } from '../types/customJwtPayload';

import jwt from 'jsonwebtoken';

export const verifyUser = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    throw new HttpError(401, 'Token could not be found');
  }

  let decodedData: LoginJwtPayload;
  try {
    decodedData = jwt.verify(token, process.env.JWT_SECRET!) as LoginJwtPayload;
  } catch {
    throw new HttpError(500, 'Token could not be verified');
  }

  if (!decodedData) {
    throw new HttpError(401, 'User is not authenticated');
  }

  req.userId = decodedData.userId;

  next();
};
