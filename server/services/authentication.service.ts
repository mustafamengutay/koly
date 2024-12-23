import { inject, injectable } from 'inversify';

import { ITokenService } from './token.service';
import { IEncryptionService } from './encryption.service';

import IUserRepository from '../types/repositories/IUserRepository';
import { HttpError } from '../types/errors';

@injectable()
export class AuthenticationService {
  private userRepository: IUserRepository;
  private tokenService: ITokenService;
  private encryptionService: IEncryptionService;

  public constructor(
    @inject('IUserRepository') userRepository: IUserRepository,
    @inject('ITokenService') tokenService: ITokenService,
    @inject('IEncryptionService') encryptionService: IEncryptionService
  ) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.encryptionService = encryptionService;
  }

  /**
   * Creates a user and returns it. If any error occurs, it throws that
   * specific error.
   * @param name New user's name
   * @param surname New user's surname
   * @param email New user's email
   * @param password New user's password
   * @returns New user object.
   */
  public async signUp(
    name: string,
    surname: string,
    email: string,
    password: string
  ) {
    const isEmailExist = await this.userRepository.isEmailExist(email);
    if (isEmailExist) {
      throw new HttpError(409, 'The email is already exist');
    }

    const hashedPassword = await this.encryptionService.hashPassword(password);
    const newUser = await this.userRepository.create(
      name,
      surname,
      email,
      hashedPassword
    );

    return newUser;
  }

  /**
   * Creates a login token for a user and returns it. If any error occurs,
   * it throws that specific error.
   * @param email User's email
   * @param password User's password
   * @returns A login token
   */
  public async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new HttpError(404, 'The user does not exist');
    }

    const isPasswordCorrect = await this.encryptionService.isPasswordCorrect(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new HttpError(401, 'The password is wrong');
    }

    const token: string = this.tokenService.createLoginToken(
      user.id,
      user.email
    );

    return token;
  }
}
