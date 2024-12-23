import 'reflect-metadata';

import prisma from '../../configs/database';
import { User } from '@prisma/client';

import { UserRepository } from '../../repositories/user.repository';

import { HttpError } from '../../types/errors';

describe('UserRepository', () => {
  let mockUser: {
    name: string;
    surname: string;
    email: string;
    password: string;
  };
  let userRepository: UserRepository;

  beforeEach(() => {
    mockUser = {
      name: 'test',
      surname: 'data',
      email: 'test@gmail.com',
      password: 'hashedPassword',
    };

    prisma.user.create = jest.fn();
    prisma.user.findUnique = jest.fn();

    userRepository = new UserRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const name = 'test';
    const surname = 'data';
    const email = 'test@gmail.com';
    const password = 'test123';

    it('should create a user and return it successfully', async () => {
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const user: User = await userRepository.create({
        name,
        surname,
        email,
        hashedPassword: password,
      });

      expect(user).toHaveProperty('email', email);
      expect(user).toHaveProperty('password', 'hashedPassword');
    });

    it('should throw an error if user creation fails', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValue(
        new Error('User creation failed')
      );

      await expect(
        userRepository.create({
          name,
          surname,
          email,
          hashedPassword: password,
        })
      ).rejects.toThrow(new HttpError(500, 'The user could not be created'));
    });
  });

  describe('findByEmail', () => {
    const email = 'test@gmail.com';

    it('should find a user and return it successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const user = await userRepository.findByEmail(email);

      expect(user).toBe(mockUser);
    });

    it('should throw an error if the user can not be found', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(
        new Error('Fail')
      );

      await expect(userRepository.findByEmail(email)).rejects.toThrow(
        new HttpError(500, 'The user could not be found')
      );
    });
  });

  describe('isEmailExist', () => {
    const email = 'test@gmail.com';

    it('should return true if the email exist', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const isEmailExist = await userRepository.isEmailExist(email);

      expect(isEmailExist).toBe(true);
    });

    it('should throw an error if the user can not be found', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(
        new Error('Fail')
      );

      await expect(userRepository.isEmailExist(email)).rejects.toThrow(
        new HttpError(500, 'The email could not be checked')
      );
    });
  });
});
