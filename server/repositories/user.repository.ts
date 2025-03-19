import prisma from '../configs/database';
import { User } from '@prisma/client';
import { HttpError } from '../types/errors';

export async function create(data: {
  name: string;
  surname: string;
  email: string;
  hashedPassword: string;
}): Promise<User> {
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: data.hashedPassword,
      },
    });

    return user;
  } catch {
    throw new HttpError(500, 'The user could not be created');
  }
}

export async function findByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch {
    throw new HttpError(500, 'The user could not be found');
  }
}

export async function isEmailExist(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return !!user;
  } catch {
    throw new HttpError(500, 'The email could not be checked');
  }
}
