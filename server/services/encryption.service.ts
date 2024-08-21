import { injectable } from 'inversify';
import bcrypt from 'bcryptjs';

import { HttpError } from '../types/errors';

export interface IEncryptionService {
  isPasswordCorrect(password: string, hashedPassword: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

@injectable()
export class EncryptionService implements IEncryptionService {
  private static readonly SALT_LENGTH: number = 12;

  public async isPasswordCorrect(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch {
      throw new HttpError(500, 'The password could not be compared');
    }
  }

  public async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, EncryptionService.SALT_LENGTH);
    } catch {
      throw new HttpError(500, 'The password could not be hashed');
    }
  }
}
