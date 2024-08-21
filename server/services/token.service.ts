import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { HttpError } from '../types/errors';

export interface ITokenService {
  createLoginToken(id: number, email: string): string;
}

@injectable()
export class TokenService implements ITokenService {
  private static readonly SECRET: string = process.env.JWT_SECRET!;

  public createLoginToken(id: number, email: string): string {
    try {
      const token: string = jwt.sign(
        {
          id,
          email,
        },
        TokenService.SECRET,
        {
          expiresIn: '30m',
        }
      );

      return token;
    } catch {
      throw new HttpError(500, 'The token could not be created');
    }
  }
}
