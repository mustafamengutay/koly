import bcrypt from 'bcryptjs';

import { HttpError } from '../types/errors';

const SALT_LENGTH = 12;

export async function isPasswordCorrect(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch {
    throw new HttpError(500, 'The password could not be compared');
  }
}

export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, SALT_LENGTH);
  } catch {
    throw new HttpError(500, 'The password could not be hashed');
  }
}
