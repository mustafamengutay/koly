import { Request, Response, NextFunction } from 'express';
import * as authenticationService from '../services/authentication.service';

export async function postSignUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, surname, email, password } = req.body;

  try {
    const newUser = await authenticationService.signUp(
      name,
      surname,
      email,
      password
    );

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function postLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    const token: string = await authenticationService.login(email, password);

    res.status(200).json({
      status: 'success',
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}
