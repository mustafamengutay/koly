import { NextFunction, Response } from 'express';
import { CustomRequest } from '../../types/customRequest';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';
import jwt from 'jsonwebtoken';

import { verifyUser } from '../../middlewares/authorization';
import { HttpError } from '../../types/errors';

describe('verifyUser', () => {
  let req: MockRequest<CustomRequest>;
  let res: MockResponse<Response>;
  let next: NextFunction;

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();
    jwt.verify = jest.fn().mockReturnValue({ id: '1' });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should verify the user and pass to the next middleware', () => {
    req = createRequest({
      method: 'POST',
      headers: {
        Authorization: 'Bearer complexToken',
      },
    });

    verifyUser(req, res, next);

    expect(req.userId).toBe('1');
    expect(next).toHaveBeenCalled();
  });

  it('should thrown an error if the Authentication header does not exist', () => {
    req = createRequest({
      method: 'POST',
    });

    try {
      verifyUser(req, res, next);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).message).toBe('Token could not be found');
      expect(req.userId).toBe(undefined);
    }
  });

  it('should thrown an error if the token cannot be verified', () => {
    req = createRequest({
      method: 'POST',
      headers: {
        Authorization: 'Bearer complexToken',
      },
    });

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('any error message');
    });

    try {
      verifyUser(req, res, next);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).message).toBe('Token could not be verified');
      expect(req.userId).toBe(undefined);
    }
  });

  it('should thrown an error if the decoded data is null', () => {
    req = createRequest({
      method: 'POST',
      headers: {
        Authorization: 'Bearer complexToken',
      },
    });

    (jwt.verify as jest.Mock).mockReturnValue(null);

    try {
      verifyUser(req, res, next);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).message).toBe('User is not authenticated');
      expect(req.userId).toBe(undefined);
    }
  });
});
