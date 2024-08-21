import { injectable } from 'inversify';

import prisma from '../configs/database';
import { User } from '@prisma/client';

import { HttpError } from '../types/errors';

export interface IUserRepository {
  createUser(
    name: string,
    surname: string,
    email: string,
    hashedPassword: string
  ): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  isEmailExist(email: string): Promise<boolean>;
}

@injectable()
export class UserRepository implements IUserRepository {
  public async createUser(
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

  public async findUserByEmail(email: string): Promise<User | null> {
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
