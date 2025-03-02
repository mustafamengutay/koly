import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ConflictException } from '@nestjs/common';
import { SignupData } from '@app/common/user/interfaces/signup.interface';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: DeepMocked<Repository<User>>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock<DeepMocked<Repository<User>>>(),
        },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
    userRepository = app.get<DeepMocked<Repository<User>>>(
      getRepositoryToken(User),
    );
    jest.spyOn(bcrypt, 'hash');
  });

  it('should define all dependencies', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      // Arrange
      const signupData: SignupData = {
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        password: 'securepassword',
      };

      userRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      const newUser = {
        id: 1,
        ...signupData,
        password: 'hashedpassword',
      } as User;
      userRepository.save.mockResolvedValue(newUser);

      // Act
      const result = await userService.signup(signupData);
      console.log(result);

      // Assert
      expect(result).toMatchObject({
        user: {
          id: 1,
          name: signupData.name,
          surname: signupData.surname,
          email: signupData.email,
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      const signupData: SignupData = {
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        password: 'securepassword',
      };

      userRepository.findOne.mockResolvedValue({
        id: 1,
        ...signupData,
      } as User);

      // Assert
      await expect(userService.signup(signupData)).rejects.toThrow(
        new RpcException(new ConflictException('User is already exist')),
      );
    });
  });
});
