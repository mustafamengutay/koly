import { Request, Response, NextFunction } from 'express';
import {
  MockRequest,
  MockResponse,
  createRequest,
  createResponse,
} from 'node-mocks-http';

import { errorHandler } from '../../middlewares/errorHandler';
import { HttpBodyValidationError, HttpError } from '../../types/errors';

describe('errorHandler', () => {
  let req: MockRequest<Request>;
  let res: MockResponse<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = createRequest();
    res = createResponse();
  });

  describe('Error Type', () => {
    const error = new Error('Something went wrong');

    it('should send a response with a status code which is 500', () => {
      errorHandler(error, req, res, next);

      expect(res.statusCode).toBe(500);
    });

    it('should send a response with a status which is error', () => {
      errorHandler(error, req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'error');
    });

    it('should send a response with a status and a message', () => {
      errorHandler(error, req, res, next);

      expect(res._getJSONData()).toEqual({
        status: 'error',
        message: expect.any(String),
      });
    });
  });

  describe('HttpError Type', () => {
    const error = new HttpError(431, 'Request Header Fields Too Large');

    it('should send a response with a status code which is 500', () => {
      errorHandler(error, req, res, next);

      expect(res.statusCode).toBe(431);
    });

    it('should send a response with a status which is error', () => {
      errorHandler(error, req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'error');
    });

    it('should send a response with a status and a message', () => {
      errorHandler(error, req, res, next);

      expect(res._getJSONData()).toEqual({
        status: 'error',
        message: expect.any(String),
      });
    });
  });

  describe('HttpBodyValidationError Type', () => {
    const error = new HttpBodyValidationError(409, []);

    it('should send a response with a status code which is 500', () => {
      errorHandler(error, req, res, next);

      expect(res.statusCode).toBe(409);
    });

    it('should send a response with a status which is fail', () => {
      errorHandler(error, req, res, next);

      expect(res._getJSONData()).toHaveProperty('status', 'fail');
    });

    it('should send a response with a status and a data which stores errors', () => {
      errorHandler(error, req, res, next);

      expect(res._getJSONData()).toEqual({
        status: 'fail',
        data: expect.any(Array),
      });
    });
  });
});
