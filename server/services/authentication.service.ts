import prisma from '../configs/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '@prisma/client/index';
import { HttpError } from '../types/errors';

export default class AuthenticationService {
  private static instance: AuthenticationService;
  private static readonly SALT_LENGTH: number = 12;
  private static readonly SECRET: string = process.env.JWT_SECRET!;

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
  ): Promise<User> {
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new HttpError(409, 'The email is already exist');
    }

    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.createUser(name, surname, email, hashedPassword);

    return newUser;
  }

  /**
   * Creates a login token for a user and returns it. If any error occurs,
   * it throws that specific error.
   * @param email User's email
   * @param password User's password
   * @returns A login token
   */
  public async login(email: string, password: string): Promise<string> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new HttpError(404, 'The user does not exist');
    }

    const isPasswordCorrect = await this.isPasswordCorrect(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new HttpError(401, 'The password is wrong');
    }

    const token: string = this.createLoginToken(user.id, user.email);

    return token;
  }

  private async createUser(
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

  private async findUserByEmail(email: string): Promise<User | null> {
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

  private createLoginToken(id: number, email: string): string {
    try {
      const token: string = jwt.sign(
        {
          id,
          email,
        },
        AuthenticationService.SECRET,
        {
          expiresIn: '30m',
        }
      );

      return token;
    } catch {
      throw new HttpError(500, 'The token could not be created');
    }
  }

  private async isPasswordCorrect(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch {
      throw new HttpError(500, 'The password could not be compared');
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
