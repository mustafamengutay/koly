import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UserService } from 'apps/user/src/user.service';
import { LoginDto } from '@app/common/auth/dtos/login.dto';
import { TokenResponseDto } from '@app/common/auth/dtos/token-response.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: createMock<DeepMocked<UserService>>(),
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'testPassword',
      };

      const loginServiceMock = jest.spyOn(authService, 'login');

      // Act
      await authController.login(loginDto);

      // Assert
      expect(loginServiceMock).toHaveBeenCalledWith(loginDto);
    });

    it('should return TokenResponseDto on successful login', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'testPassword',
      };

      const expectedResponse: TokenResponseDto = {
        token: 'test-token',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(expectedResponse);

      // Act
      const result = await authController.login(loginDto);

      // Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
