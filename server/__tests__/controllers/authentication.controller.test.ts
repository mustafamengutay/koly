import { NextFunction, Request, Response } from 'express';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';

import { postSignUp } from '../../controllers/authentication.controller';
import AuthenticationService from '../../services/authentication.service';

describe('POST /api/v1/auth', () => {
  describe('/signUp (postSignUp Controller)', () => {
    const authenticationService = AuthenticationService.getInstance();

    let req: MockRequest<Request>;
    let res: MockResponse<Response>;
    let next: NextFunction;

    authenticationService.signUp = jest.fn();
    beforeEach(() => {
      res = createResponse();
      next = jest.fn();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return 201 status code on successful user creation', async () => {
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

      (authenticationService.signUp as jest.Mock).mockResolvedValue(user);

      await postSignUp(req, res, next);

      expect(res.statusCode).toBe(201);
    });

    it('should respond with a success status and data on successful user creation', async () => {
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

      (authenticationService.signUp as jest.Mock).mockResolvedValue(user);

      await postSignUp(req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'success');
      expect(res._getJSONData()).toHaveProperty('data', { user });
    });

    it('should pass the error to the errorHandler if user creation fails', async () => {
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

      const error = new Error('Fail');
      (authenticationService.signUp as jest.Mock).mockRejectedValue(error);

      await postSignUp(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
