import prisma from '../../configs/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import AuthenticationService from '../../services/authentication.service';
import { HttpError } from '../../types/errors';

describe('AuthenticationService', () => {
  const authenticationService = AuthenticationService.getInstance();

  beforeAll(() => {
    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
    jwt.sign = jest.fn().mockReturnValue('complexToken');

    prisma.user.create = jest.fn().mockResolvedValue({
      name: 'test',
      surname: 'data',
      email: 'test@gmail.com',
      password: 'hashedPassword',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a user if the email does not exist', async () => {
      // The result of the private isEmailExist method is set to false.
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      const name = 'test';
      const surname = 'data';
      const email = 'test@gmail.com';
      const password = 'test123';

      const user = await authenticationService.signUp(
        name,
        surname,
        email,
        password
      );

      expect(user).toHaveProperty('email', email);
      expect(user).toHaveProperty('password', 'hashedPassword');
    });

    it('should throw an error if the email exist', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue({
        email: 'test@gmail.com',
      });

      const name = 'test';
      const surname = 'data';
      const email = 'test@gmail.com';
      const password = 'test123';

      await expect(
        authenticationService.signUp(name, surname, email, password)
      ).rejects.toThrow(HttpError);
    });

    it('should throw an http error if password hashing fails', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      bcrypt.hash = jest
        .fn()
        .mockRejectedValue(
          new HttpError(500, 'The password could not be hashed')
        );

      const name = 'test';
      const surname = 'data';
      const email = 'test@gmail.com';
      const password = 'test123';

      await expect(
        authenticationService.signUp(name, surname, email, password)
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if user creation fails', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
      prisma.user.create = jest
        .fn()
        .mockRejectedValue(new Error('User creation failed'));

      const name = 'test';
      const surname = 'data';
      const email = 'test@gmail.com';
      const password = 'test123';

      await expect(
        authenticationService.signUp(name, surname, email, password)
      ).rejects.toThrow(HttpError);
    });
  });

  describe('login', () => {
    it('should return a login token if the login step successfull', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue({
        email: 'test@gmail.com',
        password: 'hashedPassword',
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const email = 'test@gmail.com';
      const password = 'test123';

      await expect(authenticationService.login(email, password)).resolves.toBe(
        'complexToken'
      );
    });

    it('should throw an Http error if the user does not exist', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      const email = 'test@gmail.com';
      const password = 'test123';

      await expect(
        authenticationService.login(email, password)
      ).rejects.toThrow(new HttpError(404, 'The user does not exist'));
    });

    it('should throw an error if the password is incorrect', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue({
        email: 'test@gmail.com',
        password: 'hashedPassword',
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const email = 'test@gmail.com';
      const password = 'test123';

      await expect(
        authenticationService.login(email, password)
      ).rejects.toThrow(new HttpError(401, 'The password is wrong'));
    });
  });
});
