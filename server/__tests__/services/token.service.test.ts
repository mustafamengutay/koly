import 'reflect-metadata';
import jwt from 'jsonwebtoken';

import { TokenService } from '../../services/token.service';

import { HttpError } from '../../types/errors';

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeEach(() => {
    jwt.sign = jest.fn();

    tokenService = new TokenService();
  });

  describe('createLoginToken', () => {
    const mockId = 1;
    const mockEmail = 'test@gmail.com';
    const mockToken = 'complexToken';

    it('should create a new token and return it successfully', () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const token = tokenService.createLoginToken(mockId, mockEmail);

      expect(token).toBe(mockToken);
    });

    it('should throw an error if new token creation fails', () => {
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new Error('Fail');
      });

      expect(() => tokenService.createLoginToken(mockId, mockEmail)).toThrow(
        new HttpError(500, 'The token could not be created')
      );
    });
  });
});
