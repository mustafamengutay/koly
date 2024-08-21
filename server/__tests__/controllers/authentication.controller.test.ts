import 'reflect-metadata';
import { Container } from 'inversify';

import { NextFunction, Request, Response } from 'express';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';

import { AuthenticationService } from '../../services/authentication.service';
import { AuthenticationController } from '../../controllers/authentication.controller';

describe('POST /api/v1/auth', () => {
  let req: MockRequest<Request>;
  let res: MockResponse<Response>;
  let next: NextFunction;

  let container: Container;
  let authenticationController: AuthenticationController;

  let mockAuthenticationService: { signUp: Function; login: Function };

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();

    mockAuthenticationService = {
      signUp: jest.fn(),
      login: jest.fn(),
    };

    container = new Container();
    container
      .bind<object>(AuthenticationService)
      .toConstantValue(mockAuthenticationService);
    container.bind(AuthenticationController).toSelf();

    authenticationController = container.get(AuthenticationController);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('postSignUp', () => {
    const user = {
      name: 'Test',
      surname: 'Data',
      email: 'test@gmail.com',
      password: 'test123',
    };

    req = createRequest({
      method: 'POST',
      url: '/api/v1/auth/signup',
      body: user,
    });

    it('should return 201 status code on successful user creation', async () => {
      (mockAuthenticationService.signUp as jest.Mock).mockResolvedValue(user);

      await authenticationController.postSignUp(req, res, next);

      expect(res.statusCode).toBe(201);
    });

    it('should respond with a success status and data on successful user creation', async () => {
      mockAuthenticationService.signUp = jest.fn().mockResolvedValue(user);

      await authenticationController.postSignUp(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { user });
    });

    it('should pass the error to the errorHandler if user creation fails', async () => {
      const error = new Error('Fail');
      mockAuthenticationService.signUp = jest.fn().mockRejectedValue(error);

      await authenticationController.postSignUp(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('postLogin Controller', () => {
    const user = {
      email: 'test@gmail.com',
      password: 'test123',
    };

    const token = 'complexToken';

    req = createRequest({
      method: 'POST',
      url: '/api/v1/auth/login',
      body: user,
    });

    beforeEach(() => {
      mockAuthenticationService.login = jest.fn();
    });

    it('should return 200 status code on successful login', async () => {
      mockAuthenticationService.login = jest.fn().mockResolvedValue(token);

      await authenticationController.postLogin(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with a login token on successful login', async () => {
      mockAuthenticationService.login = jest.fn().mockResolvedValue(token);

      await authenticationController.postLogin(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { token });
    });

    it('should pass the error to the errorHandler if login fails', async () => {
      const error = new Error('Fail');
      mockAuthenticationService.login = jest.fn().mockRejectedValue(error);

      await authenticationController.postLogin(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
