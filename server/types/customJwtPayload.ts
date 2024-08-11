import jwt from 'jsonwebtoken';

export interface LoginJwtPayload extends jwt.JwtPayload {
  userId: string;
}
