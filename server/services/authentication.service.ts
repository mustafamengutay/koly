import prisma from '../configs/database';
import bcrypt from 'bcryptjs';

import { HttpError } from '../types/errors';

export default class AuthenticationService {
  private static instance: AuthenticationService;
  private static readonly SALT_LENGTH: number = 12;

  private constructor() {}

  public static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }

    return AuthenticationService.instance;
  }

  /**
   * Creates a user and returns it. If any error occurs, it throws that
   * specific error.
   * @param name New user's name
   * @param surname New user's surname
   * @param email New user's email
   * @param password New user's password
   * @returns New user object.
   */
  public async signUp(
    name: string,
    surname: string,
    email: string,
    password: string
  ) {
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new HttpError(409, 'The email is already exist');
    }

    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.createUser(name, surname, email, hashedPassword);

    return newUser;
  }

  private async createUser(
    name: string,
    surname: string,
    email: string,
    hashedPassword: string
  ) {
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

  private async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, AuthenticationService.SALT_LENGTH);
    } catch {
      throw new HttpError(500, 'The password could not be hashed');
    }
  }

  private async isEmailExist(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      return user ? true : false;
    } catch {
      throw new HttpError(500, 'The email could not be checked');
    }
  }
}
