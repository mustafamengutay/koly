import { NextFunction, Request, Response } from 'express';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';

import {
  postSignUp,
  postLogin,
} from '../../controllers/authentication.controller';
import AuthenticationService from '../../services/authentication.service';

describe('POST /api/v1/auth', () => {
  const authenticationService = AuthenticationService.getInstance();

  let req: MockRequest<Request>;
  let res: MockResponse<Response>;
  let next: NextFunction;

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('/signUp (postSignUp Controller)', () => {
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

    beforeEach(() => {
      authenticationService.signUp = jest.fn();
    });

    it('should return 201 status code on successful user creation', async () => {
      (authenticationService.signUp as jest.Mock).mockResolvedValue(user);

      await postSignUp(req, res, next);

      expect(res.statusCode).toBe(201);
    });

    it('should respond with a success status and data on successful user creation', async () => {
      (authenticationService.signUp as jest.Mock).mockResolvedValue(user);

      await postSignUp(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { user });
    });

    it('should pass the error to the errorHandler if user creation fails', async () => {
      const error = new Error('Fail');
      (authenticationService.signUp as jest.Mock).mockRejectedValue(error);

      await postSignUp(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('/login (postLogin Controller)', () => {
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
      authenticationService.login = jest.fn();
    });

    it('should return 200 status code on successful login', async () => {
      (authenticationService.login as jest.Mock).mockResolvedValue(token);

      await postLogin(req, res, next);

      expect(res.statusCode).toBe(200);
    });

    it('should respond with a login token on successful login', async () => {
      (authenticationService.login as jest.Mock).mockResolvedValue(token);

      await postLogin(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { token });
    });

    it('should pass the error to the errorHandler if login fails', async () => {
      const error = new Error('Fail');
      (authenticationService.login as jest.Mock).mockRejectedValue(error);

      await postLogin(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
