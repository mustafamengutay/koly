import jwt from 'jsonwebtoken';
import { HttpError } from '../types/errors';

const SECRET = process.env.JWT_SECRET!;

export function createLoginToken(id: number, email: string): string {
  try {
    const token: string = jwt.sign({ id, email }, SECRET, { expiresIn: '30m' });
    return token;
  } catch {
    throw new HttpError(500, 'The token could not be created');
  }
}
