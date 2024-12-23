import { injectable } from 'inversify';
import prisma from '../configs/database';
import { User } from '@prisma/client';

import IUserRepository from '../types/repositories/IUserRepository';
import { HttpError } from '../types/errors';

@injectable()
export class UserRepository implements IUserRepository {
  public async create(
    name: string,
    surname: string,
    email: string,
    hashedPassword: string
  ): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          name,
          surname,
          email,
          password: hashedPassword,
        },
      });

      return user;
    } catch {
      throw new HttpError(500, 'The user could not be created');
    }
  }

  public async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      return user;
    } catch {
      throw new HttpError(500, 'The user could not be found');
    }
  }

  public async isEmailExist(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      return !!user;
    } catch {
      throw new HttpError(500, 'The email could not be checked');
    }
  }
}
