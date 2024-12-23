import { User } from '@prisma/client';

export default interface IUserRepository {
  create(data: {
    name: string;
    surname: string;
    email: string;
    hashedPassword: string;
  }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  isEmailExist(email: string): Promise<boolean>;
}
