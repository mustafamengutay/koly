import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { LoginDto } from '@app/common/auth/dtos/login.dto';
import { User } from 'apps/user/src/user.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let configService: DeepMocked<ConfigService>;
  let jwtService: DeepMocked<JwtService>;
  let userClient: DeepMocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'USER_CLIENT',
          useValue: createMock<ClientProxy>(),
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<DeepMocked<JwtService>>(JwtService);
    configService = module.get<DeepMocked<ConfigService>>(ConfigService);
    userClient = module.get<DeepMocked<ClientProxy>>('USER_CLIENT');
    jest.spyOn(bcrypt, 'compare');
  });

  it('should define all dependencies', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
    expect(userClient).toBeDefined();
  });

  describe('login', () => {
    it('should generate login token', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'testPassword',
      };
      const user: Partial<User> = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        password: 'hashedTestPassword',
      };

      const userObservable = of({ data: { user } });

      jest.spyOn(userClient, 'send').mockReturnValue(userObservable);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('test-token');

      // Act
      const result = await authService.login(loginDto);

      // Assert
      expect(result).toEqual({ token: 'test-token' });
    });

    it('should throw UNAUTHORIZED error if password is incorrect', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'testPassword',
      };
      const user: Partial<User> = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        password: 'hashedTestPassword',
      };

      const userObservable = of({ data: { user } });

      jest.spyOn(userClient, 'send').mockReturnValue(userObservable);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(
        new RpcException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Password is wrong. Please try again',
        }),
      );
    });

    it('should handle microservice error correctly', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'testPassword',
      };

      const errorResponse = { statusCode: 404, message: 'User not found' };

      jest
        .spyOn(userClient, 'send')
        .mockReturnValue(throwError(() => errorResponse));

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(
        new RpcException({
          statusCode: 404,
          message: 'User not found',
        }),
      );
    });
  });
});
