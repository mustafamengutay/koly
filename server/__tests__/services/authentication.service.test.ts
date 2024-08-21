import 'reflect-metadata';
import { Container } from 'inversify';

import { IUserRepository } from '../../repositories/user.repository';
import { ITokenService } from '../../services/token.service';
import { IEncryptionService } from '../../services/encryption.service';
import { AuthenticationService } from '../../services/authentication.service';

import { HttpError } from '../../types/errors';

describe('AuthenticationService', () => {
  let container: Container;
  let mockUserRepository: IUserRepository;
  let mockTokenService: ITokenService;
  let mockEncryptionService: IEncryptionService;
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    mockUserRepository = {
      createUser: jest.fn(),
      findUserByEmail: jest.fn(),
      isEmailExist: jest.fn(),
    };
    mockTokenService = {
      createLoginToken: jest.fn(),
    };
    mockEncryptionService = {
      isPasswordCorrect: jest.fn(),
      hashPassword: jest.fn(),
    };

    container = new Container();
    container.bind('IUserRepository').toConstantValue(mockUserRepository);
    container.bind('ITokenService').toConstantValue(mockTokenService);
    container.bind('IEncryptionService').toConstantValue(mockEncryptionService);
    container.bind(AuthenticationService).toSelf();

    authenticationService = container.get(AuthenticationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    const name = 'test';
    const surname = 'data';
    const email = 'test@gmail.com';
    const password = 'test123';

    it('should create a user if the email does not exist', async () => {
      (mockUserRepository.isEmailExist as jest.Mock).mockResolvedValue(false);
      (mockUserRepository.createUser as jest.Mock).mockResolvedValue({
        name: 'test',
        surname: 'data',
        email: 'test@gmail.com',
        password: 'hashedPassword',
      });

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
      mockUserRepository.isEmailExist = jest.fn().mockResolvedValue({
        email: 'test@gmail.com',
      });

      await expect(
        authenticationService.signUp(name, surname, email, password)
      ).rejects.toThrow(HttpError);
    });

    it('should throw an http error if password hashing fails', async () => {
      mockUserRepository.isEmailExist = jest.fn().mockResolvedValue(null);
      mockEncryptionService.hashPassword = jest
        .fn()
        .mockRejectedValue(
          new HttpError(500, 'The password could not be hashed')
        );

      await expect(
        authenticationService.signUp(name, surname, email, password)
      ).rejects.toThrow(HttpError);
    });

    it('should throw an error if user creation fails', async () => {
      const mockError = new HttpError(500, 'The user could not be created');
      mockUserRepository.isEmailExist = jest.fn().mockResolvedValue(null);
      mockEncryptionService.hashPassword = jest
        .fn()
        .mockResolvedValue('hashedPassword');
      mockUserRepository.createUser = jest.fn().mockRejectedValue(mockError);

      await expect(
        authenticationService.signUp(name, surname, email, password)
      ).rejects.toThrow(mockError);
    });
  });

  describe('login', () => {
    const email = 'test@gmail.com';
    const password = 'test123';

    it('should return a login token if the login step successfull', async () => {
      const token = 'complexToken';

      mockEncryptionService.isPasswordCorrect = jest
        .fn()
        .mockResolvedValue(true);
      mockTokenService.createLoginToken = jest.fn().mockReturnValue(token);
      mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue({
        email,
        password,
      });

      await expect(authenticationService.login(email, password)).resolves.toBe(
        token
      );
    });

    it('should throw an Http error if the user does not exist', async () => {
      mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue(null);

      await expect(
        authenticationService.login(email, password)
      ).rejects.toThrow(new HttpError(404, 'The user does not exist'));
    });

    it('should throw an error if the password is incorrect', async () => {
      mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue({
        email,
        password,
      });
      mockEncryptionService.isPasswordCorrect = jest
        .fn()
        .mockResolvedValue(false);

      await expect(
        authenticationService.login(email, password)
      ).rejects.toThrow(new HttpError(401, 'The password is wrong'));
    });
  });
});
