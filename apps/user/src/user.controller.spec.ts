import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import {
  SignupRequestDto,
  SignupResponseDto,
} from '@app/common/user/dtos/signup.dto';
import { UserEmailDto } from '@app/common/user/dtos/user-email.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: DeepMocked<UserService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: createMock<DeepMocked<UserService>>(),
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<DeepMocked<UserService>>(UserService);
  });

  describe('signup', () => {
    it('should call userService.signup', async () => {
      // Arrange
      const signupData: SignupRequestDto = {
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        password: 'securepassword',
      };

      const signupServiceMock = jest.spyOn(userService, 'signup');

      // Act
      await userController.signup(signupData);

      // Assert
      expect(signupServiceMock).toHaveBeenCalledWith(signupData);
    });

    it('should call return SignupResponseDto', async () => {
      // Arrange
      const signupData: SignupRequestDto = {
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        password: 'securepassword',
      };

      const expectedResponse: SignupResponseDto = {
        user: {
          id: 1,
          name: 'John',
          surname: 'Doe',
          email: 'john@example.com',
        },
      };

      const signupServiceMock = jest.spyOn(userService, 'signup');
      signupServiceMock.mockResolvedValue(expectedResponse);

      // Act
      const result = await userController.signup(signupData);

      // Assert
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findOne', () => {
    it('should call userService.findOne with correct parameters', async () => {
      // Arrange
      const userEmailDto: UserEmailDto = { email: 'john@example.com' };

      const findOneServiceMock = jest.spyOn(userService, 'findOne');

      // Act
      await userController.findOne(userEmailDto);

      // Assert
      expect(findOneServiceMock).toHaveBeenCalledWith(userEmailDto);
    });

    it('should return UserResponseDto when user is found', async () => {
      // Arrange
      const userEmailDto: UserEmailDto = { email: 'john@example.com' };
      const expectedResponse = {
        user: {
          id: 1,
          name: 'John',
          surname: 'Doe',
          email: 'john@example.com',
        },
      };

      jest.spyOn(userService, 'findOne').mockResolvedValue(expectedResponse);

      // Act
      const result = await userController.findOne(userEmailDto);

      // Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
