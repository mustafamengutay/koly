import { HttpBodyValidationError, HttpError } from '../../types/errors';

describe('Errors', () => {
  describe('HttpError', () => {
    it('throws HttpError with status code and message', () => {
      const throwHttpError = () => {
        throw new HttpError(500, 'Internal Server Error');
      };

      expect(() => throwHttpError()).toThrow(
        expect.objectContaining({
          statusCode: 500,
          message: 'Internal Server Error',
        })
      );
    });
  });

  describe('HttpBodyValidationError', () => {
    it('throws HttpBodyValidationError with status code and error messages', () => {
      const throwHttpBodyValidationError = () => {
        throw new HttpBodyValidationError(500, []);
      };

      expect(() => throwHttpBodyValidationError()).toThrow(
        expect.objectContaining({
          statusCode: 500,
          errors: expect.any(Array),
        })
      );
    });
  });
});
