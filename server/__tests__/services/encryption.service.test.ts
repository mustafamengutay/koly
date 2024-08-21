import 'reflect-metadata';
import bcrypt from 'bcryptjs';

import { EncryptionService } from '../../services/encryption.service';

import { HttpError } from '../../types/errors';

describe('EncryptionService', () => {
  let encryptionService: EncryptionService;

  beforeEach(() => {
    bcrypt.compare = jest.fn();
    bcrypt.hash = jest.fn();

    encryptionService = new EncryptionService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isPasswordCorrect', () => {
    const mockPassword = 'password';
    const mockHashedPassword = 'hashedPassword';

    it('should throw an error if the comparison fails', async () => {
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error('Fail'));

      await expect(
        encryptionService.isPasswordCorrect(mockPassword, mockHashedPassword)
      ).rejects.toThrow(
        new HttpError(500, 'The password could not be compared')
      );
    });
  });

  describe('hashPassword', () => {
    const mockPassword = 'password';
    const mockHashedPassword = 'hashedPassword';

    it('should return a hashed password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      const hashedPassword = await encryptionService.hashPassword(mockPassword);

      expect(hashedPassword).toBe(mockHashedPassword);
    });

    it('should throw an error if hashing fails', async () => {
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Fail'));

      await expect(
        encryptionService.hashPassword(mockPassword)
      ).rejects.toThrow(new HttpError(500, 'The password could not be hashed'));
    });
  });
});
