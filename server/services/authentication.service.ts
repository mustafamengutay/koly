import * as userRepository from '../repositories/user.repository';
import * as encryptionService from './encryption.service';
import * as tokenService from './token.service';
import { HttpError } from '../types/errors';

/**
 * Creates a user and returns it. If any error occurs, it throws that
 * specific error.
 * @param name New user's name
 * @param surname New user's surname
 * @param email New user's email
 * @param password New user's password
 * @returns New user object.
 */
export async function signUp(
  name: string,
  surname: string,
  email: string,
  password: string
) {
  const isEmailExist = await userRepository.isEmailExist(email);
  if (isEmailExist) {
    throw new HttpError(409, 'The email is already exist');
  }

  const hashedPassword = await encryptionService.hashPassword(password);
  const newUser = await userRepository.create({
    name,
    surname,
    email,
    hashedPassword,
  });

  return newUser;
}

/**
 * Creates a login token for a user and returns it. If any error occurs,
 * it throws that specific error.
 * @param email User's email
 * @param password User's password
 * @returns A login token
 */
export async function login(email: string, password: string): Promise<string> {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new HttpError(404, 'The user does not exist');
  }

  const isPasswordCorrect = await encryptionService.isPasswordCorrect(
    password,
    user.password
  );
  if (!isPasswordCorrect) {
    throw new HttpError(401, 'The password is wrong');
  }

  const token: string = tokenService.createLoginToken(user.id, user.email);

  return token;
}
