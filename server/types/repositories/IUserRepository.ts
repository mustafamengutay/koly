import { User } from '@prisma/client';

export default interface IUserRepository {
  createUser(
    name: string,
    surname: string,
    email: string,
    hashedPassword: string
  ): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  isEmailExist(email: string): Promise<boolean>;
}
