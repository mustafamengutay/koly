import { Request, Response, NextFunction } from 'express';

import AuthenticationService from '../services/authentication.service';

const authenticationService = AuthenticationService.getInstance();

export const postSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};
